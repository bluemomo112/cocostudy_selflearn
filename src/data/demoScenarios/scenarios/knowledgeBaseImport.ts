import { DemoScenario } from '../types';
import {
  demoTestResult,
  fluidPressureMistakes,
  fluidPressureKnowledgePoints,
  fluidPressureResources,
  fluidPressureQuestions,
} from '../fluidPressureData';

export const knowledgeBaseImport: DemoScenario = {
  id: 'knowledge_import',
  name: '知识库导入',
  description: '从测验记录/错题集导入，AI 分析薄弱点并生成针对性学习计划',
  category: 'import',
  triggers: {
    dropdown: true,
    onKnowledgeImport: true,
  },
  scenarioData: {
    quizResults: demoTestResult,
    mistakes: fluidPressureMistakes,
    knowledgePoints: fluidPressureKnowledgePoints,
  },
  steps: [
    // Step 0: AI 主动加载分析
    {
      id: 0,
      prefilledInput: null,
      aiResponse: '已加载测验记录/错题集，正在分析...',
    },
    // Step 1: 测验结果 + 按知识点分类错题
    {
      id: 1,
      prefilledInput: null,
      aiResponse: `分析完成！你在「流体压强与流速关系」测验中得分 **60/100**，共答错 6 道题。

让我按知识点分类你的错题：

**❌ 流体压强与流速关系**（3 题）
- 龙卷风「吸」物体原理
- 湿布试管液面变化
- 台风掀翻屋顶

**❌ 伯努利原理应用**（2 题）
- 多选题漏选
- 概念混淆

**❌ 压强差**（1 题）
- 吸力与推力的本质区别`,
      actionCards: [
        {
          icon: '📊',
          title: '查看错题分布',
          subtitle: '按知识点查看详细错题统计',
          action: 'view_mistake_distribution',
        },
      ],
    },
    // Step 2: 识别最大薄弱点
    {
      id: 2,
      prefilledInput: null,
      aiResponse: `我发现你最大的薄弱点是：**流速与压强的关系**

你在 3 道相关题目中都选择了「吸力」相关选项，说明你可能还没有理解：
- 流速快 → 压强低
- 压强差 → 产生推力（不是吸力）

我建议从「龙卷风」这道题开始，用苏格拉底式对话帮你理解核心概念。准备好了吗？`,
      actionCards: [
        {
          icon: '🎯',
          title: '开始针对性复习',
          subtitle: '从最薄弱的知识点开始突破',
          action: 'start_review',
        },
      ],
    },
    // Step 3: 展示龙卷风题，开始苏格拉底对话
    {
      id: 3,
      prefilledInput: '好的，我们开始',
      aiResponse: `很好！让我们重新看这道题：

---

**龙卷风经过时，能把地面上的物体「吸」到空中，这是因为：**

A. 龙卷风内部气流速度极大，气压远低于外部，内外压强差将物体推入气流中
B. 龙卷风产生的强大吸力直接将物体吸起
C. 龙卷风的旋转产生离心力将物体甩起
D. 龙卷风内部温度极高，热空气上升带动物体

你当时选了 B，但正确答案是 A。

---

我先问你一个问题：**当你用吸管喝饮料时，是吸管在「吸」饮料吗？**`,
      actionCards: [
        {
          icon: '📝',
          title: '查看原题',
          subtitle: '查看完整题目和你的作答记录',
          action: 'view_original_question',
          actionPayload: 'wq0-1',
        },
      ],
    },
    // Step 4: 用户回答，确认理解并过渡
    {
      id: 4,
      prefilledInput: '应该是压强差产生的推力',
      aiResponse: `**完全正确！**

不是吸管在「吸」，而是：
1. 你吸气 → 吸管内气压降低
2. 外部大气压 > 内部气压
3. 压强差 → **推动**饮料上升

龙卷风也是同样的道理：
- 龙卷风中心流速极快 → 压强极低
- 外部压强 > 内部压强
- 压强差 → **推动**物体进入龙卷风

**物理学中不存在真正的「吸力」，只有压强差产生的推力。**

现在你已经理解了核心概念，让我们继续巩固其他错题类型。`,
      actionCards: [
        {
          icon: '➡️',
          title: '下一道',
          subtitle: '继续复习下一个错题类型',
          action: 'next_mistake',
        },
        {
          icon: '⏭️',
          title: '跳过',
          subtitle: '跳过剩余错题，直接进入练习',
          action: 'skip_to_practice',
        },
      ],
    },
    // Step 5: 生成变式题（注入任务）
    {
      id: 5,
      prefilledInput: null,
      aiResponse: '我为你生成了 3 道变式题目，帮你巩固「流速-压强-推力」的完整逻辑链。',
      injectTask: {
        id: 'knowledge-import-variants',
        type: 'quiz',
        title: '流体压强变式练习',
        description: '巩固流速与压强关系的核心概念',
        status: 'available',
        required: false,
        questions: fluidPressureQuestions.slice(1, 4),
      },
      actionCards: [
        {
          icon: '✏️',
          title: '开始练习',
          subtitle: '完成 3 道变式题巩固理解',
          action: 'start_quiz',
          actionPayload: 'knowledge-import-variants',
        },
      ],
    },
    // Step 6: 完成练习，展示结果和进步轨迹
    {
      id: 6,
      prefilledInput: '我做完了',
      aiResponse: `太棒了！让我看看你的答题情况：

**✅ 3/3 全部正确！**

你的进步轨迹：
- 初始测验：60/100（流速-压强关系错误率 100%）
- 苏格拉底对话：理解核心概念
- 变式练习：3/3 正确（错误率 0%）

**你已经完全掌握了「流速-压强-推力」的逻辑链！**`,
      actionCards: [
        {
          icon: '📈',
          title: '查看进步图表',
          subtitle: '查看完整的学习进步可视化',
          action: 'view_progress_chart',
        },
      ],
    },
    // Step 7: 综合学习计划 + 推荐资源
    {
      id: 7,
      prefilledInput: null,
      aiResponse: `根据你的错题分析，我为你制定了完整的学习计划：

**📚 第一阶段：概念巩固**（已完成 ✅）
- 流速与压强的关系
- 压强差的本质

**📚 第二阶段：应用拓展**（进行中）
- 伯努利原理的多场景应用
- 多选题的全面思考方法

**📚 第三阶段：综合提升**
- 混合题型练习
- 实验设计与分析

我还为你推荐了以下学习资源：`,
      injectResources: fluidPressureResources,
      actionCards: [
        {
          icon: '📋',
          title: '查看计划',
          subtitle: '查看完整的分阶段学习计划',
          action: 'view_study_plan',
        },
        {
          icon: '📚',
          title: '打开资源库',
          subtitle: '浏览推荐的学习资源',
          action: 'open_panel',
          actionPayload: 'resources',
        },
      ],
    },
  ],
};
