import type { DemoScenario } from '../types';
import {
  fluidPressureResources,
  fluidPressureQuestions,
} from '../fluidPressureData';

export const onboardingTour: DemoScenario = {
  id: 'onboarding_tour',
  name: '新手引导',
  description: '体验从学习到练习的完整流程，了解所有核心功能',
  category: 'onboarding',
  triggers: {
    dropdown: true,
  },
  steps: [
    // Step 0: 欢迎 + 界面布局介绍
    {
      id: 0,
      prefilledInput: null,
      aiResponse: `欢迎来到自习室！让我带你快速了解这个学习空间。

**界面布局**：
- **左侧** — 学习资源库，存放你的学习材料
- **中间** — 对话区，和我交流，获取学习建议
- **右侧** — 工作台，完成练习、记笔记、查看学习记录

现在，试着告诉我你想学什么吧！`,
    },

    // Step 1: 用户想学流体压强
    {
      id: 1,
      prefilledInput: '我想学习流体压强',
      aiResponse: `好的！关于流体压强，我可以帮你快速搭建学习空间：

1. **上传已有资料** — 如果你有课本、笔记或其他材料
2. **AI 生成学习路径** — 我来为你规划学习内容和配套资源

你想怎么开始？`,
      actionCards: [
        {
          icon: '📤',
          title: '上传文件',
          subtitle: '上传课本、笔记等已有材料',
          action: 'upload_file',
        },
        {
          icon: '🤖',
          title: 'AI 生成',
          subtitle: '自动生成学习路径和资源',
          action: 'advance',
        },
      ],
    },

    // Step 2: 生成学习路径，注入资源
    {
      id: 2,
      prefilledInput: null,
      aiResponse: `我为你规划了流体压强的学习路径，包含 3 个核心知识点：

1. **伯努利原理基础** — 理解流速与压强的关系
2. **伯努利方程应用** — 学会计算实际问题
3. **生活中的伯努利现象** — 飞机升力、喷雾器等

学习资料已添加到左侧资源库，你可以随时查看。`,
      actionCards: [
        {
          icon: '🗺️',
          title: '查看学习路径',
          subtitle: '在资源库中浏览学习材料',
          action: 'open_panel',
          actionPayload: 'resources',
        },
      ],
      injectResources: fluidPressureResources,
    },

    // Step 3: 生成测验，注入任务
    {
      id: 3,
      prefilledInput: '帮我出几道练习题',
      aiResponse: `好的！我为你准备了练习题，涵盖：
- 伯努利原理的概念理解
- 实际场景的应用分析
- 综合判断题

练习任务已创建，点击下方卡片开始答题吧！`,
      actionCards: [
        {
          icon: '📝',
          title: '开始测验',
          subtitle: '完成流体压强练习题',
          action: 'open_panel',
          actionPayload: 'tasks',
        },
      ],
      injectTask: {
        id: 'onboarding-quiz',
        type: 'quiz',
        title: '流体压强练习',
        description: '伯努利原理与流体压强应用',
        status: 'available',
        required: false,
        questions: fluidPressureQuestions,
      },
    },

    // Step 4: 引导去任务面板做题
    {
      id: 4,
      prefilledInput: null,
      aiResponse: `切换到右侧工作台的「任务」标签，就能看到刚才创建的练习了。

完成答题后，我会自动分析你的作答情况，找出薄弱知识点，并给出针对性的讲解。

准备好了就去做题吧！`,
      actionCards: [
        {
          icon: '📋',
          title: '打开任务',
          subtitle: '前往工作台查看练习',
          action: 'open_panel',
          actionPayload: 'tasks',
        },
      ],
    },

    // Step 5: 模拟做完，2/3 正确
    {
      id: 5,
      prefilledInput: '我做完了',
      aiResponse: `让我看看你的答案……

**答题结果**：
- 第 1 题（地铁安全线）：正确 — 你准确理解了伯努利原理
- 第 2 题（飞机升力）：正确 — 机翼原理分析到位
- 第 3 题（龙卷风）：需要改进

关于龙卷风的问题，你的答案还不够完整。让我们一起思考：

**龙卷风中心的气压是高还是低？为什么？**`,
      actionCards: [
        {
          icon: '🔍',
          title: '查看错题分析',
          subtitle: '了解龙卷风题的详细解析',
          action: 'advance',
        },
      ],
    },

    // Step 6: 苏格拉底追问
    {
      id: 6,
      prefilledInput: null,
      aiResponse: `龙卷风中心的空气旋转速度极快。

根据伯努利原理，流速越大的地方，压强越小。所以龙卷风中心是一个**极低气压区**。

那么问题来了：周围的空气气压比中心高，这个压强差会产生什么效果？

提示：想想「推」和「吸」的区别。`,
    },

    // Step 7: 用户回答，确认理解
    {
      id: 7,
      prefilledInput: '流速快的地方压强小',
      aiResponse: `完全正确！

**伯努利原理核心**：流速 ↑ → 压强 ↓

所以龙卷风中心流速极快、压强极低，周围高压空气将物体「推」进低压区——本质是压强差产生的推力，而不是「吸力」。

你已经掌握了这个知识点！要不要整理一下？`,
      actionCards: [
        {
          icon: '✏️',
          title: '记笔记',
          subtitle: '把关键结论记录到笔记本',
          action: 'open_panel',
          actionPayload: 'notes',
        },
        {
          icon: '🧠',
          title: '生成思维导图',
          subtitle: '用思维导图整理流体压强知识体系',
          action: 'generate_mindmap',
        },
      ],
    },

    // Step 8: 展示学习日志
    {
      id: 8,
      prefilledInput: null,
      aiResponse: `右侧工作台的「学习记录」标签会自动记录：

- 你学习的所有知识点和掌握程度
- 完成的练习和成绩变化趋势
- 和我的对话历史与关键结论

这是你专属的学习档案，随时可以回顾！`,
      actionCards: [
        {
          icon: '📊',
          title: '查看学习日志',
          subtitle: '回顾你的学习历程',
          action: 'open_panel',
          actionPayload: 'log',
        },
      ],
    },

    // Step 9: 总结，邀请自由探索
    {
      id: 9,
      prefilledInput: null,
      aiResponse: `引导完成！你已经体验了自习室的核心功能：

- 生成学习资源与学习路径
- 完成练习任务与自动批改
- 互动式错题分析与苏格拉底追问
- 笔记记录与学习日志追踪

现在，开始你的真实学习之旅吧！有任何问题随时问我。`,
      actionCards: [
        {
          icon: '🚀',
          title: '开始学习',
          subtitle: '自由探索自习室功能',
          action: 'dismiss',
        },
        {
          icon: '📚',
          title: '查看资源库',
          subtitle: '浏览已有的学习材料',
          action: 'open_panel',
          actionPayload: 'resources',
        },
      ],
    },
  ],
};
