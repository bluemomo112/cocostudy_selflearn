/**
 * Our tutor personas (new_knowledge_tutor / review_tutor) emit structured "cards" as fenced code
 * blocks tagged ```card:<kind> inside an otherwise normal prose reply — see
 * docs/导师SOP与提示词草稿-202609202256.md §6 for the exact format each kind uses
 * (roadmap-new, roadmap-review, review-result, review-order).
 *
 * This splits a message's raw content into ordered text/card segments so the UI can render the
 * card part specially instead of as a generic "CARD" code block, while leaving the surrounding
 * prose untouched. A still-streaming (unterminated) card block is held back from the visible text
 * until its closing fence arrives, instead of flashing raw markdown.
 */

export type CardKind = 'roadmap-new' | 'roadmap-review' | 'review-result' | 'review-order';

export interface RoadmapCardItem {
  title: string;
  focus?: string;
  material?: string;
  outcome?: string;
}

export interface RoadmapCardData {
  kind: 'roadmap-new' | 'roadmap-review';
  items: RoadmapCardItem[];
}

export interface ReviewResultCardData {
  kind: 'review-result';
  mastered: string[];
  weak: string[];
}

export interface ReviewOrderCardData {
  kind: 'review-order';
  items: string[];
}

export type ParsedCard = RoadmapCardData | ReviewResultCardData | ReviewOrderCardData;

export type ContentSegment =
  | { type: 'text'; text: string }
  | { type: 'card'; kind: CardKind; raw: string; data: ParsedCard | null };

const FENCE_OPEN = /```card:([\w-]+)[^\n]*\n/;

/** Split raw message content into ordered text/card segments. Cheap regex work, safe to call every render. */
export function splitContentSegments(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let rest = content;
  // Bail out after a generous number of blocks so a pathological input can't loop forever.
  for (let guard = 0; guard < 20; guard++) {
    const openMatch = rest.match(FENCE_OPEN);
    if (!openMatch || openMatch.index === undefined) {
      if (rest) segments.push({ type: 'text', text: rest });
      return segments;
    }
    const before = rest.slice(0, openMatch.index);
    if (before) segments.push({ type: 'text', text: before });
    const kind = openMatch[1] as CardKind;
    const afterOpen = rest.slice(openMatch.index + openMatch[0].length);
    const closeIdx = afterOpen.indexOf('```');
    if (closeIdx === -1) {
      // Still streaming — the closing fence hasn't arrived. Hold this part back rather than
      // showing a half-finished code block; it'll resolve into a card (or text) once it closes.
      return segments;
    }
    const body = afterOpen.slice(0, closeIdx);
    segments.push({ type: 'card', kind, raw: body, data: parseCard(kind, body) });
    rest = afterOpen.slice(closeIdx + 3);
  }
  if (rest) segments.push({ type: 'text', text: rest });
  return segments;
}

// 「标题」· 重点：概括   （标题必填，重点可选，· 和 . 都当分隔符）
const TITLE_LINE = /「([^」]+)」(?:\s*[·.]\s*重点[：:]\s*(.+))?/;
const MATERIAL_LINE = /《([^》]+)》/;
const OUTCOME_LINE = /学完你能[：:]\s*(.+)/;

function parseRoadmapItems(body: string): RoadmapCardItem[] {
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: RoadmapCardItem[] = [];
  let current: RoadmapCardItem | null = null;
  for (const line of lines) {
    const numbered = line.match(/^\d+[.、]\s*(.+)/);
    const content = numbered ? numbered[1] : line;
    const titleMatch = content.match(TITLE_LINE);
    if (numbered && titleMatch) {
      if (current) items.push(current);
      current = { title: titleMatch[1].trim(), focus: titleMatch[2]?.trim() };
      const m = content.match(MATERIAL_LINE);
      if (m) current.material = m[1].trim();
      const o = content.match(OUTCOME_LINE);
      if (o) current.outcome = o[1].trim();
      continue;
    }
    if (!current) continue;
    const materialMatch = content.match(MATERIAL_LINE);
    if (materialMatch && !current.material) {
      current.material = materialMatch[1].trim();
      continue;
    }
    const outcomeMatch = content.match(OUTCOME_LINE);
    if (outcomeMatch) {
      current.outcome = outcomeMatch[1].trim();
      continue;
    }
    // 识别不了的附加行（格式有偏差时），拼进 outcome 兜底，不丢内容
    current.outcome = current.outcome ? `${current.outcome} ${content}` : content;
  }
  if (current) items.push(current);
  return items;
}

function parseReviewResult(body: string): ReviewResultCardData | null {
  const mastered: string[] = [];
  const weak: string[] = [];
  let bucket: string[] | null = null;
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (/^(掌握较好|做得好|已掌握)/.test(line)) { bucket = mastered; continue; }
    if (/^(薄弱点|待加强|需加强)/.test(line)) { bucket = weak; continue; }
    const item = line.replace(/^[-*]\s*|^\d+[.、]\s*/, '').trim();
    if (item && bucket) bucket.push(item);
  }
  return mastered.length || weak.length ? { kind: 'review-result', mastered, weak } : null;
}

function parseReviewOrder(body: string): ReviewOrderCardData | null {
  const items = body
    .split('\n')
    .map((l) => l.replace(/^[-*]\s*|^\d+[.、]\s*/, '').trim())
    .filter(Boolean);
  return items.length ? { kind: 'review-order', items } : null;
}

function parseCard(kind: CardKind, body: string): ParsedCard | null {
  try {
    if (kind === 'roadmap-new' || kind === 'roadmap-review') {
      const items = parseRoadmapItems(body);
      return items.length ? { kind, items } : null;
    }
    if (kind === 'review-result') return parseReviewResult(body);
    if (kind === 'review-order') return parseReviewOrder(body);
    return null;
  } catch {
    return null;
  }
}
