import { DemoScenario } from '../types';
import {
  fluidPressureMistakes,
  fluidPressureResources,
  demoTestResult,
  fluidPressureKnowledgePoints,
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
    // Step 0: AI 主动分析
    {
      id: 0,
      prefilledInput: null,
      aiResponse: '已加载测验记录/错题集，正在分析...',
    },
    // Step 1: 展示测验结果和错题分类
    {
      id: 1,
      prefilledInput: null,
      aiResponse: `分析完成！你在「流体压强与流速关系」测验中得分 **60/100**，共答错 6 道题。

让我按知识点分类你的错题：

**❌ 流体压强与流速关系** (3 题)
- 龙卷风「吸」物体原理
- 湿布试管液面变化
- 台风掀翻屋顶

**❌ 伯努利原理应用** (2 题)
- 多选题漏选
- 概念混淆

**❌ 压强差** (1 题)
- 吸力与推力的本质区别`,
    },
    // Step 2: AI 识别最大薄弱点
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
          id: 'start-learning',
          label: '开始学习',
          action: 'trigger',
        },
      ],
    },
    // Step 3: 用户确认，AI 展示龙卷风题目并开始对话
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
    },
    // Step 4: 用户回答，AI 确认理解并过渡到下一个错题类型
    {
      id: 4,
      prefilledInput: '应该是压强差产生的推力',
      aiResponse: `**完全正确！** 🎯

不是吸管在「吸」，而是：
1. 你吸气 → 吸管内气压降低
2. 外部大气压 > 内部气压
3. 压强差 → **推动**饮料上升

龙卷风也是同样的道理：
- 龙卷风中心流速极快 → 压强极低
- 外部压强 > 内部压强
- 压强差 → **推动**物体进入龙卷风

**物理学中不存在真正的「吸力」，只有压强差产生的推力。**

---

现在你已经理解了核心概念，让我们继续巩固其他错题类型。`,
    },
    // Step 5: AI 生成变式题目（注入任务）
    {
      id: 5,
      prefilledInput: null,
      aiResponse: '我为你生成了 3 道变式题目，帮你巩固「流速-压强-推力」的完整逻辑链。',
      injectTask: {
        id: 'fluid-pressure-variants',
        title: '流体压强变式练习',
        subject: '物理',
        type: 'quiz',
        status: 'not_started',
        description: '巩固流速与压强关系的核心概念',
        questions: [
          {
            id: 'variant-1',
            questionText: '地铁站台为什么要设置安全线？',
            type: 'single',
            options: [
              { label: 'A', text: '列车经过时，站台与列车间气流速度大，压强低，压强差会把人推向列车' },
              { label: 'B', text: '列车产生的吸力会把人吸向列车' },
              { label: 'C', text: '列车产生的风力会把人吹向列车' },
              { label: 'D', text: '防止乘客不小心掉落轨道' },
            ],
            correctAnswer: 'A',
            knowledgePoints: ['流体压强与流速的关系', '伯努利原理'],
          },
          {
            id: 'variant-2',
            questionText: '飞机机翼上表面弯曲，下表面平直，这样设计的原因是：',
            type: 'single',
            options: [
              { label: 'A', text: '上表面气流速度快，压强小，下表面压强大，压强差产生向上的升力' },
              { label: 'B', text: '上表面产生吸力，把飞机吸向上方' },
              { label: 'C', text: '弯曲表面产生离心力，把飞机推向上方' },
              { label: 'D', text: '减小空气阻力，提高飞行速度' },
            ],
            correctAnswer: 'A',
            knowledgePoints: ['伯努利原理应用', '流体压强'],
          },
          {
            id: 'variant-3',
            questionText: '以下哪些现象的本质是「压强差产生推力」而非「吸力」？',
            type: 'multiple',
            options: [
              { label: 'A', text: '真空吸盘吸附在墙上' },
              { label: 'B', text: '用注射器抽取药液' },
              { label: 'C', text: '台风掀翻屋顶' },
              { label: 'D', text: '磁铁吸引铁钉' },
            ],
            correctAnswer: 'ABC',
            knowledgePoints: ['压强差', '伯努利原理'],
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      actionCards: [
        {
          id: 'start-quiz',
          label: '开始练习',
          action: 'navigate',
          target: '/task/fluid-pressure-variants',
        },
      ],
    },
    // Step 6: 用户完成练习，AI 展示结果和进步轨迹
    {
      id: 6,
      prefilledInput: '我做完了',
      aiResponse: `太棒了！让我看看你的答题情况：

**✅ 3/3 全部正确！**

你的进步轨迹：
- 初始测验：60/100（流速-压强关系错误率 100%）
- 苏格拉底对话：理解核心概念
- 变式练习：3/3 正确（错误率 0%）

**你已经完全掌握了「流速-压强-推力」的逻辑链！** 🎉

---

接下来我建议：
1. 继续攻克「伯努利原理应用」的多选题漏选问题
2. 完成综合练习，巩固所有知识点`,
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

---

我还为你推荐了以下学习资源：`,
      injectResources: fluidPressureResources,
      actionCards: [
        {
          id: 'view-resources',
          label: '查看推荐资源',
          action: 'navigate',
          target: '/resources',
        },
        {
          id: 'continue-learning',
          label: '继续学习计划',
          action: 'trigger',
        },
      ],
    },
  ],
};
