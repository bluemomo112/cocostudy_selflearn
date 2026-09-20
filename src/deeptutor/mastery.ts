/**
 * DeepTutor mastery paths: a topic = modules -> knowledge points, with a deterministic mastery gate,
 * questions and grading done by the tutor, and a "learning map" we read back.
 *
 * Mapping used here (one path per space and student; DeepTutor's paths are per workspace user and one path
 * can only have one state-changing turn at a time, so paths must not be shared between students):
 *   space knowledge base -> topic source, module -> LearningPathNode, tutor turn -> chat with mastery_* fields.
 *
 * REST: POST /api/mastery-paths/topics/draft, POST /api/mastery-paths/topics,
 *       GET /api/mastery-paths/progress/{id}/map
 */
import type { LearningPathNode } from '../types/self-study';
import { deeptutorApiUrl } from './config';

const TAG = '[deeptutor:mastery]';

export interface MasteryKnowledgePoint {
  id: string;
  name: string;
  type: string;
  status: 'new' | 'learning' | 'mastered';
  mastery: number;
}

export interface MasteryModule {
  id: string;
  name: string;
  objective?: string;
  order: number;
  mastered: number;
  total: number;
  knowledge_points: MasteryKnowledgePoint[];
}

export interface MasteryNext {
  action: string;
  module_id?: string;
  module_name?: string;
  knowledge_point_id?: string;
  knowledge_point_name?: string;
}

export interface MasteryMap {
  book_id: string;
  name: string;
  path_revision: number;
  next?: MasteryNext;
  map: {
    counts: { mastered: number; learning: number; new: number; total: number };
    due_reviews?: number;
    complete?: boolean;
    modules: MasteryModule[];
  };
}

/** The mastery question card the tutor emits (tool_result.metadata.tool_metadata.mastery_question). */
export interface MasteryQuestion {
  question_id: string;
  prompt: string;
  question_type?: string;
  objective?: { name?: string };
  difficulty?: string;
  options?: Array<{ label: string; body: string }>;
  allow_free_text?: boolean;
}

/** The grading result (tool_metadata.mastery_grade.result). */
export interface MasteryGrade {
  question_id: string;
  is_correct: boolean;
  learner_answer?: string;
  correct_label?: string;
  correct_body?: string;
  explanation?: string;
}

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return typeof body?.detail === 'string' ? body.detail : JSON.stringify(body?.detail ?? body);
  } catch {
    return res.statusText;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(deeptutorApiUrl(path), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${await readError(res)}`);
  return res.json() as Promise<T>;
}

/** Draft an outline from the space's knowledge base and create the path. Returns the new path id. */
export async function createMasteryPath(input: { name: string; goal: string; kbName: string; kbLabel: string }): Promise<string> {
  // The draft endpoint has no language option; asking in the goal keeps the outline in Chinese.
  const goal = `${input.goal}。请模块名、学习目标、知识点名称全部使用简体中文。`;
  const sources = [{ kind: 'knowledge_base', source_id: input.kbName, label: input.kbLabel }];
  console.log(TAG, 'draft', input.name);
  const draft = await postJson<{ description?: string; modules?: unknown[] }>('/api/mastery-paths/topics/draft', {
    name: input.name,
    goal,
    sources,
    must_cover: [],
  });
  if (!draft.modules?.length) throw new Error('DeepTutor did not return an outline for this knowledge base');
  const created = await postJson<{ path_id: string }>('/api/mastery-paths/topics', {
    name: input.name,
    goal: input.goal,
    sources,
    must_cover: [],
    description: draft.description ?? '',
    emoji: '📚',
    modules: draft.modules,
  });
  console.log(TAG, 'created', created.path_id);
  return created.path_id;
}

/** null when the path no longer exists (deleted in DeepTutor). */
export async function fetchMasteryMap(pathId: string): Promise<MasteryMap | null> {
  const res = await fetch(deeptutorApiUrl(`/api/mastery-paths/progress/${encodeURIComponent(pathId)}/map`));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`mastery map failed: ${res.status} ${await readError(res)}`);
  return res.json();
}

const MINUTES_PER_KNOWLEDGE_POINT = 6;

/** One node per module; the module the tutor will work on next is the "learning" one. */
export function toLearningPath(map: MasteryMap): { nodes: LearningPathNode[]; currentNodeId: string } {
  const currentId = map.next?.module_id ?? '';
  const nodes: LearningPathNode[] = [...map.map.modules]
    .sort((a, b) => a.order - b.order)
    .map((m) => {
      const done = m.total > 0 && m.mastered >= m.total;
      const started = m.knowledge_points.some((k) => k.status !== 'new');
      const status: LearningPathNode['status'] = done ? 'mastered' : m.id === currentId || started ? 'learning' : 'pending';
      return { id: m.id, title: m.name, status, estimatedTime: Math.max(5, m.total * MINUTES_PER_KNOWLEDGE_POINT) };
    });
  return { nodes, currentNodeId: currentId || nodes.find((n) => n.status === 'learning')?.id || '' };
}
