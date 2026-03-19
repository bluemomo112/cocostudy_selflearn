/**
 * S2: 测验复习引导场景
 * 学生完成流体压强测验后，通过苏格拉底式对话进行错题复习
 */

import { DemoScenario, DemoStep } from '../types';
import {
  demoStudentProfile,
  demoTestResult,
  fluidPressureMistakes,
  fluidPressureKnowledgePoints,
} from '../fluidPressureData';

const steps: DemoStep[] = [
  // Step 0: AI 主动发言 - 欢迎 + 成绩概览
  {
    id: 0,
    prefilledInput: null,
    aiResponse: `你好王芳！👋 欢迎来到你的学习空间。

我看到你刚完成了**「流体压强与流速关系」专项测验**，成绩如下：

| 项目 | 结果 |
|------|------|
| 得分 | 60 / 100 |
| 答对 | 9 / 15 题 |
| 答错 | 6 题 |

其中有几道关于**伯努利原理**和**流体压强**的题目值得我们一起回顾。

你觉得哪些题目最让你困惑？我们可以从那里开始。`,
    sideEffects: [
      { type: 'highlight', target: 'test-result-panel' },
    ],
  },
  // Step 1: 用户说"龙卷风那题我不太确定" - AI 引导回顾龙卷风题
  {
    id: 1,
    prefilledInput: '龙卷风那题我不太确定',
    aiResponse: `好的，我们来看看这道龙卷风的题目。

> 龙卷风经过时，能把地面上的物体「吸」到空中，这是因为……

你当时选了 **B：龙卷风产生的强大吸力直接将物体吸起**。

我想先问你一个问题：你觉得「吸」这个动作，在物理上到底是怎么发生的？真的存在一种「吸力」吗？🤔`,
    sideEffects: [
      { type: 'highlight', target: 'bernoulli-video-01' },
    ],
  },
  // Step 2: 用户说"应该是有什么力量把东西推上去的？" - AI 追问伯努利原理
  {
    id: 2,
    prefilledInput: '应该是有什么力量把东西推上去的？',
    aiResponse: `很好！你的直觉方向是对的——确实是「推」而不是「吸」。

在物理学中，**不存在真正的「吸力」**。那么问题来了：

如果龙卷风内部的空气在高速旋转，根据你学过的知识，**流速快的地方，压强会怎么变化？**`,
    sideEffects: [
      { type: 'highlight', target: 'bernoulli' },
    ],
  },
  // Step 3: 用户说"流速快...压强应该变小？" - AI 揭示答案 + 错误分析
  {
    id: 3,
    prefilledInput: '流速快...压强应该变小？',
    aiResponse: `完全正确！🎯

**流速越大，压强越小**——这就是**伯努利原理**的核心。

所以龙卷风的真相是：
1. 龙卷风内部气流速度极大
2. 根据伯努利原理，内部气压**远低于**外部
3. 外部的高气压把物体**推入**低压区域

正确答案是 **A**。你选的 B 说「吸力」，其实物理上不存在吸力，本质都是**压强差产生的推力**。

> 💡 记住：每当你听到「吸」，都可以翻译成「另一侧压强更大，把东西推过来」。

想更深入理解吗？可以看看这个演示影片，或者查看详细的错题分析。`,
    actionCards: [
      { icon: '🎬', title: '观看影片', subtitle: '伯努利原理演示实验', action: 'navigate', actionPayload: 'bernoulli-video-01' },
      { icon: '📋', title: '查看错题分析', subtitle: '龙卷风题详细解析', action: 'navigate', actionPayload: 'wq0-1' },
    ],
    sideEffects: [
      { type: 'highlight', target: 'bernoulli-video-01' },
    ],
  },
  // Step 4: 影片观后 + 生成类似题
  {
    id: 4,
    prefilledInput: '我看完影片了，地铁站台设安全线是因为列车经过时速度快，旁边压强变小',
    aiResponse: `太棒了！你已经能把伯努利原理迁移到新的场景了。

地铁安全线就是一个经典的例子：列车高速通过 → 靠近列车的空气流速大 → 压强小 → 人会被「推向」列车方向。

现在我想用一道类似题来检验一下你的理解，这道题和你之前做错的「湿布瓶题」有关：

> 两支相同试管装等量水，一支用湿布包裹，用电风扇吹风一段时间后，两管液面高度关系是？
>
> A. 两管液面一样高
> B. 湿布试管液面较高
> C. 无法判断
> D. 湿布试管液面较低

试试看？`,
    sideEffects: [
      { type: 'highlight', target: 'wq0-2' },
    ],
  },
  // Step 5: 正确反馈 + 学习小结
  {
    id: 5,
    prefilledInput: 'D，因为湿布蒸发让那边流速更快，压强更小，水面被压下去',
    aiResponse: `回答正确！🎉

你的分析思路很清晰：
1. 湿布表面水分蒸发 → 加速附近空气流动
2. 流速增大 → 该侧气压降低
3. 另一侧气压相对较高 → 将液面「压低」

**本次学习小结：**
- ✅ 掌握了伯努利原理的核心（流速↑ → 压强↓）
- ✅ 能正确区分「吸力」与「压强差」
- ✅ 能将原理迁移到新场景（地铁安全线、湿布实验）

**补救建议：** 你还有 4 道错题涉及声学知识（音调、乐器发声、声波特征），建议接下来继续学习。`,
    actionCards: [
      { icon: '📚', title: '继续学习', subtitle: '声学错题复习', action: 'trigger', actionPayload: 'next_topic' },
      { icon: '📝', title: '记笔记', subtitle: '整理本次学习要点', action: 'navigate', actionPayload: 'notes' },
      { icon: '🧠', title: '生成思维导图', subtitle: '伯努利原理知识图谱', action: 'trigger', actionPayload: 'mindmap' },
    ],
    sideEffects: [
      { type: 'update_ui', target: 'knowledge-progress', value: { bernoulli: 'mastered', 'fluid-pressure': 'mastered' } },
    ],
  },
  // Step 6: AI 主动发言 - 元认知导师观察
  {
    id: 6,
    prefilledInput: null,
    aiResponse: `**🔍 学习状态观察（导师面板）**

王芳在本次学习中表现出良好的思维品质：

- **思维转变**：从「吸力」的日常认知成功过渡到「压强差」的物理概念
- **迁移能力**：能主动将伯努利原理应用到地铁安全线场景
- **自我修正**：在引导下逐步修正了错误认知，而非被动接受答案

**建议关注**：声学部分的 4 道错题显示学生在「物理量对应关系」上存在系统性薄弱，建议下次学习重点突破。`,
    sideEffects: [
      { type: 'open_panel', target: 'teacher-observation' },
    ],
  },
];

export const postQuizRemediation: DemoScenario = {
  id: 'post_quiz_review',
  name: '测验复习引导',
  description: '完成流体压强测验后的苏格拉底式复习',
  category: 'post_quiz',
  steps,
  scenarioData: {
    studentProfile: demoStudentProfile,
    quizResults: demoTestResult,
    mistakes: fluidPressureMistakes,
    knowledgePoints: fluidPressureKnowledgePoints,
  },
  triggers: {
    dropdown: true,
    onQuizComplete: true,
  },
};