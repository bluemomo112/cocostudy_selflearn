'use client';

import { useState, useMemo } from 'react';
import { X, Settings2, Bot, FileEdit, Brain, ExternalLink } from 'lucide-react';
import { SpaceConfig } from '../types/self-study';
import { useLanguage } from '../contexts/LanguageContext';
import { getMockAgents, getNoteTemplates } from '../constants/mockData';

interface SettingsModalProps {
  config: SpaceConfig;
  onSave: (config: SpaceConfig) => void;
  onClose: () => void;
}

export default function SettingsModal({ config, onSave, onClose }: SettingsModalProps) {
  const [localConfig, setLocalConfig] = useState(config);
  const { t } = useLanguage();

  const MOCK_AGENTS = useMemo(() => getMockAgents(t), [t]);
  const NOTE_TEMPLATES = useMemo(() => getNoteTemplates(t), [t]);

  // Initialize default configs if not present
  if (!localConfig.freeConfig) {
    localConfig.freeConfig = {
      selectedAgentId: MOCK_AGENTS[0].id,
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
              <div className="space-y-4">
                {/* 学习目标 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('学习目标')}</label>
                  <textarea
                    value={localConfig.userProfile.goal || ''}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      userProfile: { ...localConfig.userProfile, goal: e.target.value }
                    })}
                    placeholder={t('例如：通过 CPA 考试')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                </div>
              </div>
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
                    <p className="text-sm text-blue-800">
                      {t('此配置在學生總覽中進行，教師將為每個學生選擇默認 AI 導師、知識圍欄及個性化提示詞。')}
                    </p>
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
                        {MOCK_AGENTS.map((agent) => (
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

                    {/* 知识围栏开关 */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{t('启用知识围栏')}</span>
                        <p className="text-xs text-gray-500">{t('只允许回答与课程资料相关的问题')}</p>
                      </div>
                      <button
                        onClick={() => setLocalConfig({
                          ...localConfig,
                          freeConfig: { ...localConfig.freeConfig!, enableFence: !localConfig.freeConfig?.enableFence }
                        })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          localConfig.freeConfig?.enableFence ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform absolute top-0.5 ${
                            localConfig.freeConfig?.enableFence ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </>
                )}

                {/* AI 监督（学习状态） */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Brain size={14} className="text-primary-500" />
                    {t('AI 監督（學習狀態）')}
                  </label>
                  <div className="space-y-3">
                    <select
                      value={localConfig.supervisionConfig?.selectedAgentId || 'metacognition_tutor'}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        supervisionConfig: { ...localConfig.supervisionConfig!, selectedAgentId: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="metacognition_tutor">{t('元認知導師（推薦）')}</option>
                      <option value="learning_coach">{t('學習教練')}</option>
                      <option value="reflection_guide">{t('反思引導師')}</option>
                    </select>
                    <textarea
                      value={localConfig.supervisionConfig?.teacherPrompt || ''}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        supervisionConfig: { ...localConfig.supervisionConfig!, teacherPrompt: e.target.value }
                      })}
                      placeholder={t('輸入個性化提示詞...')}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 outline-none min-h-[80px] resize-none"
                    />
                  </div>
                </div>

                {/* 笔记模板 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileEdit size={14} className="text-primary-500" />
                    {t('笔记模板')}
                  </label>
                  <select
                    value={localConfig.noteTemplate}
                    onChange={(e) => {
                      const selected = NOTE_TEMPLATES.find(tpl => tpl.id === e.target.value);
                      setLocalConfig({
                        ...localConfig,
                        noteTemplate: e.target.value as any,
                        noteTemplateContent: selected?.defaultContent ?? '',
                      });
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {NOTE_TEMPLATES.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.description}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={localConfig.noteTemplateContent || ''}
                    onChange={(e) => setLocalConfig({ ...localConfig, noteTemplateContent: e.target.value })}
                    placeholder={t('模板預覽內容（可編輯）')}
                    rows={6}
                    className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono"
                  />
                </div>
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
