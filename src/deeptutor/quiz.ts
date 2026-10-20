/**
 * Quiz generation and subjective grading are mocked in this UI-only build; objective grading is local.
 *
 * Answer encoding used across self-learn's question components (keep in sync with them):
 *   single_choice    -> the option text
 *   multiple_choice  -> array of option texts
 *   true_false       -> 'true' | 'false'
 *   fill_in_blank    -> blanks joined with '|'
 *   short_answer     -> free text (the reference answer, for the teacher / AI judge)
 */
import type { TaskQuestion } from '../types/shared-context';
import { MOCK_LATENCY_MS, sleep } from './config';

/** One generated question as DeepTutor returns it: result.metadata.summary.results[].qa_pair */
interface QaPair {
  question_id?: string;
  question: string;
  question_type: string;
  options?: Record<string, string> | null;
  correct_answer?: string;
  explanation?: string;
  difficulty?: string;
}

export interface GenerateQuestionsOptions {
  topic: string;
  count: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  /** DeepTutor question types: choice, concept (true/false), fill_in_blank, short_answer, written, coding */
  types?: string[];
  knowledgeBases: string[];
  signal?: AbortSignal;
}

const LETTERS = 'ABCDEFGH';

function blankCount(text: string): number {
  const matches = text.match(/_{2,}|＿{2,}|（\s*）|\(\s*\)/g);
  return Math.max(1, matches?.length ?? 1);
}

function trueOrFalse(value: string | undefined): 'true' | 'false' {
  return /^(true|t|yes|对|正确|是|√|✓)/i.test((value ?? '').trim()) ? 'true' : 'false';
}

/** deep_question leaves retrieval markers such as "[source-1]" in its text; students should not see them. */
const stripCitations = (text: string) => text.replace(/\s*[\[【](?:source|rag|web|doc)[-_ ]?\d+[\]】]/gi, '').trim();

export function qaPairToTaskQuestion(rawPair: QaPair, index: number, idPrefix: string): TaskQuestion {
  const pair: QaPair = {
    ...rawPair,
    question: stripCitations(rawPair.question),
    explanation: rawPair.explanation ? stripCitations(rawPair.explanation) : rawPair.explanation,
    correct_answer: rawPair.correct_answer ? stripCitations(rawPair.correct_answer) : rawPair.correct_answer,
    options: rawPair.options
      ? Object.fromEntries(Object.entries(rawPair.options).map(([k, v]) => [k, stripCitations(v)]))
      : rawPair.options,
  };
  const id = `${idPrefix}_${index}`;
  const explanation = pair.explanation || undefined;
  const base = { id, content: pair.question, explanation, points: 1 };
  const answer = (pair.correct_answer ?? '').trim();

  if (pair.question_type === 'choice' && pair.options) {
    const entries = Object.entries(pair.options);
    const options = entries.map(([, text]) => text);
    const letters = answer.toUpperCase().replace(/[^A-H]/g, '').split('');
    const texts = letters.map((l) => pair.options?.[l]).filter((t): t is string => Boolean(t));
    if (texts.length > 1) return { ...base, type: 'multiple_choice', options, answer: texts };
    return { ...base, type: 'single_choice', options, answer: texts[0] ?? options[LETTERS.indexOf(answer.toUpperCase())] ?? answer };
  }
  if (pair.question_type === 'concept') {
    return { ...base, type: 'true_false', answer: trueOrFalse(answer) };
  }
  if (pair.question_type === 'fill_in_blank') {
    return { ...base, type: 'fill_in_blank', answer, blanks: blankCount(pair.question) };
  }
  // short_answer, written, coding
  return { ...base, type: 'short_answer', answer };
}

const MOCK_QA_PAIRS: QaPair[] = [
  { question: '植物工厂最核心的特点是什么？', question_type: 'choice', options: { A: '完全依赖自然光照', B: '人工控制光、温、水、肥等环境因子', C: '只能种植水稻', D: '必须建在农田旁边' }, correct_answer: 'B', explanation: '植物工厂通过人工精确控制环境因子，实现全年连续、稳定的生产。' },
  { question: '植物工厂可以不受季节和天气影响，全年连续生产。', question_type: 'concept', correct_answer: 'true', explanation: '环境由系统自动调控，因此基本不受外界季节与天气限制。' },
  { question: '水培系统中，植物根系所需的养分来自 ______。', question_type: 'fill_in_blank', correct_answer: '营养液', explanation: '水培不使用土壤，养分溶解在营养液中直接供给根系。' },
  { question: '以下哪些属于植物工厂中需要监测和控制的环境因子？（多选）', question_type: 'choice', options: { A: '光照强度', B: '空气湿度', C: '营养液浓度', D: '月相变化' }, correct_answer: 'ABC', explanation: '光照、湿度和营养液浓度都直接影响植物生长，月相不在控制范围内。' },
  { question: '请简述植物工厂相比传统农业的两个优势。', question_type: 'short_answer', correct_answer: '节约土地和水资源；不受气候影响，可全年稳定生产；可精确控制品质。', explanation: '答出任意两点且说明原因即可得分。' },
];

/** Mock: returns canned questions (cycled to the requested count) after a short delay. */
export async function generateQuestions(options: GenerateQuestionsOptions): Promise<TaskQuestion[]> {
  await sleep(MOCK_LATENCY_MS * 3);
  const prefix = `q_${Date.now()}`;
  return Array.from({ length: Math.max(1, options.count) }, (_, i) => qaPairToTaskQuestion(MOCK_QA_PAIRS[i % MOCK_QA_PAIRS.length], i, prefix));
}

// ── grading ──────────────────────────────────────────────────────────────

const norm = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim();

/** Make "$\frac{4}{5}$", "4/5" and " 4 / 5 " compare equal. */
function normalizeBlank(value: string): string {
  return norm(value)
    .toLowerCase()
    .replace(/\$/g, '')
    .replace(/\\left|\\right|\\,|\\!/g, '')
    .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2')
    .replace(/\\text\{([^{}]*)\}/g, '$1')
    .replace(/\s+/g, '');
}

/** Fill-in-blank answers that need real math typesetting are judged by the LLM instead. */
const NEEDS_JUDGE = /\\(sqrt|pi|sin|cos|tan|cdot|times|div|circ|angle|triangle|sum|int)/;

export function isObjective(question: TaskQuestion): boolean {
  if (question.type === 'short_answer') return false;
  if (question.type === 'fill_in_blank') return !NEEDS_JUDGE.test(String(question.answer));
  return true;
}

export function gradeObjective(question: TaskQuestion, userAnswer: string | string[] | undefined): boolean {
  const user = userAnswer ?? '';
  switch (question.type) {
    case 'single_choice':
      return norm(user) === norm(question.answer);
    case 'multiple_choice': {
      const a = new Set((Array.isArray(user) ? user : [user]).map(norm).filter(Boolean));
      const b = new Set((Array.isArray(question.answer) ? question.answer : [question.answer]).map(norm));
      return a.size === b.size && [...a].every((x) => b.has(x));
    }
    case 'true_false':
      return String(user).toLowerCase() === String(question.answer).toLowerCase();
    case 'fill_in_blank': {
      const expected = String(question.answer).split('|').map(normalizeBlank);
      const given = (Array.isArray(user) ? user.join('|') : String(user)).split('|').map(normalizeBlank);
      return expected.length === given.length && expected.every((x, i) => x === given[i]);
    }
    default:
      return false;
  }
}

export interface SubjectiveVerdict {
  score: number;
  correct: boolean;
  feedback: string;
}

/** Mock: any answer of reasonable length passes with a canned comment. */
export async function judgeSubjective(
  _question: TaskQuestion,
  userAnswer: string | string[] | undefined,
  _signal?: AbortSignal,
): Promise<SubjectiveVerdict> {
  const given = Array.isArray(userAnswer) ? userAnswer.join('；') : norm(userAnswer);
  if (!given) return { score: 0, correct: false, feedback: '这道题没有作答。' };
  await sleep(MOCK_LATENCY_MS);
  const correct = given.length >= 8;
  return correct
    ? { score: 85, correct: true, feedback: '抓住了主要要点，表述也比较完整。再补充一个具体例子会更好。' }
    : { score: 40, correct: false, feedback: '方向没错，但内容还比较简略，试着多写一两个要点，并说明原因。' };
}

/** The prompt that makes the tutor analyse a finished quiz (shown to the student as the tutor's reply). */
export function buildQuizAnalysisPrompt(input: {
  taskTitle: string;
  rows: Array<{ index: number; content: string; userAnswer: string; correctAnswer: string; correct: boolean; explanation?: string }>;
}): string {
  const lines = input.rows.map(
    (r) =>
      `第 ${r.index} 题（${r.correct ? '答对' : '答错'}）：${r.content}\n  学生答案：${r.userAnswer || '（未作答）'}\n  正确答案：${r.correctAnswer}${r.explanation ? `\n  解析：${r.explanation}` : ''}`,
  );
  const wrong = input.rows.filter((r) => !r.correct).length;
  return [
    `学生刚完成了「${input.taskTitle}」，共 ${input.rows.length} 题，答错 ${wrong} 题。以下是作答情况：`,
    '',
    ...lines,
    '',
    wrong === 0
      ? '请祝贺学生全部答对，用两三句话说明他这次掌握得好的地方，并给一个可以继续挑战的方向。'
      : '请像老师一样做错因分析：先肯定答对的部分；再逐题指出答错题背后的知识漏洞或思维误区（不要只重复正确答案）；最后给出 2-3 条具体的复习建议。有知识库资料时请引用出处。语气亲切，简洁。',
  ].join('\n');
}
