/**
 * Quiz generation (DeepTutor `deep_question`), objective grading (local) and subjective grading (LLM).
 *
 * Answer encoding used across self-learn's question components (keep in sync with them):
 *   single_choice    -> the option text
 *   multiple_choice  -> array of option texts
 *   true_false       -> 'true' | 'false'
 *   fill_in_blank    -> blanks joined with '|'
 *   short_answer     -> free text (the reference answer, for the teacher / AI judge)
 */
import type { TaskQuestion } from '../types/shared-context';
import { JsonParseError, runOneShot, runOneShotJson } from './oneShot';

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

/** Generate quiz questions grounded in the space's knowledge base. Takes a minute or more for a handful of questions. */
export async function generateQuestions(options: GenerateQuestionsOptions): Promise<TaskQuestion[]> {
  const config: Record<string, unknown> = {
    mode: 'custom',
    topic: options.topic,
    num_questions: options.count,
    difficulty: options.difficulty ?? 'medium',
  };
  if (options.types?.length) config.question_types = options.types;

  const result = await runOneShot(`请围绕「${options.topic}」出 ${options.count} 道题。`, {
    knowledgeBases: options.knowledgeBases,
    extra: { capability: 'deep_question', config },
    signal: options.signal,
  });
  const resultEvent = result.events.find((e) => e.type === 'result');
  const summary = (resultEvent?.metadata as { summary?: { results?: Array<{ qa_pair?: QaPair }> } } | undefined)?.summary;
  const pairs = (summary?.results ?? []).map((r) => r.qa_pair).filter((p): p is QaPair => Boolean(p));
  if (pairs.length === 0) throw new Error(result.errorMessage || 'DeepTutor did not return any questions');
  const prefix = `q_${Date.now()}`;
  return pairs.map((pair, i) => qaPairToTaskQuestion(pair, i, prefix));
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

/** Ask the tutor to grade a free-text answer against the reference answer. */
export async function judgeSubjective(
  question: TaskQuestion,
  userAnswer: string | string[] | undefined,
  signal?: AbortSignal,
): Promise<SubjectiveVerdict> {
  const given = Array.isArray(userAnswer) ? userAnswer.join('；') : norm(userAnswer);
  if (!given) return { score: 0, correct: false, feedback: '这道题没有作答。' };
  const prompt = [
    '你是一位认真、温和的老师，正在批改学生的一道题。',
    `题目：${question.content}`,
    `参考答案：${Array.isArray(question.answer) ? question.answer.join('；') : question.answer}`,
    question.explanation ? `解析：${question.explanation}` : '',
    `学生的回答：${given}`,
    '',
    '请判断学生的回答是否抓住了参考答案的要点，给出 0-100 的整数分，60 分及以上算正确。评语用 2-3 句话，先说哪里答对了，再指出缺了什么，语气鼓励，面向中小学生。',
    '只输出 JSON，不要其他内容：{"score": 整数, "correct": true或false, "feedback": "评语"}',
  ]
    .filter(Boolean)
    .join('\n');
  let data: Partial<SubjectiveVerdict>;
  try {
    data = (await runOneShotJson<Partial<SubjectiveVerdict>>(prompt, { signal })).data;
  } catch (error) {
    // The verdict is a flat object, so a broken JSON reply (typically raw quotes inside the feedback) can still be read.
    if (!(error instanceof JsonParseError)) throw error;
    const score = /"score"\s*:\s*(\d+)/.exec(error.raw)?.[1];
    if (score === undefined) throw error;
    const correct = /"correct"\s*:\s*(true|false)/.exec(error.raw)?.[1];
    const feedback = /"feedback"\s*:\s*"([\s\S]*?)"?\s*\}?\s*$/.exec(error.raw)?.[1] ?? '';
    data = { score: Number(score), correct: correct ? correct === 'true' : undefined, feedback };
  }
  const score = Math.max(0, Math.min(100, Math.round(Number(data.score ?? 0))));
  return { score, correct: typeof data.correct === 'boolean' ? data.correct : score >= 60, feedback: String(data.feedback ?? '') };
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
