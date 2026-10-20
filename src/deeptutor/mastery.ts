/**
 * Mastery path types plus a mock path: the learning map is canned and advances by one knowledge point
 * each time the mock tutor grades an answer (see chatSession.ts).
 */
import type { LearningPathNode } from '../types/self-study';
import { MOCK_LATENCY_MS, sleep } from './config';

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

/** The mastery question card the tutor emits. */
export interface MasteryQuestion {
  question_id: string;
  prompt: string;
  question_type?: string;
  objective?: { name?: string };
  difficulty?: string;
  options?: Array<{ label: string; body: string }>;
  allow_free_text?: boolean;
}

/** The grading result for a mastery question. */
export interface MasteryGrade {
  question_id: string;
  is_correct: boolean;
  learner_answer?: string;
  correct_label?: string;
  correct_body?: string;
  explanation?: string;
}

const MODULES: Array<{ id: string; name: string; objective: string; points: string[] }> = [
  { id: 'm1', name: '认识植物工厂', objective: '说出植物工厂的定义和基本特点', points: ['植物工厂的定义', '与传统农业的区别', '主要应用场景'] },
  { id: 'm2', name: '环境因子与控制', objective: '理解光、温、水、肥对植物生长的影响', points: ['光照与光周期', '温湿度控制', '营养液配方'] },
  { id: 'm3', name: '水培系统设计', objective: '能为指定作物设计简单的水培容器', points: ['水培方式分类', '容器结构要点', '设计方案评价'] },
];

/** How many knowledge points the student has mastered so far (module-level so the map survives re-fetches). */
let masteredCount = 0;

/** Called by the mock tutor after a correct mastery answer. */
export function advanceMockMastery(): void {
  masteredCount = Math.min(masteredCount + 1, MODULES.reduce((n, m) => n + m.points.length, 0));
}

export async function createMasteryPath(_input: { name: string; goal: string; sources: Array<{ kbName: string; kbLabel: string }> }): Promise<string> {
  await sleep(MOCK_LATENCY_MS);
  return 'mock-path';
}

export async function fetchMasteryMap(_pathId: string): Promise<MasteryMap | null> {
  await sleep(MOCK_LATENCY_MS / 2);
  let seen = 0;
  let next: MasteryNext | undefined;
  const modules: MasteryModule[] = MODULES.map((m, i) => {
    const knowledge_points = m.points.map((name, j) => {
      const idx = seen++;
      const status: MasteryKnowledgePoint['status'] = idx < masteredCount ? 'mastered' : idx === masteredCount ? 'learning' : 'new';
      const kp: MasteryKnowledgePoint = { id: `${m.id}-k${j + 1}`, name, type: 'concept', status, mastery: status === 'mastered' ? 1 : status === 'learning' ? 0.4 : 0 };
      if (status === 'learning') next = { action: 'study', module_id: m.id, module_name: m.name, knowledge_point_id: kp.id, knowledge_point_name: name };
      return kp;
    });
    return { id: m.id, name: m.name, objective: m.objective, order: i + 1, mastered: knowledge_points.filter((k) => k.status === 'mastered').length, total: knowledge_points.length, knowledge_points };
  });
  const total = modules.reduce((n, m) => n + m.total, 0);
  const mastered = modules.reduce((n, m) => n + m.mastered, 0);
  return {
    book_id: 'mock-path',
    name: '学习路径',
    path_revision: masteredCount,
    next,
    map: { counts: { mastered, learning: next ? 1 : 0, new: total - mastered - (next ? 1 : 0), total }, complete: mastered === total, modules },
  };
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
