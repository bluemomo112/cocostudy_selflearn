/**
 * UI-only build: there is no DeepTutor backend here. Everything under `src/deeptutor/*` that used to talk
 * to it (chat, knowledge bases, mastery paths, quiz / studio generation) is replaced by canned mock data
 * with the same exports, so the screens render and respond like the real thing.
 * Wire the real services back in by swapping these modules for your own API clients.
 */

export const MOCK_LATENCY_MS = 400;

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Always "online" in the UI build so every feature path is reachable. */
export async function isDeepTutorReady(): Promise<boolean> {
  return true;
}
