import { DemoScenario } from '../types';
import { fluidPressureResources, fluidPressureQuestions } from '../fluidPressureData';

export const uploadAndAnalyze: DemoScenario = {
  id: 'upload_and_analyze',
  name: '上传文档并分析',
  category: 'upload',
  triggers: {
    dropdown: true,
    onFileUpload: true,
  },
  steps: [
    {
      role: 'assistant',
      content: '收到文件，正在分析...\n\n我检测到这是一份关于**流体压强**的物理学习资料。让我为你提取关键知识点。',
    },
    {
      role: 'assistant',
      content: `我已经分析完这份文档，提取到以下核心知识点：

**1. 伯努利原理**
- 流体速度增大时，压强减小
- 流体速度减小时，压强增大
- 能量守恒在流体中的体现

**2. 压强差**
- 流体流速不同导致压强差
- 压强差产生作用力
- 压强差与流速的定量关系

**3. 实际应用**
- 飞机机翼升力原理
- 喷雾器工作原理
- 虹吸现象解释

这些知识点我可以帮你生成练习题、推荐相关资源，或者制作思维导图来整理概念。你想从哪里开始？`,
    },
    {
      role: 'user',
      content: '帮我生成练习题',
    },
    {
      role: 'assistant',
      content: '好的，我根据文档内容为你生成了 5 道练习题，涵盖单选题和多选题，难度从基础到进阶。',
      actionCards: [
        {
          type: 'inject_task',
          title: '流体压强练习题',
          description: '5 道题 · 预计 8 分钟',
          questions: fluidPressureQuestions.slice(0, 5),
        },
      ],
    },
    {
      role: 'user',
      content: '我想看伯努利原理的视频',
    },
    {
      role: 'assistant',
      content: '为你找到了伯努利原理的优质学习资源：',
      actionCards: [
        {
          type: 'inject_resource',
          resource: fluidPressureResources[0], // 伯努利原理视频
        },
        {
          type: 'inject_resource',
          resource: fluidPressureResources[2], // 流体力学基础文章
        },
      ],
    },
    {
      role: 'assistant',
      content: '这些资源可以帮你深入理解伯努利原理。要不要生成思维导图整理概念？这样能更清晰地看到知识点之间的关系。',
    },
    {
      role: 'user',
      content: '生成思维导图',
    },
    {
      role: 'assistant',
      content: `好的，我为你生成了流体压强的知识结构图：

\`\`\`
流体压强
├── 基本概念
│   ├── 压强定义
│   ├── 流体特性
│   └── 压强传递
├── 伯努利原理
│   ├── 速度与压强关系
│   ├── 能量守恒
│   └── 定量公式
└── 实际应用
    ├── 飞机升力
    ├── 喷雾器
    └── 虹吸现象
\`\`\`

这个思维导图已经保存到你的笔记中，可以随时查看和编辑。`,
    },
    {
      role: 'assistant',
      content: `**学习资源已准备完成**

✓ 已添加 2 个学习资源（视频 + 文章）
✓ 已生成 5 道练习题
✓ 已创建知识结构思维导图

你可以从资源面板开始学习，完成练习题后我会根据你的答题情况提供针对性的讲解。`,
    },
  ],
};
