/**
 * 学习日志的类型定义和展示配置（日志内容由真实学习事件生成，见 SelfStudyWorkbench 的 learningLog）
 * 用于「我的能力成长」tab 的时间线展示
 */

import type { CompetencyType } from '../components/note-config/results-view';

// ============ 类型定义 ============

export type LogEntryType =
  | 'resource_complete'    // 完成资源学习
  | 'task_complete'        // 完成任务
  | 'quiz_correction'      // 订正错题
  | 'follow_up_question'   // 追问深入
  | 'knowledge_extension'  // 知识拓展
  | 'competency_upgrade'   // 能力提升
  | 'ai_observation'       // AI洞察
  | 'milestone';           // 里程碑

export interface LearningLogEntry {
  id: string;
  type: LogEntryType;
  timestamp: Date;
  title: string;
  description: string;
  metadata?: {
    score?: number;
    duration?: number;
    competencyType?: CompetencyType;
    previousRating?: number;
    newRating?: number;
    aiObservationType?: 'praise' | 'suggestion' | 'insight';
  };
}

// ============ 类型配置 ============

export const LOG_ENTRY_CONFIG: Record<LogEntryType, {
  icon: string;
  label: string;
  color: string;       // tailwind color name
  dotColor: string;    // dot bg class
  bgColor: string;     // card bg class
}> = {
  resource_complete: {
    icon: '📖', label: '完成资源',
    color: 'blue', dotColor: 'bg-blue-500', bgColor: 'bg-blue-50',
  },
  task_complete: {
    icon: '✅', label: '完成任务',
    color: 'green', dotColor: 'bg-green-500', bgColor: 'bg-green-50',
  },
  quiz_correction: {
    icon: '🔄', label: '订正错题',
    color: 'amber', dotColor: 'bg-amber-500', bgColor: 'bg-amber-50',
  },
  follow_up_question: {
    icon: '❓', label: '追问深入',
    color: 'purple', dotColor: 'bg-purple-500', bgColor: 'bg-purple-50',
  },
  knowledge_extension: {
    icon: '🚀', label: '知识拓展',
    color: 'indigo', dotColor: 'bg-indigo-500', bgColor: 'bg-indigo-50',
  },
  competency_upgrade: {
    icon: '🌟', label: '能力提升',
    color: 'yellow', dotColor: 'bg-yellow-500', bgColor: 'bg-yellow-50',
  },
  ai_observation: {
    icon: '✨', label: 'AI洞察',
    color: 'pink', dotColor: 'bg-pink-500', bgColor: 'bg-pink-50',
  },
  milestone: {
    icon: '🏆', label: '里程碑',
    color: 'rose', dotColor: 'bg-rose-500',
    bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50',
  },
};

// ============ Mock 数据 ============

const today = new Date();
