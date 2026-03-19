/**
 * 演示场景注册表
 */

import type { DemoScenario, ScenarioRegistry, ScenarioCategory } from './types';
import { onboardingTour } from './scenarios/onboardingTour';
import { postQuizRemediation } from './scenarios/postQuizRemediation';
import { uploadAndAnalyze } from './scenarios/uploadAndAnalyze';
import { knowledgeBaseImport } from './scenarios/knowledgeBaseImport';

// ============ 场景注册表 ============

export const scenarioRegistry: ScenarioRegistry = {
  scenarios: [
    onboardingTour,
    postQuizRemediation,
    uploadAndAnalyze,
    knowledgeBaseImport,
  ],
  categories: [
    { id: 'onboarding', label: '新手指导', description: '首次使用的引导流程' },
    { id: 'post_quiz', label: '测验复习', description: '测验完成后的复习引导' },
    { id: 'upload', label: '上传分析', description: '上传文档后的分析流程' },
    { id: 'import', label: '知识导入', description: '导入测验记录/错题集' },
  ],
};

// ============ 查找函数 ============

/** 按 ID 查找场景 */
export function findScenarioById(id: string): DemoScenario | undefined {
  return scenarioRegistry.scenarios.find((s) => s.id === id);
}

/** 按触发条件查找场景 */
export function findScenarioByTrigger(
  trigger: 'onQuizComplete' | 'onFileUpload' | 'onKnowledgeImport',
): DemoScenario | undefined {
  return scenarioRegistry.scenarios.find((s) => s.triggers[trigger]);
}

/** 获取按分类分组的场景（用于下拉菜单） */
export function getScenariosByCategory(): Array<{
  category: { id: ScenarioCategory; label: string };
  scenarios: DemoScenario[];
}> {
  return scenarioRegistry.categories.map((cat) => ({
    category: cat,
    scenarios: scenarioRegistry.scenarios.filter((s) => s.category === cat.id),
  }));
}

// ============ 导出 ============

export { onboardingTour, postQuizRemediation, uploadAndAnalyze, knowledgeBaseImport };
export type { DemoScenario, DemoStep, ActionCard, SideEffect, ScenarioCategory } from './types';
