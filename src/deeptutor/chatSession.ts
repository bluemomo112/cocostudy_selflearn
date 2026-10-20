/**
 * UI-only build: a mock tutor connection. `runTurn` streams canned text through the same callbacks the real
 * connection used (thinking -> tool call -> sources -> answer), plus the three special turns the UI renders:
 *   - first turn of a chat      -> intro + a `card:roadmap-new` roadmap card
 *   - mastery-path (guided) chat -> ask_user intake card, then a mastery question; answering it grades it
 *   - quiz analysis prompt       -> a canned error analysis
 */
import { MOCK_LATENCY_MS, sleep } from './config';
import { advanceMockMastery } from './mastery';

export type TurnStatus = 'completed' | 'failed' | 'cancelled' | 'rejected';

export interface TurnRequest {
  content: string;
  /** null/undefined on the first turn of a conversation. */
  sessionId?: string | null;
  knowledgeBases?: string[];
  tools?: string[];
  language?: string;
  /** Extra start_turn fields (persona, workspace_mode, mastery_answer, ...). */
  extra?: Record<string, unknown>;
}

/** One retrieved passage the tutor cites. */
export interface TurnSource {
  type: string;
  title: string;
  snippet: string;
  page?: string;
  score?: number;
  url?: string;
  kbName?: string;
  chunkId?: string;
}

/** Questions the tutor pauses the turn for (`ask_user`); answer them with DeepTutorChat.submitUserReply. */
export interface AskUserPayload {
  intro?: string | null;
  questions: Array<{
    id: string;
    prompt: string;
    header?: string;
    options?: Array<string | { label: string; description?: string }>;
    multi_select?: boolean;
    allow_free_text?: boolean;
    placeholder?: string | null;
  }>;
}

/** A tool the tutor ran during the turn (e.g. a knowledge-base retrieval and its query). */
export interface TurnToolCall {
  name: string;
  query?: string;
}

/** The only event shape the UI reads: `tool_result` events carrying mastery question / grade metadata. */
export interface StreamEvent {
  type: string;
  content?: string;
  metadata: Record<string, unknown>;
}

export interface TurnCallbacks {
  onSession?(sessionId: string, turnId: string): void;
  /** Full answer text so far. */
  onAnswer?(answer: string): void;
  /** Full reasoning text so far. */
  onThinking?(thinking: string): void;
  onSources?(sources: TurnSource[]): void;
  onToolCalls?(calls: TurnToolCall[]): void;
  /** The turn is now waiting for the student's answers (see submitUserReply). */
  onAskUser?(payload: AskUserPayload): void;
  onEvent?(event: StreamEvent, events: StreamEvent[]): void;
}

export interface TurnResult {
  status: TurnStatus;
  answer: string;
  thinking: string;
  sources: TurnSource[];
  toolCalls: TurnToolCall[];
  sessionId?: string;
  turnId?: string;
  errorMessage?: string;
  events: StreamEvent[];
}

const MOCK_SOURCES: TurnSource[] = [
  { type: 'rag', title: '认识植物工厂', snippet: '植物工厂是在封闭环境中，利用人工光源和自动控制系统，全年连续生产植物的设施。', page: '3', score: 0.92, chunkId: 'mock-1' },
  { type: 'rag', title: '认识植物工厂学生手册', snippet: '水培是不使用土壤，将植物根系浸在含有各种营养元素的营养液中培养的方法。', page: '7', score: 0.87, chunkId: 'mock-2' },
];

const ROADMAP_REPLY = `你好！今天我们来学《认识植物工厂》。植物工厂里没有田地，却能全年种出蔬菜——它是怎么做到的？我们会一边读书、一边讲解、一边小练习来搞清楚这个问题。

\`\`\`card:roadmap-new
1. 「认识植物工厂」· 重点：定义与特点
   《认识植物工厂》
   学完你能：说出植物工厂的定义和两个特点
2. 「环境因子与控制」
   《认识植物工厂》
   学完你能：举例说明光、温、水、肥对生长的影响
3. 「水培系统」
   《认识植物工厂学生手册》
   学完你能：区分常见的水培方式
\`\`\`

先热身一个小问题：你觉得植物没有土壤，还能从哪里获得养分？`;

const GENERIC_REPLY = `好问题！结合资料来看：

- 植物工厂通过**人工光源**和**自动控制系统**，让植物不受季节、天气影响。
- 水培用**营养液**代替土壤，养分由根系直接吸收。

你可以试着用自己的话再说一遍，我来帮你看看哪里还可以补充。`;

const ANALYSIS_REPLY = `这次做得不错，先肯定你答对的部分。

**错因分析**
- 有一题把"营养液"和"土壤"的作用混在了一起：营养液是直接给根系供应养分，土壤在水培里并不存在。
- 多选题容易漏选，建议逐项对照资料判断。

**复习建议**
1. 重读《认识植物工厂》里"环境因子"一节。
2. 自己画一张"光、温、水、肥 → 植物生长"的关系图。`;

const MASTERY_QUESTION = {
  prompt: '水培与传统土培相比，植物获得养分的方式有什么不同？',
  question_type: 'choice',
  objective: { name: '与传统农业的区别' },
  difficulty: 'easy',
  options: [
    { label: 'A', body: '根系从土壤中吸收养分' },
    { label: 'B', body: '根系直接从营养液中吸收养分' },
    { label: 'C', body: '叶片直接吸收空气中的养分' },
  ],
};

const INTAKE: AskUserPayload = {
  intro: '开始之前，我想先了解一下你的情况。',
  questions: [
    { id: 'prior', header: '基础', prompt: '你之前接触过植物工厂或水培吗？', options: [{ label: '没接触过' }, { label: '听说过一点' }, { label: '自己种过' }], allow_free_text: true },
    { id: 'goal', header: '目标', prompt: '这次学习你最想达到什么？', options: [{ label: '理解概念' }, { label: '完成设计任务' }, { label: '应对考试' }], multi_select: true, allow_free_text: true },
  ],
};

const CHUNK = 3;
const CHUNK_DELAY_MS = 25;
let seq = 0;

export class DeepTutorChat {
  private running = false;
  private cancelled = false;
  private pendingReply: ((ok: boolean) => void) | null = null;

  get busy(): boolean {
    return this.running;
  }

  async runTurn(request: TurnRequest, callbacks: TurnCallbacks = {}): Promise<TurnResult> {
    if (this.running) throw new Error('a turn is already running on this chat');
    this.running = true;
    this.cancelled = false;
    const sessionId = request.sessionId ?? `mock-session-${++seq}`;
    const turnId = `mock-turn-${++seq}`;
    const events: StreamEvent[] = [];
    const result: TurnResult = { status: 'completed', answer: '', thinking: '', sources: [], toolCalls: [], sessionId, turnId, events };
    const emit = (event: StreamEvent) => {
      events.push(event);
      callbacks.onEvent?.(event, events);
    };

    try {
      callbacks.onSession?.(sessionId, turnId);
      const extra = request.extra ?? {};
      const guided = extra.workspace_mode === 'mastery_path';
      const masteryAnswer = extra.mastery_answer as { question_id: string; text: string } | undefined;

      result.thinking = '先回顾学生的问题，再从资料里检索相关段落……';
      callbacks.onThinking?.(result.thinking);
      await sleep(MOCK_LATENCY_MS);
      result.toolCalls = [{ name: 'rag', query: request.content.slice(0, 30) }];
      callbacks.onToolCalls?.([...result.toolCalls]);
      await sleep(MOCK_LATENCY_MS);
      if ((request.knowledgeBases ?? []).length > 0 || guided) {
        result.sources = MOCK_SOURCES;
        callbacks.onSources?.([...MOCK_SOURCES]);
      }

      let text: string;
      let question = false;
      if (guided && masteryAnswer) {
        const correct = masteryAnswer.text.startsWith('B');
        if (correct) advanceMockMastery();
        emit({
          type: 'tool_result',
          metadata: {
            tool_metadata: {
              mastery_grade: {
                result: {
                  question_id: masteryAnswer.question_id,
                  is_correct: correct,
                  learner_answer: masteryAnswer.text,
                  correct_label: 'B',
                  correct_body: '根系直接从营养液中吸收养分',
                  explanation: '水培没有土壤，养分溶解在营养液里，由根系直接吸收。',
                },
              },
            },
          },
        });
        text = correct ? '回答正确！你已经抓住了水培的关键。我们来看下一个小问题。' : '差一点：水培里没有土壤，养分来自营养液。我们再来一道巩固一下。';
        question = true;
      } else if (guided && !request.sessionId) {
        callbacks.onAskUser?.(INTAKE);
        const ok = await new Promise<boolean>((resolve) => (this.pendingReply = resolve));
        this.pendingReply = null;
        if (!ok) throw new Error('cancelled');
        text = '好的，了解了。那我们从最基础的开始，先来一道小题。';
        question = true;
      } else if (guided) {
        text = '我们继续往下学。';
        question = true;
      } else if (request.content.includes('错因分析') || request.content.includes('答错')) {
        text = ANALYSIS_REPLY;
      } else if (!request.sessionId || request.content.includes('请开始今天的学习')) {
        text = ROADMAP_REPLY;
      } else {
        text = GENERIC_REPLY;
      }

      for (let i = CHUNK; i < text.length + CHUNK; i += CHUNK) {
        if (this.cancelled) throw new Error('cancelled');
        result.answer = text.slice(0, i);
        callbacks.onAnswer?.(result.answer);
        await sleep(CHUNK_DELAY_MS);
      }
      if (question) {
        emit({ type: 'tool_result', metadata: { tool_metadata: { mastery_question: { question_id: `mq-${++seq}`, ...MASTERY_QUESTION } } } });
      }
    } catch (error) {
      result.status = this.cancelled ? 'cancelled' : 'failed';
      if (!this.cancelled) result.errorMessage = error instanceof Error ? error.message : String(error);
    } finally {
      this.running = false;
    }
    return result;
  }

  async cancel(): Promise<boolean> {
    if (!this.running) return false;
    this.cancelled = true;
    this.pendingReply?.(false);
    return true;
  }

  /** Answer the pending `ask_user` questions; the same turn then continues. */
  async submitUserReply(_answers: Array<{ questionId: string; text: string }>): Promise<boolean> {
    if (!this.pendingReply) return false;
    this.pendingReply(true);
    return true;
  }

  dispose(): void {
    void this.cancel();
  }
}
