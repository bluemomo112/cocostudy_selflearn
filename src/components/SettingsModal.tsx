'use client';

import { useState, useMemo } from 'react';
import { X, Settings2, Bot, ExternalLink } from 'lucide-react';
import { SpaceConfig } from '../types/self-study';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsModalProps {
  config: SpaceConfig;
  onSave: (config: SpaceConfig) => void;
  onClose: () => void;
}

export default function SettingsModal({ config, onSave, onClose }: SettingsModalProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const { t } = useLanguage();

  const AGENTS = [
    { id: 'new_knowledge_tutor', name: t('新知导师'), description: t('帮助学生理解和掌握新知识') },
    { id: 'review_tutor', name: t('复习导师'), description: t('帮助学生巩固知识和准备复习') },
    { id: 'custom', name: t('自定义 Agent'), description: t('使用你自己的 Agent App ID') },
  ];

  // Initialize default configs if not present
  if (!localConfig.freeConfig) {
    localConfig.freeConfig = {
      selectedAgentId: AGENTS[0].id,
      teacherPrompt: '',
      enableFence: false,
    };
  }
  if (!localConfig.supervisionConfig) {
    localConfig.supervisionConfig = {
      selectedAgentId: 'metacognition_tutor',
      teacherPrompt: '',
    };
  }
  if (!localConfig.aiAssistantMode) {
    localConfig.aiAssistantMode = 'personalized';
  }

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings2 size={20} className="text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">{t('自学空间设置')}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">

            {/* 基础配置 */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-4">{t('基础配置')}</h3>
              <p className="text-sm text-gray-500">{t('自学空间的基础资料已由课程内容和发布配置统一管理。')}</p>
            </section>

            {/* AI 配置 */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-4">{t('AI 配置')}</h3>
              <div className="space-y-4">
                {/* 启用学生个性化 Agent 开关 */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{t('啟用學生個性化 Agent')}</span>
                    <p className="text-xs text-gray-500">{t('為每位學生配置專屬 AI 導師')}</p>
                  </div>
                  <button
                    onClick={() => setLocalConfig({
                      ...localConfig,
                      aiAssistantMode: localConfig.aiAssistantMode === 'personalized' ? 'unified' : 'personalized',
                    })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      localConfig.aiAssistantMode === 'personalized' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform absolute top-0.5 ${
                        localConfig.aiAssistantMode === 'personalized' ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {localConfig.aiAssistantMode === 'personalized' ? (
                  /* 个性化模式提示 */
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">{t('此配置在學生總覽中進行，教師將為每個學生選擇默認 AI 導師及個性化提示詞。')}</p>
                    <button className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                      <ExternalLink size={14} />
                      {t('前往學生總覽配置 →')}
                    </button>
                  </div>
                ) : (
                  /* 统一配置模式 - 保留原有 AI 助手选择器 */
                  <>
                    {/* AI 助手选择 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">{t('AI 助手')}</label>
                      <div className="space-y-2">
                        {AGENTS.map((agent) => (
                          <label
                            key={agent.id}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                              localConfig.freeConfig?.selectedAgentId === agent.id
                                ? 'bg-primary-50 border-primary-300'
                                : 'bg-white border-gray-200 hover:border-primary-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name="agent"
                              checked={localConfig.freeConfig?.selectedAgentId === agent.id}
                              onChange={() => setLocalConfig({
                                ...localConfig,
                                freeConfig: { ...localConfig.freeConfig!, selectedAgentId: agent.id }
                              })}
                              className="w-4 h-4 text-primary-600"
                            />
                            <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center">
                              <Bot size={14} className="text-primary-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">{agent.name}</p>
                              <p className="text-xs text-gray-500">{agent.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {localConfig.freeConfig?.selectedAgentId === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Agent App ID')}</label>
                        <input
                          value={localConfig.freeConfig?.customAgentAppId || ''}
                          onChange={(e) => setLocalConfig({
                            ...localConfig,
                            freeConfig: { ...localConfig.freeConfig!, customAgentAppId: e.target.value },
                          })}
                          placeholder={t('请输入你自己的 Agent App ID')}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                    )}

                    {/* 教师追加指令 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('教师追加指令')}</label>
                      <textarea
                        value={localConfig.freeConfig?.teacherPrompt || ''}
                        onChange={(e) => setLocalConfig({
                          ...localConfig,
                          freeConfig: { ...localConfig.freeConfig!, teacherPrompt: e.target.value }
                        })}
                        placeholder={t('例如：请用幽默的口吻回答，所有比喻都和「水」有关...')}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 outline-none min-h-[80px] resize-none"
                      />
                    </div>

                  </>
                )}
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
            {t('取消')}
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">
            {t('保存')}
          </button>
        </div>
      </div>
    </div>
  );
}
