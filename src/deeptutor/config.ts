/**
 * Where the DeepTutor backend lives. Local prototype: the browser talks to it directly.
 * `cross-new`'s dev launcher exports NEXT_PUBLIC_DEEPTUTOR_BASE; the fallback matches its default port.
 *
 * Going beyond local use needs a server-side bridge instead (DeepTutor single-user mode has no auth).
 */
const DEFAULT_BASE = 'http://127.0.0.1:8001';
const READY_TTL_MS = 10_000;

export function deeptutorBase(): string {
  return (process.env.NEXT_PUBLIC_DEEPTUTOR_BASE || DEFAULT_BASE).replace(/\/+$/, '');
}

export function deeptutorApiUrl(path: string): string {
  return `${deeptutorBase()}${path.startsWith('/') ? path : `/${path}`}`;
}

export function deeptutorWsUrl(path = '/ws'): string {
  return deeptutorBase().replace(/^http/, 'ws') + path;
}

let readyCache: { at: number; ok: boolean } | null = null;

/** GET /health/ready with a short timeout; result cached for a few seconds. */
export async function isDeepTutorReady(force = false): Promise<boolean> {
  const now = Date.now();
  if (!force && readyCache && now - readyCache.at < READY_TTL_MS) return readyCache.ok;
  let ok = false;
  try {
    const res = await fetch(deeptutorApiUrl('/health/ready'), { signal: AbortSignal.timeout(2000) });
    ok = res.ok;
  } catch {
    ok = false;
  }
  readyCache = { at: now, ok };
  console.log('[deeptutor] isDeepTutorReady =', ok);
  return ok;
}
