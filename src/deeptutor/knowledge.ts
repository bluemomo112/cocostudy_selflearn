/**
 * DeepTutor knowledge bases: one KB per self-study space. Resources the teacher uploads are pushed into it
 * (DeepTutor extracts, chunks and embeds them) and chat turns pass `knowledge_bases: [name]` so the tutor
 * answers with retrieval and cites sources.
 *
 * REST (v1.6.8): POST /api/knowledge-bases (multipart: name, files[]), POST /api/knowledge-bases/{kb}/upload,
 * GET /api/knowledge-bases/{kb}/progress -> {stage, percent, message} (stage "completed" | "error" ends it).
 */
import { deeptutorApiUrl } from './config';

const TAG = '[deeptutor:kb]';
// Characters DeepTutor rejects in a KB name: < > : " / \ | ? * # %
const FORBIDDEN = /[<>:"/\\|?*#%\x00-\x1f]/g;

export interface KbInfo {
  name: string;
  status?: string;
  statistics?: Record<string, unknown>;
}

export interface KbProgress {
  stage?: string;
  percent?: number;
  message?: string;
  status?: string;
  error?: string;
}

export function kbNameForSpace(spaceId: string): string {
  return `cross-${spaceId}`.replace(FORBIDDEN, '_').slice(0, 120);
}

/** One KB per resource (not one shared KB per space), so a turn can include just the checked resources. */
export function kbNameForResource(spaceId: string, resourceId: string): string {
  return `cross-${spaceId}-${resourceId}`.replace(FORBIDDEN, '_').slice(0, 120);
}

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return typeof body?.detail === 'string' ? body.detail : JSON.stringify(body?.detail ?? body);
  } catch {
    return res.statusText;
  }
}

export async function listKnowledgeBases(): Promise<KbInfo[]> {
  const res = await fetch(deeptutorApiUrl('/api/knowledge-bases'));
  if (!res.ok) throw new Error(`list knowledge bases failed: ${res.status} ${await readError(res)}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.knowledge_bases ?? data.items ?? []);
}

export async function kbExists(name: string): Promise<boolean> {
  return (await listKnowledgeBases()).some((kb) => kb.name === name);
}

export async function getKbProgress(name: string): Promise<KbProgress> {
  const res = await fetch(deeptutorApiUrl(`/api/knowledge-bases/${encodeURIComponent(name)}/progress`));
  if (!res.ok) throw new Error(`kb progress failed: ${res.status} ${await readError(res)}`);
  return res.json();
}

// Uploads for one space run one after another, so the first one creates the KB and the rest append to it.
const uploadChains = new Map<string, Promise<unknown>>();

/**
 * Create the KB with these files, or append them if it already exists.
 * Resolves once the server accepted the upload; indexing continues in the background (see waitForKb).
 */
export function uploadFilesToKb(name: string, files: File[]): Promise<{ created: boolean; taskId: string | null }> {
  const run = async () => {
    const exists = await kbExists(name);
    const form = new FormData();
    let url: string;
    if (exists) {
      url = `/api/knowledge-bases/${encodeURIComponent(name)}/upload`;
    } else {
      url = '/api/knowledge-bases';
      form.append('name', name);
    }
    files.forEach((f) => form.append('files', f, f.name));
    console.log(TAG, exists ? 'upload to' : 'create', name, files.map((f) => f.name));
    const res = await fetch(deeptutorApiUrl(url), { method: 'POST', body: form });
    if (!res.ok) throw new Error(`kb ${exists ? 'upload' : 'create'} failed: ${res.status} ${await readError(res)}`);
    const data = await res.json();
    return { created: !exists, taskId: (data.task_id as string | null) ?? null };
  };
  const previous = uploadChains.get(name) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(run);
  uploadChains.set(name, next);
  return next;
}

/** Poll until the KB finishes indexing. Rejects when DeepTutor reports an error stage. */
export async function waitForKb(
  name: string,
  opts: { onProgress?: (p: KbProgress) => void; intervalMs?: number; timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<void> {
  const { onProgress, intervalMs = 1500, timeoutMs = 10 * 60 * 1000, signal } = opts;
  const started = Date.now();
  // The first poll can race the background task and still see the previous run's "completed".
  await new Promise((r) => setTimeout(r, 800));
  while (Date.now() - started < timeoutMs) {
    if (signal?.aborted) throw new Error('aborted');
    const p = await getKbProgress(name);
    onProgress?.(p);
    if (p.stage === 'completed') return;
    if (p.stage === 'error' || p.status === 'error') throw new Error(p.message || p.error || 'knowledge base indexing failed');
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('knowledge base indexing timed out');
}

/** Download URL of an original file inside a KB (used for previews). */
export function kbFileUrl(name: string, filename: string): string {
  return deeptutorApiUrl(`/api/knowledge-bases/${encodeURIComponent(name)}/files/${encodeURIComponent(filename)}`);
}

export interface KbFile {
  name: string;
  size: number;
  mime_type?: string;
}

/** Original files stored in a KB (each of our per-resource KBs holds exactly one). */
export async function listKbFiles(name: string): Promise<KbFile[]> {
  const res = await fetch(deeptutorApiUrl(`/api/knowledge-bases/${encodeURIComponent(name)}/files`));
  if (!res.ok) throw new Error(`list kb files failed: ${res.status} ${await readError(res)}`);
  const data = await res.json();
  return Array.isArray(data.files) ? data.files : [];
}

export interface ImportableKbResource {
  kbName: string;
  fileName: string;
  size: number;
  mimeType?: string;
}

/**
 * Every already-parsed, ready-to-use file across all of self-learn's KBs on this (now dedicated)
 * DeepTutor instance, except the ones excluded (typically the current space's own resources).
 * Lets the "import from library" modal offer resources without re-uploading/re-indexing them.
 */
export async function listImportableResources(excludeKbNames: Set<string>): Promise<ImportableKbResource[]> {
  const kbs = await listKnowledgeBases();
  const candidates = kbs.filter((kb) => kb.name.startsWith('cross-') && kb.status === 'ready' && !excludeKbNames.has(kb.name));
  const results = await Promise.all(candidates.map(async (kb): Promise<ImportableKbResource[]> => {
    try {
      const files = await listKbFiles(kb.name);
      return files.map((f) => ({ kbName: kb.name, fileName: f.name, size: f.size, mimeType: f.mime_type }));
    } catch (error) {
      console.warn(TAG, '读取知识库文件列表失败，跳过', kb.name, error);
      return [];
    }
  }));
  return results.flat();
}

export async function deleteKnowledgeBase(name: string): Promise<void> {
  const res = await fetch(deeptutorApiUrl(`/api/knowledge-bases/${encodeURIComponent(name)}`), { method: 'DELETE' });
  if (!res.ok && res.status !== 404) throw new Error(`delete kb failed: ${res.status} ${await readError(res)}`);
}
