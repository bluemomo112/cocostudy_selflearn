import type { DemoScenario } from '../types';
import {
  fluidPressureResources,
  fluidPressureTasks,
  fluidPressureQuestions,
} from '../fluidPressureData';

export const onboardingTour: DemoScenario = {
  id: 'onboarding_tour',
  category: 'onboarding',
  title: '新手引导：完整学习流程',
  description: '体验从学习到练习的完整流程，了解所有核心功能',
  triggers: {
    dropdown: true,
  },
  steps: [
    {
      userMessage: null,
      aiResponse: `欢迎来到自习室！让我带你快速了解这个学习空间。

**界面布局**：
- **左侧**：学习资源库 - 存放你的学习材料
- **中间**：对话区 - 和我交流，获取学习建议
- **右侧**：工作台 - 完成练习、记笔记、查看学习记录

现在，试着告诉我你想学什么吧！`,
    },
    {
      userMessage: '我想学习流体压强',
      aiResponse: `好的！关于流体压强，我可以帮你：

1. **上传已有资料** - 如果你有课本、笔记或其他材料
2. **生成学习路径** - 我来为你规划学习内容

你想怎么开始？`,
      actionCards: [
        {
          label: '生成学习路径',
          action: 'advance',
        },
      ],
    },
    {
      userMessage: '生成学习路径',
      aiResponse: `我为你规划了流体压强的学习路径，包含 3 个核心知识点：

1. **伯努利原理基础** - 理解流速与压强的关系
2. **伯努利方程应用** - 学会计算实际问题
3. **生活中的伯努利现象** - 飞机升力、喷雾器等

学习资料已添加到左侧资源库，你可以随时查看。`,
      injectResources: fluidPressureResources,
    },
    {
      userMessage: '我想做一些练习题',
      aiResponse: `好的！我为你准备了 3 道练习题，涵盖：
- 伯努利原理的概念理解
- 实际场景的应用分析
- 开放性思考题

练习任务已创建，点击右侧工作台的"任务"标签开始答题吧！`,
      injectTasks: [
        {
          id: 'onboarding_quiz_task',
          title: '流体压强练习',
          type: 'quiz',
          status: 'pending',
          createdAt: new Date().toISOString(),
          content: {
            questions: fluidPressureQuestions.map((q) => q.id),
            timeLimit: 600,
          },
        },
      ],
      injectQuestions: fluidPressureQuestions,
    },
    {
      userMessage: null,
      aiResponse: `💡 **提示**：右侧工作台顶部有三个标签：
- **任务** - 查看和完成练习
- **笔记** - 记录学习心得
- **学习记录** - 回顾学习历程

现在切换到"任务"标签，开始答题吧！`,
    },
    {
      userMessage: '我做完了',
      aiResponse: `让我看看你的答案...

**答题结果**：
✅ 第 1 题：正确 - 你准确理解了伯努利原理
✅ 第 2 题：正确 - 喷雾器原理分析到位
❌ 第 3 题：需要改进

关于龙卷风的问题，你的答案还不够完整。让我们一起思考：

**龙卷风中心的气压是高还是低？为什么？**`,
    },
    {
      userMessage: '中心气压低，因为空气流速快',
      aiResponse: `很好！你抓住了关键点。

再深入思考一下：**流速快的地方，压强是大还是小？**

这是伯努利原理的核心。`,
    },
    {
      userMessage: '流速快的地方压强小',
      aiResponse: `完全正确！🎉

**伯努利原理**：流速 ↑ → 压强 ↓

所以龙卷风中心流速极快，压强极低，周围空气被"吸"进去，形成强大的破坏力。

你已经掌握了这个知识点！要不要：
- 记录到笔记中
- 或者用思维导图整理一下流体压强的知识体系？`,
      actionCards: [
        {
          label: '查���学习记录',
          action: 'advance',
        },
      ],
    },
    {
      userMessage: null,
      aiResponse: `💡 **学习记录功能**

右侧工作台的"学习记录"标签会自动记录：
- 你学习的所有知识点
- 完成的练习和成绩
- 和我的对话历史

这是你专属的学习档案，随时可以回顾！`,
    },
    {
      userMessage: null,
      aiResponse: `🎓 **引导完成！**

你已经体验了自习室的核心功能：
- ✅ 生成学习资源
- ✅ 完成练习任务
- ✅ 互动式答疑
- ✅ 学习记录追踪

现在，开始你的真实学习之旅吧！有任何问题随时问我。`,
    },
  ],
};
