/**
 * "Learning tools" (Studio): generate study material from the space's knowledge base with DeepTutor.
 *
 * Every generator returns exactly the data shape the matching viewer in InteractiveViewerModal /
 * ResourceInlineViewer already consumes, so the viewers do not change:
 *   flashcards -> { front, back }[]            mind map -> { center, branches: { title, items[] }[] }
 *   audio      -> { time, title, content }[]   documents -> markdown
 *   interactive page -> complete HTML (rendered in a sandboxed iframe via srcDoc)
 */
import { runOneShot, runOneShotJson } from './oneShot';

export interface StudioContext {
  /** Knowledge bases holding the space's resources; generation needs at least one. */
  knowledgeBases: string[];
  /** Free-text focus from the tool's configuration dialog ("重点讲…"). */
  focus?: string;
  signal?: AbortSignal;
}

function requireKb(ctx: StudioContext) {
  if (ctx.knowledgeBases.length === 0) {
    throw new Error('还没有可用的学习资料：请先上传资料并等待解析完成。');
  }
}

const GROUNDING =
  '请先检索知识库，只依据知识库里的学习资料来做，不要编造资料里没有的内容；用简体中文，面向中小学生，表达清晰。';

const focusLine = (focus?: string) => (focus?.trim() ? `重点关注：${focus.trim()}。` : '');

// ── flashcards ───────────────────────────────────────────────────────────

export interface Flashcard {
  front: string;
  back: string;
}

export async function generateFlashcards(ctx: StudioContext, opts: { count: number }): Promise<Flashcard[]> {
  requireKb(ctx);
  const { data } = await runOneShotJson<{ cards?: Flashcard[] }>(
    [
      GROUNDING,
      `请从学习资料里提炼 ${opts.count} 张记忆卡片，用于复习：正面是一个问题、概念或关键词，背面是简洁准确的答案（不超过 60 字，纯文本，不要 Markdown 和公式符号）。`,
      focusLine(ctx.focus),
      '只输出 JSON，不要其他内容：{"cards":[{"front":"…","back":"…"}]}',
    ]
      .filter(Boolean)
      .join('\n'),
    { knowledgeBases: ctx.knowledgeBases, signal: ctx.signal },
  );
  const cards = (data.cards ?? []).filter((c) => c?.front && c?.back);
  if (cards.length === 0) throw new Error('没有生成出记忆卡片，请重试。');
  return cards;
}

// ── mind map ─────────────────────────────────────────────────────────────

export interface MindMap {
  center: string;
  branches: Array<{ title: string; items: string[] }>;
}

export async function generateMindMap(ctx: StudioContext): Promise<MindMap> {
  requireKb(ctx);
  const { data } = await runOneShotJson<Partial<MindMap>>(
    [
      GROUNDING,
      '请把学习资料的知识结构整理成一张两层思维导图：一个中心主题，4-6 个分支，每个分支下 3-5 个要点（每个要点不超过 20 字）。',
      focusLine(ctx.focus),
      '只输出 JSON，不要其他内容：{"center":"中心主题","branches":[{"title":"分支名","items":["要点","要点"]}]}',
    ]
      .filter(Boolean)
      .join('\n'),
    { knowledgeBases: ctx.knowledgeBases, signal: ctx.signal },
  );
  const branches = (data.branches ?? []).filter((b) => b?.title && Array.isArray(b.items) && b.items.length > 0);
  if (!data.center || branches.length === 0) throw new Error('没有生成出思维导图，请重试。');
  return { center: data.center, branches };
}

// ── documents (markdown) ─────────────────────────────────────────────────

export type DocKind = 'summary' | 'key_points' | 'examples' | 'concept_search';

const DOC_PROMPTS: Record<DocKind, string> = {
  summary: '请为学习资料写一份结构清晰的学习总结：先用两三句话概括全貌，再按主题分小节，最后给出 3 条复习建议。',
  key_points: '请提炼学习资料的必记要点：用编号列表，每条一句话，并在括号里标注出处。最后补充最容易混淆的 2-3 个地方。',
  examples: '请从学习资料里挑选或改编 3 个有代表性的实例，每个实例包含：情境、用到的知识点、分析过程、结论。',
  concept_search: '请列出学习资料里的核心概念，每个概念用「定义 + 一个生活中的例子」解释，并说明概念之间的联系。',
};

export async function generateDocument(ctx: StudioContext, kind: DocKind): Promise<string> {
  requireKb(ctx);
  const result = await runOneShot([GROUNDING, DOC_PROMPTS[kind], focusLine(ctx.focus), '直接输出 Markdown 正文，可以用表格和 $…$ 公式。'].filter(Boolean).join('\n'), {
    knowledgeBases: ctx.knowledgeBases,
    signal: ctx.signal,
  });
  if (!result.answer.trim()) throw new Error('没有生成出内容，请重试。');
  return result.answer;
}

// ── audio overview ───────────────────────────────────────────────────────

export interface AudioChapter {
  time: string;
  title: string;
  content: string;
}

/** A spoken-style walkthrough script, split into chapters. (Audio itself needs a TTS service; see docs.) */
export async function generateAudioScript(ctx: StudioContext, opts: { chapters: number }): Promise<AudioChapter[]> {
  requireKb(ctx);
  const { data } = await runOneShotJson<{ chapters?: Array<{ title: string; content: string }> }>(
    [
      GROUNDING,
      `请把学习资料改写成一段适合朗读的音频讲稿，分成 ${opts.chapters} 个章节：口语化、有节奏，像老师在给学生讲解，每章 80-150 字，不用 Markdown 和特殊符号。`,
      focusLine(ctx.focus),
      '只输出 JSON，不要其他内容：{"chapters":[{"title":"章节标题","content":"讲稿正文"}]}',
    ]
      .filter(Boolean)
      .join('\n'),
    { knowledgeBases: ctx.knowledgeBases, signal: ctx.signal },
  );
  const chapters = (data.chapters ?? []).filter((c) => c?.title && c?.content);
  if (chapters.length === 0) throw new Error('没有生成出讲稿，请重试。');
  let seconds = 0;
  return chapters.map((c) => {
    const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    seconds += Math.max(20, Math.round(c.content.length / 4.5)); // ~4.5 characters per second of speech
    return { time, title: c.title, content: c.content };
  });
}

// ── interactive page (explainer animation / visualization / simulation) ──

export interface InteractivePage {
  title: string;
  description: string;
  html: string;
}

/** DeepTutor's `visualize` capability, asked for a self-contained HTML page. Takes 1-2 minutes. */
export async function generateInteractivePage(
  ctx: StudioContext,
  opts: { goal: string; includeControls?: boolean },
): Promise<InteractivePage> {
  requireKb(ctx);
  const prompt = [
    GROUNDING,
    `请做一个自包含的交互式网页来演示：${opts.goal}`,
    opts.includeControls === false ? '以动画演示为主，不需要控件。' : '带有滑块或按钮，让学生能动手调节参数并看到实时变化。',
    focusLine(ctx.focus),
  ]
    .filter(Boolean)
    .join('\n');
  const result = await runOneShot(prompt, {
    knowledgeBases: ctx.knowledgeBases,
    extra: { capability: 'visualize', config: { render_mode: 'html' } },
    signal: ctx.signal,
  });
  const meta = result.events.find((e) => e.type === 'result')?.metadata as
    | { code?: { content?: string }; presentation?: { title?: string; description?: string } }
    | undefined;
  const html = meta?.code?.content;
  if (!html) throw new Error(result.errorMessage || '没有生成出互动页面，请重试。');
  return { title: meta?.presentation?.title || opts.goal, description: meta?.presentation?.description || '', html };
}
