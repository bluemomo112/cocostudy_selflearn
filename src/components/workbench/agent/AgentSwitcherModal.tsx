'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Gauge } from 'lucide-react';
import { AGENT_PRESETS, AgentPreset } from '../../../data/agentPresets';
import { useLanguage } from '../../../contexts/LanguageContext';

interface AgentSwitcherModalProps {
  isOpen: boolean;
  currentAgentId: string;
  onClose: () => void;
  onConfirm: (agentId: string) => void;
}

export function AgentSwitcherModal({ isOpen, currentAgentId, onClose, onConfirm }: AgentSwitcherModalProps) {
  const { t } = useLanguage();
  const initialIndex = Math.max(
    0,
    AGENT_PRESETS.findIndex((a) => a.id === currentAgentId)
  );
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);

  if (!isOpen) return null;

  const total = AGENT_PRESETS.length;
  const focused = AGENT_PRESETS[focusedIndex];

  const goTo = (delta: number) => {
    setFocusedIndex((prev) => (prev + delta + total) % total);
  };

  // 计算每张卡片相对于聚焦卡片的偏移，用于左右堆叠展示
  const getOffset = (index: number) => {
    let diff = index - focusedIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部渐变背景 + 标题 */}
        <div className={`relative bg-gradient-to-br ${focused.gradient} px-8 pt-8 pb-16 transition-colors duration-300`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
          <h2 className="text-lg font-semibold text-white">{t('选择你的学习搭档')}</h2>
          <p className="mt-1 text-sm text-white/80">{t('不同风格，帮你用不同方式吃透知识')}</p>
        </div>

        {/* 卡片轮播区 */}
        <div className="relative -mt-12 px-6 pb-2">
          <div className="flex items-center justify-center gap-3 h-56">
            <button
              onClick={() => goTo(-1)}
              className="shrink-0 z-10 p-2 rounded-full bg-white shadow-md border border-gray-200 text-gray-500 hover:text-gray-800 hover:shadow-lg transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex-1 flex items-center justify-center gap-3 overflow-hidden h-full">
              {AGENT_PRESETS.map((agent, index) => {
                const offset = getOffset(index);
                if (Math.abs(offset) > 2) return null;
                const isFocused = offset === 0;
                const Icon = agent.icon;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setFocusedIndex(index)}
                    className="shrink-0 transition-all duration-300 ease-out"
                    style={{
                      transform: `scale(${isFocused ? 1 : Math.abs(offset) === 1 ? 0.82 : 0.66}) translateY(${isFocused ? 0 : 8}px)`,
                      opacity: isFocused ? 1 : Math.abs(offset) === 1 ? 0.7 : 0.35,
                      zIndex: isFocused ? 10 : 5 - Math.abs(offset),
                    }}
                  >
                    <div
                      className={`relative w-32 h-44 rounded-2xl bg-gradient-to-br ${agent.gradient} p-4 flex flex-col items-center justify-center gap-3 shadow-lg ${
                        isFocused ? `ring-4 ring-offset-2 ${agent.ring}` : ''
                      }`}
                    >
                      {currentAgentId === agent.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow">
                          <Check size={12} className="text-gray-700" strokeWidth={3} />
                        </div>
                      )}
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-white">{t(agent.name)}</div>
                        {isFocused && (
                          <div className="mt-1 text-[11px] text-white/85 leading-tight px-1">{t(agent.tagline)}</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goTo(1)}
              className="shrink-0 z-10 p-2 rounded-full bg-white shadow-md border border-gray-200 text-gray-500 hover:text-gray-800 hover:shadow-lg transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* 详情面板 */}
        <div className="px-8 pb-4">
          <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{t(focused.name)}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{t(focused.tagline)}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {focused.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-0.5 rounded-full border ${focused.chipBg}`}
                  >
                    {t(tag)}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-700 leading-relaxed">{t(focused.description)}</p>

            {focused.intensityOptions && (
              <div className="mt-3 flex items-center gap-2">
                <Gauge size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">{t('引导强度')}:</span>
                <div className="flex gap-1.5">
                  {focused.intensityOptions.map((opt) => (
                    <span key={opt} className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                      {t(opt)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 relative bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div className="absolute -top-2 left-4 text-[10px] text-gray-400 bg-white px-1">{t('风格示例')}</div>
              <p className="text-sm text-gray-600 italic">&ldquo;{t(focused.sampleLine)}&rdquo;</p>
            </div>

            <p className="mt-3 text-xs text-gray-400">💡 {t(focused.bestFor)}</p>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="px-8 pb-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('取消')}
          </button>
          <button
            onClick={() => onConfirm(focused.id)}
            className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors ${focused.solidBtn}`}
          >
            {t('确认切换')}
          </button>
        </div>
      </div>
    </div>
  );
}
