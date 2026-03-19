/**
 * 演示脚本系统类型定义（统一步进式交互格式）
 */

import { Resource, Task } from '../../types';

/**
 * 场景分类
 */
export type ScenarioCategory = 'onboarding' | 'post_quiz' | 'upload' | 'import';

/**
 * Action Card（与 ChatMessage.actionCards 格式对齐）
 */
export interface ActionCard {
  icon: string;
  title: string;
  subtitle: string;
  action: string;
  actionPayload?: string;
}

/**
 * 副作用
 */
export interface SideEffect {
  type: 'log' | 'highlight' | 'update_ui' | 'open_panel';
  target?: string;
  value?: any;
}

/**
 * 演示步骤
 */
export interface DemoStep {
  id: number;
  /** null = AI 主动发言，string = 用户预填输入 */
  prefilledInput: string | null;
  aiResponse: string;
  actionCards?: ActionCard[];
  sideEffects?: SideEffect[];
  /** 注入任务到任务列表 */
  injectTask?: Task;
  /** 注入资源到资源列表 */
  injectResources?: Resource[];
}

/**
 * 演示场景定义
 */
export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  category: ScenarioCategory;
  steps: DemoStep[];
  /** 场景附带数据（学生档案、测验结果、错题等） */
  scenarioData?: Record<string, any>;
  triggers: {
    dropdown: boolean;
    onQuizComplete?: boolean;
    onFileUpload?: boolean;
    onKnowledgeImport?: boolean;
  };
}

/**
 * 场景分类元数据
 */
export interface CategoryMeta {
  id: ScenarioCategory;
  label: string;
  description: string;
}

/**
 * 场景注册表
 */
export interface ScenarioRegistry {
  scenarios: DemoScenario[];
  categories: CategoryMeta[];
}
