'use client';

import { useState, useEffect } from 'react';
import { X, Minimize2, Loader2, Play, Pause, Volume2, RotateCcw, ChevronLeft, ChevronRight, FileText, Database, Download } from 'lucide-react';
import { Resource } from '../types/shared-context';
import { useLanguage } from '../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mammoth from 'mammoth';

interface ExtendedResource extends Resource {
  toolId?: string;
  data?: any;
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

function UploadedFileViewer({ resource }: { resource: ExtendedResource }) {
  const ext = resource.fileType || resource.path?.split('.').pop()?.toLowerCase();
  if (!resource.url) return null;
  if (resource.fileType === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return <div className="h-full flex items-center justify-center p-6"><img src={resource.url} alt={resource.title} className="max-w-full max-h-full object-contain rounded-lg" /></div>;
  if (ext === 'docx') return <DocxViewer url={resource.url} />;
  if (ext === 'pdf' || ['txt', 'md'].includes(ext || '')) return <iframe src={resource.url} title={resource.title} className="w-full h-full border-0 bg-white" />;
  if (resource.fileType === 'audio' || ['mp3', 'wav', 'm4a', 'ogg'].includes(ext || '')) return <div className="h-full flex items-center justify-center p-8"><audio controls src={resource.url} className="w-full max-w-xl" /></div>;
  if (resource.fileType === 'video' || ['mp4', 'webm', 'mov'].includes(ext || '')) return <div className="h-full flex items-center justify-center p-6"><video controls src={resource.url} className="max-w-full max-h-full" /></div>;
  return <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-8"><FileText size={48} className="text-gray-300" /><p className="text-sm text-gray-600">当前暂不支持直接渲染 {ext?.toUpperCase()} 文件</p><a href={resource.url} download={resource.path} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm"><Download size={15} />下载文件</a></div>;
}

interface InteractiveViewerModalProps {
  resource: ExtendedResource | null;
  onClose: () => void;
  onShrinkToInline?: () => void;
}

// Flashcard 组件
function FlashcardViewer({ cards }: { cards: Array<{ front: string; back: string }> }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
      <div className="text-sm text-gray-500">
        卡片 {currentIndex + 1} / {cards.length}
      </div>

      <div
        className="relative w-full max-w-md h-64 cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="absolute inset-0 bg-white rounded-xl shadow-lg border-2 border-blue-200 p-8 flex flex-col items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-xs text-blue-600 font-medium mb-4">正面</div>
            <div className="text-lg text-gray-800 text-center">{currentCard.front}</div>
            <div className="text-xs text-gray-400 mt-6">點擊翻轉</div>
          </div>

          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border-2 border-indigo-200 p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-xs text-indigo-600 font-medium mb-4">背面</div>
            <div className="text-lg text-gray-800 text-center">{currentCard.back}</div>
            <div className="text-xs text-gray-400 mt-6">點擊翻轉</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={cards.length <= 1}
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setIsFlipped(false); setCurrentIndex(0); }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="重新開始"
        >
          <RotateCcw size={18} className="text-gray-600" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={cards.length <= 1}
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}

// Audio Overview 组件
function AudioOverviewViewer({ chapters }: { chapters: Array<{ time: string; title: string; content: string }> }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 900;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause size={20} className="text-white" fill="white" />
            ) : (
              <Play size={20} className="text-white ml-0.5" fill="white" />
            )}
          </button>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700 mb-1">光合作用音頻概述</div>
            <div className="text-xs text-gray-500">
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 15:00
            </div>
          </div>
          <Volume2 size={20} className="text-gray-400" />
        </div>

        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chapters.map((chapter, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-300 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-xs font-mono text-purple-700">{chapter.time}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 mb-1">{chapter.title}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{chapter.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Timeline 组件
function TimelineViewer({ events }: { events: Array<{ year: string; title: string; description: string; icon: string }> }) {
  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200" />

          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={index} className="relative flex gap-6">
                <div className="flex-shrink-0 w-16 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <span className="text-2xl">{event.icon}</span>
                  </div>
                  <div className="mt-2 text-xs font-mono font-medium text-gray-600 text-center">
                    {event.year}
                  </div>
                </div>

                <div className="flex-1 pb-8">
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-base font-semibold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// MindMap 组件
function MindMapViewer({ nodes }: { nodes: { center: string; branches: Array<{ title: string; items: string[] }> } }) {
  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-2xl flex items-center justify-center">
              <span className="text-white text-xl font-bold text-center px-6">{nodes.center}</span>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-pulse" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {nodes.branches.map((branch, index) => (
            <div key={index} className="relative">
              <div className="absolute -top-12 left-1/2 w-0.5 h-12 bg-gradient-to-b from-green-300 to-transparent" />

              <div className="bg-white rounded-xl border-2 border-green-200 p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <h3 className="text-base font-semibold text-gray-800">{branch.title}</h3>
                </div>
                <ul className="space-y-2">
                  {branch.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InteractiveViewerModal({ resource, onClose, onShrinkToInline }: InteractiveViewerModalProps) {
  const { t } = useLanguage();

  const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
    animation: { label: t('动画'), color: 'bg-purple-100 text-purple-700' },
    visualization: { label: t('可视化'), color: 'bg-blue-100 text-blue-700' },
    simulation: { label: t('模拟'), color: 'bg-green-100 text-green-700' },
    test: { label: t('测试'), color: 'bg-amber-100 text-amber-700' },
  };
  const [isLoading, setIsLoading] = useState(true);

  if (!resource) return null;

  const category = resource.interactiveCategory
    ? CATEGORY_CONFIG[resource.interactiveCategory]
    : null;

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

      {/* 模态框 - 始终 97% 大小 */}
      <div
        className="fixed z-50 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden inset-[1.5%]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {resource.title}
            </h3>
            {category && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${category.color}`}>
                {category.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mr-3 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-blue-700"><FileText size={12} />可查看</span>
            {resource.knowledgeBase === 'supported' ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700"><Database size={12} />知识库可解析 · 智能体可访问</span> : resource.knowledgeBase === 'unsupported' ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-700"><Database size={12} />暂不支持知识库解析</span> : null}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onShrinkToInline && (
              <button
                onClick={onShrinkToInline}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('缩小到侧栏')}
              >
                <Minimize2 size={18} className="text-gray-500" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 relative bg-gray-50 overflow-hidden">
          {resource.fileType && resource.url ? (
            <UploadedFileViewer resource={resource} />
          ) : resource.url ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="text-primary-500 animate-spin" />
                    <p className="text-sm text-gray-500">{t('加载中...')}</p>
                  </div>
                </div>
              )}
              <iframe
                src={resource.url}
                title={resource.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                onLoad={() => setIsLoading(false)}
              />
            </>
          ) : resource.toolId === 'flashcards' && resource.data?.cards ? (
            <FlashcardViewer cards={resource.data.cards} />
          ) : resource.toolId === 'audio_overview' && resource.data?.chapters ? (
            <AudioOverviewViewer chapters={resource.data.chapters} />
          ) : resource.toolId === 'timeline' && resource.data?.events ? (
            <TimelineViewer events={resource.data.events} />
          ) : resource.toolId === 'mind_map' && resource.data?.nodes ? (
            <MindMapViewer nodes={resource.data.nodes} />
          ) : resource.textContent ? (
            <div className="p-6 overflow-y-auto h-full">
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed bg-white rounded-lg border border-gray-200 p-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{resource.textContent}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-400">暂无内容</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
