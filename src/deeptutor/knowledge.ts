/**
 * UI-only build: knowledge bases are kept in memory. Uploading "indexes" instantly (after a short fake delay)
 * and the resource library offers a few canned, already-parsed files from `public/mock_data`.
 */
import { MOCK_LATENCY_MS, sleep } from './config';
import type { Resource } from '../types/shared-context';

// Characters the real backend rejects in a KB name: < > : " / \ | ? * # %
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

const knownKbs = new Set<string>();

export function kbNameForSpace(spaceId: string): string {
  return `cross-${spaceId}`.replace(FORBIDDEN, '_').slice(0, 120);
}

/** One KB per resource (not one shared KB per space), so a turn can include just the checked resources. */
export function kbNameForResource(spaceId: string, resourceId: string): string {
  return `cross-${spaceId}-${resourceId}`.replace(FORBIDDEN, '_').slice(0, 120);
}

export async function listKnowledgeBases(): Promise<KbInfo[]> {
  return [...knownKbs].map((name) => ({ name, status: 'ready' }));
}

export async function kbExists(name: string): Promise<boolean> {
  return knownKbs.has(name);
}

export async function getKbProgress(_name: string): Promise<KbProgress> {
  return { stage: 'completed', percent: 100 };
}

export async function uploadFilesToKb(name: string, _files: File[]): Promise<{ created: boolean; taskId: string | null }> {
  await sleep(MOCK_LATENCY_MS);
  const created = !knownKbs.has(name);
  knownKbs.add(name);
  return { created, taskId: null };
}

export async function waitForKb(
  _name: string,
  opts: { onProgress?: (p: KbProgress) => void; intervalMs?: number; timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<void> {
  for (const percent of [30, 70, 100]) {
    await sleep(MOCK_LATENCY_MS);
    opts.onProgress?.({ stage: percent === 100 ? 'completed' : 'indexing', percent });
  }
}

/** URL of an original file inside a KB (used for previews); the canned files are served from public/mock_data. */
export function kbFileUrl(_name: string, filename: string): string {
  return `/mock_data/${encodeURIComponent(filename)}`;
}

export interface KbFile {
  name: string;
  size: number;
  mime_type?: string;
}

export async function listKbFiles(_name: string): Promise<KbFile[]> {
  return [];
}

export interface ImportableKbResource {
  kbName: string;
  fileName: string;
  size: number;
  mimeType?: string;
}

const MOCK_IMPORTABLE: ImportableKbResource[] = [
  { kbName: 'cross-mock-plant-factory-intro', fileName: '01 认识植物工厂V1.0.pptx', size: 38_000 * 1024 },
  { kbName: 'cross-mock-plant-factory-handbook', fileName: '01 认识植物工厂学生手册V1.0.docx', size: 120 * 1024 },
  { kbName: 'cross-mock-hydroponic-container', fileName: '11 设计水培容器学生手册V1.0.docx', size: 130 * 1024 },
];

/** Already-parsed files the resource library can offer without re-uploading (minus the excluded KBs). */
export async function listImportableResources(excludeKbNames: Set<string>): Promise<ImportableKbResource[]> {
  await sleep(MOCK_LATENCY_MS);
  return MOCK_IMPORTABLE.filter((item) => !excludeKbNames.has(item.kbName));
}

/** Shape an already-parsed KB file as a Resource that reuses its KB instead of re-uploading. */
export function importableKbResourceToResource(item: ImportableKbResource): Resource {
  const ext = item.fileName.split('.').pop()?.toLowerCase() || '';
  const isPresentation = ['ppt', 'pptx'].includes(ext);
  const isVideo = ['mp4', 'avi', 'mov', 'webm'].includes(ext);
  const isAudio = ['mp3', 'wav', 'm4a', 'ogg'].includes(ext);
  const type: Resource['type'] = isPresentation ? 'presentation' : (isVideo || isAudio) ? 'video' : 'document';
  return {
    id: `kb_${item.kbName}`,
    title: item.fileName.replace(/\.[^/.]+$/, ''),
    type,
    fileType: (isPresentation ? ext : isVideo ? 'video' : isAudio ? 'audio' : ext) as Resource['fileType'],
    description: `${(item.size / 1024).toFixed(0)} KB · 已解析`,
    knowledgeBase: 'supported',
    kbStatus: 'ready',
    kbFile: item.fileName,
    kbName: item.kbName,
  };
}

export async function deleteKnowledgeBase(name: string): Promise<void> {
  knownKbs.delete(name);
}
