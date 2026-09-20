/**
 * One DeepTutor chat connection: runs a turn at a time, folds the event stream into
 * answer / thinking text, and resolves when the turn ends.
 *
 * Protocol notes (v2.0): the server assigns session ids (pass null on the first turn, keep the
 * one from the `session` event), one active turn per session, and `done` is not the last event
 * (the title `session_meta` follows it) -- we resolve on `done` and ignore the rest.
 */
import type { ServerEvent, StartTurnMessage, StreamEvent } from './model/protocol';
import { isNarrationMarker, recomputeAnswerContent, shouldAppendEventContent } from './lib/stream';
import { UnifiedTurnClient } from './transport/UnifiedTurnClient';
import { deeptutorWsUrl } from './config';

export type TurnStatus = 'completed' | 'failed' | 'cancelled' | 'rejected';

export interface TurnRequest {
  content: string;
  /** null/undefined on the first turn of a conversation. */
  sessionId?: string | null;
  knowledgeBases?: string[];
  /** Optional tools only; [] disables them (auto-mounted tools such as rag/ask_user stay). */
  tools?: string[];
  language?: string;
  /** Any other start_turn field (capability, persona, course_id, mastery_*, ...). */
  extra?: Partial<Omit<StartTurnMessage, 'type' | 'content'>>;
}

export interface TurnCallbacks {
  onSession?(sessionId: string, turnId: string): void;
  /** Full answer text so far (narration rounds already removed). */
  onAnswer?(answer: string): void;
  /** Full reasoning text so far. */
  onThinking?(thinking: string): void;
  /** Every stream event, plus the turn's events so far. */
  onEvent?(event: StreamEvent, events: StreamEvent[]): void;
}

export interface TurnResult {
  status: TurnStatus;
  answer: string;
  thinking: string;
  sessionId?: string;
  turnId?: string;
  errorMessage?: string;
  events: StreamEvent[];
}

interface ActiveTurn {
  callbacks: TurnCallbacks;
  events: StreamEvent[];
  answer: string;
  thinking: string;
  sessionId?: string;
  turnId?: string;
  errorMessage?: string;
  settle: (result: TurnResult) => void;
}

const TAG = '[deeptutor:chat]';

export class DeepTutorChat {
  private client: UnifiedTurnClient | null = null;
  private active: ActiveTurn | null = null;
  private settledTurnIds = new Set<string>();

  get busy(): boolean {
    return this.active !== null;
  }

  runTurn(request: TurnRequest, callbacks: TurnCallbacks = {}): Promise<TurnResult> {
    if (this.active) return Promise.reject(new Error('a turn is already running on this chat'));

    return new Promise<TurnResult>((resolve) => {
      const turn: ActiveTurn = {
        callbacks,
        events: [],
        answer: '',
        thinking: '',
        settle: (result) => {
          if (this.active !== turn) return;
          this.active = null;
          console.log(TAG, 'turn settled', { status: result.status, sessionId: result.sessionId, turnId: result.turnId, answerLen: result.answer.length });
          resolve(result);
        },
      };
      this.active = turn;

      const message: StartTurnMessage = {
        type: 'start_turn',
        content: request.content,
        session_id: request.sessionId ?? null,
        capability: 'chat',
        tools: request.tools ?? [],
        knowledge_bases: request.knowledgeBases ?? [],
        language: request.language ?? 'zh',
        config: {},
        ...request.extra,
      };
      console.log(TAG, 'start_turn', { sessionId: message.session_id, kb: message.knowledge_bases, tools: message.tools, contentLen: request.content.length });
      this.ensureClient().send(message);
    });
  }

  /** Ask the server to cancel the running turn; resolves whether it accepted. */
  async cancel(): Promise<boolean> {
    const turn = this.active;
    if (!turn?.turnId || !this.client) return false;
    console.log(TAG, 'cancel_turn', turn.turnId);
    return this.client.sendAwaitingAck({ type: 'cancel_turn', turn_id: turn.turnId });
  }

  dispose(): void {
    this.client?.disconnect();
    this.client = null;
    this.finish('cancelled', 'chat disposed');
  }

  private ensureClient(): UnifiedTurnClient {
    if (this.client) return this.client;
    const client = new UnifiedTurnClient(
      (event) => this.handleEvent(event),
      () => this.finish('failed', 'connection to DeepTutor closed'),
      { url: deeptutorWsUrl('/ws'), onControlFrame: (frame) => this.handleControlFrame(frame) },
    );
    client.connect();
    this.client = client;
    return client;
  }

  private handleControlFrame(frame: ServerEvent): void {
    if (frame.type !== 'protocol_error' || !this.active) return;
    const rejected = frame.error_code === 'start_turn_rejected';
    console.warn(TAG, 'protocol_error', frame.error_code, frame.message);
    this.finish(rejected ? 'rejected' : 'failed', frame.message || frame.error_code);
  }

  private handleEvent(event: StreamEvent): void {
    const turn = this.active;
    if (!turn) return;
    // The previous turn's title session_meta can land after `done`, i.e. during the next turn.
    if (event.turn_id && this.settledTurnIds.has(event.turn_id)) return;
    turn.events.push(event);
    if (event.session_id) turn.sessionId = event.session_id;
    if (event.turn_id) turn.turnId = event.turn_id;

    switch (event.type) {
      case 'session':
        if (turn.sessionId && turn.turnId) turn.callbacks.onSession?.(turn.sessionId, turn.turnId);
        break;
      case 'content':
        if (shouldAppendEventContent(event)) {
          turn.answer += event.content;
          turn.callbacks.onAnswer?.(turn.answer);
        }
        break;
      case 'progress':
        // A round that resolved as narration demotes its streamed text to the trace.
        if (isNarrationMarker(event)) {
          turn.answer = recomputeAnswerContent(turn.events);
          turn.callbacks.onAnswer?.(turn.answer);
        }
        break;
      case 'thinking':
        turn.thinking += event.content;
        turn.callbacks.onThinking?.(turn.thinking);
        break;
      case 'error':
        turn.errorMessage = event.content || 'DeepTutor reported an error';
        console.warn(TAG, 'error event', event.content, event.metadata);
        break;
      case 'done': {
        const status = String((event.metadata as { status?: string }).status ?? 'completed');
        this.finish(status === 'failed' || status === 'cancelled' ? status : 'completed');
        turn.callbacks.onEvent?.(event, turn.events);
        return;
      }
      default:
        break;
    }
    turn.callbacks.onEvent?.(event, turn.events);
  }

  private finish(status: TurnStatus, errorMessage?: string): void {
    const turn = this.active;
    if (!turn) return;
    if (turn.turnId) this.settledTurnIds.add(turn.turnId);
    turn.settle({
      status,
      answer: turn.answer,
      thinking: turn.thinking,
      sessionId: turn.sessionId,
      turnId: turn.turnId,
      errorMessage: errorMessage ?? turn.errorMessage,
      events: turn.events,
    });
  }
}
