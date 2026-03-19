import { DemoScenario } from '../types';
import {
  fluidPressureResources,
  fluidPressureQuestions,
} from '../fluidPressureData';

export const uploadAndAnalyze: DemoScenario = {
  id: 'upload_and_analyze',
  name: '上传与分析',
  description: '上传学习文档，AI 自动提取知识点并生成练习题和思维导图',
  category: 'upload',
  triggers: {
    dropdown: true,
    onFileUpload: true,
  },
  steps: [
    {
      id: 0,
      prefilledInput: null,
      aiResponse:
        '收到文件，正在分析……\n\n检测到这是一份关于**流体压强**的物理学习资料，包含约 12 页内容。让我为你提取关键知识点。',
    },
    {
      id: 1,
      prefilledInput: null,
      aiResponse: `文档分析完成，提取到以下核心知识点：

**1. 伯努利原理**
- 流体速度增大时，压强减小
- 流体速度减小时，压强增大
- 能量守恒在流体中的体现

**2. 压强差**
- 流体流速不同导致压强差
- 压强差产生作用力
- 压强差与流速的定量关系

**3. 应用场景**
- 飞机机翼升力原理
- 喷雾器工作原理
- 虹吸现象、站台安全线

这些知识点我可以帮你生成练习题、推荐视频资源，或者制作思维导图。`,
      actionCards: [
        {
          icon: '📋',
          title: '查看知识提纲',
          subtitle: '查看完整的知识点结构',
          action: 'view_outline',
        },
      ],
    },
    {
      id: 2,
      prefilledInput: '帮我生成练习题',
      aiResponse:
        '好的，我根据文档内容为你生成了 5 道练习题，涵盖单选题和多选题，难度从基础到进阶，覆盖伯努利原理、压强差和实际应用三个模块。',
    },
    {
      id: 3,
      prefilledInput: null,
      aiResponse:
        '练习题已准备好，共 5 道题，预计用时 8 分钟。题目涵盖龙卷风现象、站台安全线、飞机升力等经典场景，帮你检验对流体压强的理解。',
      actionCards: [
        {
          icon: '✏️',
          title: '开始练习',
          subtitle: '5 道题 · 预计 8 分钟',
          action: 'start_quiz',
          actionPayload: 'upload-analysis-quiz',
        },
      ],
      injectTask: {
        id: 'upload-analysis-quiz',
        type: 'quiz',
        title: '流体压强练习题',
        description: '根据上传文档生成的练习题',
        status: 'available',
        required: false,
        questions: fluidPressureQuestions,
      },
    },
    {
      id: 4,
      prefilledInput: '我想看伯努利原理的视频',
      aiResponse:
        '为你找到了伯努利原理的优质学习资源，包括一个演示实验视频和一篇系统讲解文章：',
      actionCards: [
        {
          icon: '🎬',
          title: '观看视频',
          subtitle: '伯努利原理演示实验',
          action: 'open_resource',
          actionPayload: 'bernoulli-video-01',
        },
        {
          icon: '📄',
          title: '阅读文章',
          subtitle: '流体力学基础 · 系统讲解',
          action: 'open_resource',
          actionPayload: 'fluid-mechanics-article-01',
        },
      ],
      injectResources: fluidPressureResources,
    },
    {
      id: 5,
      prefilledInput: null,
      aiResponse:
        '这些资源可以帮你深入理解伯努利原理。要不要我生成一张思维导图来整理概念？这样能更清晰地看到知识点之间的关系。',
      actionCards: [
        {
          icon: '🧠',
          title: '生成思维导图',
          subtitle: '整理知识点关系结构',
          action: 'generate_mindmap',
        },
        {
          icon: '📖',
          title: '继续学习',
          subtitle: '先看资源，稍后再整理',
          action: 'continue_learning',
        },
      ],
    },
    {
      id: 6,
      prefilledInput: '生成思维导图',
      aiResponse: `好的，我为你生成了流体压强的知识结构图：

\`\`\`
              流体压强
        ┌────────┼────────┐
     基本概念   伯努利原理   实际应用
     ┌─┼─┐    ┌──┼──┐    ┌──┼──┐
   压强 流体 压强  速度 能量 定量  飞机 喷雾 虹吸
   定义 特性 传递  压强 守恒 公式  升力  器  现象
              关系
                         站台  台风
                         安全线 掀顶
\`\`\`

思维导图已保存到你的笔记中，可以随时查看和编辑。`,
      actionCards: [
        {
          icon: '🗺️',
          title: '打开思维导图',
          subtitle: '在笔记面板中查看完整导图',
          action: 'open_panel',
          actionPayload: 'notes',
        },
      ],
      sideEffects: [
        {
          type: 'open_panel',
          target: 'notes',
        },
      ],
    },
    {
      id: 7,
      prefilledInput: null,
      aiResponse: `**学习资源已全部准备完成**

✓ 已添加 3 个学习资源（视频 + 讲义 + 文章）
✓ 已生成 5 道练习题（单选 + 多选）
✓ 已创建知识结构思维导图

你可以从任意入口开始学习，完成练习题后我会根据答题情况提供针对性讲解。`,
      actionCards: [
        {
          icon: '✏️',
          title: '做测验',
          subtitle: '开始流体压强练习题',
          action: 'start_quiz',
          actionPayload: 'upload-analysis-quiz',
        },
        {
          icon: '📚',
          title: '看资源',
          subtitle: '浏览学习资料',
          action: 'open_panel',
          actionPayload: 'resources',
        },
        {
          icon: '💬',
          title: '提问',
          subtitle: '对知识点有疑问？直接问我',
          action: 'focus_input',
        },
      ],
    },
  ],
};
