'use client';

/**
 * Renders an uploaded file (image, PDF, txt/md, docx, audio, video) for the full-screen viewer and the inline viewer.
 * Not sandboxed on purpose: Chrome's built-in PDF viewer refuses to load inside a sandboxed iframe
 * ("This page has been blocked by Chrome"), which is what happens when a file is treated as an interactive page.
 */
import { useEffect, useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import mammoth from 'mammoth';

export interface UploadedFileResource {
  title: string;
  url?: string;
  fileType?: string;
  path?: string;
}

// DOCX 真实渲染：浏览器端用 mammoth 把文档转成 HTML，保留标题/段落/列表/表格等排版
function DocxViewer({ url }: { url: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setHtml(null);
    setError(false);
    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buffer) => mammoth.convertToHtml({ arrayBuffer: buffer }))
      .then((result) => { if (!cancelled) setHtml(result.value); })
      .catch((err) => {
        console.error('DOCX 解析失败', err);
        if (!cancelled) setError(true);
      });
    return () => { cancelled = true; };
  }, [url]);

  if (error) return <div className="h-full flex items-center justify-center text-sm text-gray-400">DOCX 解析失败</div>;
  if (!html) return <div className="h-full flex items-center justify-center"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto p-8 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default function UploadedFileViewer({ resource }: { resource: UploadedFileResource }) {
  const ext = resource.fileType || resource.path?.split('.').pop()?.toLowerCase();
  if (!resource.url) return null;
  if (resource.fileType === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return <div className="h-full flex items-center justify-center p-6"><img src={resource.url} alt={resource.title} className="max-w-full max-h-full object-contain rounded-lg" /></div>;
  if (ext === 'docx') return <DocxViewer url={resource.url} />;
  if (ext === 'pdf' || ['txt', 'md'].includes(ext || '')) return <iframe src={resource.url} title={resource.title} className="w-full h-full border-0 bg-white" />;
  if (resource.fileType === 'audio' || ['mp3', 'wav', 'm4a', 'ogg'].includes(ext || '')) return <div className="h-full flex items-center justify-center p-8"><audio controls src={resource.url} className="w-full max-w-xl" /></div>;
  if (resource.fileType === 'video' || ['mp4', 'webm', 'mov'].includes(ext || '')) return <div className="h-full flex items-center justify-center p-6"><video controls src={resource.url} className="max-w-full max-h-full" /></div>;
  return <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-8"><FileText size={48} className="text-gray-300" /><p className="text-sm text-gray-600">当前暂不支持直接渲染 {ext?.toUpperCase()} 文件</p><a href={resource.url} download={resource.path} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm"><Download size={15} />下载文件</a></div>;
}
