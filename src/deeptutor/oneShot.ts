/**
 * Run a single DeepTutor turn outside the visible chat (quiz generation, grading, flashcards, ...).
 * Each call gets its own connection and a fresh DeepTutor session, which is deleted afterwards so these
 * internal turns do not pile up in the user's DeepTutor history.
 */
import { DeepTutorChat, type TurnCallbacks, type TurnRequest, type TurnResult } from './chatSession';
import { deeptutorApiUrl } from './config';

const TAG = '[deeptutor:oneshot]';

export interface OneShotOptions {
  knowledgeBases?: string[];
  extra?: TurnRequest['extra'];
  language?: string;
  /** Keep the DeepTutor session (default: delete it once the turn is done). */
  keepSession?: boolean;
  onAnswer?: (answer: string) => void;
  onEvent?: TurnCallbacks['onEvent'];
  signal?: AbortSignal;
}

/** Soft-delete then purge (DeepTutor only purges what is already in the recycle bin). Best effort. */
export async function discardSession(sessionId: string | undefined): Promise<void> {
  if (!sessionId) return;
  try {
    const base = `/api/sessions/${encodeURIComponent(sessionId)}`;
    await fetch(deeptutorApiUrl(base), { method: 'DELETE' });
    await fetch(deeptutorApiUrl(`${base}/purge`), { method: 'DELETE' });
  } catch (error) {
    console.warn(TAG, 'discard session failed', sessionId, error);
  }
}

export async function runOneShot(content: string, options: OneShotOptions = {}): Promise<TurnResult> {
  const chat = new DeepTutorChat();
  const onAbort = () => void chat.cancel();
  options.signal?.addEventListener('abort', onAbort);
  try {
    const result = await chat.runTurn(
      {
        content,
        sessionId: null,
        tools: [],
        knowledgeBases: options.knowledgeBases ?? [],
        language: options.language,
        extra: options.extra,
      },
      { onAnswer: options.onAnswer, onEvent: options.onEvent },
    );
    if (result.status === 'failed' || result.status === 'rejected') {
      throw new Error(result.errorMessage || `DeepTutor turn ${result.status}`);
    }
    if (!options.keepSession) {
      // The title event follows `done`; give it a moment before the session goes away.
      setTimeout(() => void discardSession(result.sessionId), 3000);
    }
    return result;
  } finally {
    options.signal?.removeEventListener('abort', onAbort);
    chat.dispose();
  }
}

/** Thrown when model output cannot be parsed as JSON; keeps the full raw text so callers can salvage it. */
export class JsonParseError extends Error {
  constructor(public raw: string) {
    super(`model output is not valid JSON: ${raw.slice(0, 120)}`);
  }
}

/** Pull a JSON value out of model output: plain JSON, fenced ```json blocks, or JSON embedded in prose. */
export function extractJson<T = unknown>(text: string): T {
  const trimmed = text.trim();
  const candidates: string[] = [trimmed];
  const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(trimmed);
  if (fence) candidates.push(fence[1].trim());
  const firstObj = trimmed.indexOf('{');
  const lastObj = trimmed.lastIndexOf('}');
  if (firstObj >= 0 && lastObj > firstObj) candidates.push(trimmed.slice(firstObj, lastObj + 1));
  const firstArr = trimmed.indexOf('[');
  const lastArr = trimmed.lastIndexOf(']');
  if (firstArr >= 0 && lastArr > firstArr) candidates.push(trimmed.slice(firstArr, lastArr + 1));
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // try the next candidate
    }
  }
  throw new JsonParseError(trimmed);
}

// Models often put raw ASCII double quotes inside JSON strings (e.g. 函数"一一对应"), which breaks JSON.parse.
const JSON_RULES = '\n注意：JSON 字符串里不要出现英文双引号，需要引用词语时用「」；不要有多余的逗号或注释。';

/** Ask for JSON, retrying once when the reply cannot be parsed. */
export async function runOneShotJson<T>(content: string, options: OneShotOptions = {}): Promise<{ data: T; result: TurnResult }> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt =
      attempt === 0
        ? `${content}${JSON_RULES}`
        : `${content}${JSON_RULES}\n\n上一次的回复不是合法 JSON。这次只输出 JSON 本身，不要任何解释，不要 Markdown 代码块。`;
    const result = await runOneShot(prompt, options);
    try {
      return { data: extractJson<T>(result.answer), result };
    } catch (error) {
      lastError = error;
      console.warn(TAG, 'JSON parse failed, attempt', attempt + 1, error);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
