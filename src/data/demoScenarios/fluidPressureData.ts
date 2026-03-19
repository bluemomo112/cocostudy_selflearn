/**
 * 流体压强主题共享数据
 * 所有场景共用的学生档案、错题、资源、知识点数据
 */

import { Resource, TaskQuestion } from '../../types';

// ============ 学生档案 ============

export const demoStudentProfile = {
  id: 's3',
  name: '王芳',
  grade: '中二',
  className: '中二(1)班',
  preScore: 38,
  postScore: 85,
};

// ============ 测验结果 ============

export const demoTestResult = {
  taskId: 'physics-fluid-pressure-001',
  testName: '流体压强与流速关系 专项测验',
  score: 60,
  totalQuestions: 15,
  correctCount: 9,
  wrongCount: 6,
  completedAt: new Date('2024-01-20T10:30:00'),
};

// ============ 错题数据 ============

export const fluidPressureMistakes = [
  {
    id: 'wq0-1',
    questionText:
      '龙卷风经过时，能把地面上的物体「吸」到空中，这是因为：',
    type: 'single' as const,
    options: [
      {
        label: 'A',
        text: '龙卷风内部气流速度极大，气压远低于外部，内外压强差将物体推入气流中',
      },
      { label: 'B', text: '龙卷风产生的强大吸力直接将物体吸起' },
      { label: 'C', text: '龙卷风的旋转产生离心力将物体甩起' },
      { label: 'D', text: '龙卷风内部温度极高，热空气上升带动物体' },
    ],
    correctAnswer: 'A',
    studentAnswer: 'B',
    knowledgePoints: ['流体压强与流速的关系', '伯努利原理'],
  },
  {
    id: 'wq0-2',
    questionText:
      '两支相同试管装等量水，一支用湿布包裹，用电风扇吹风一段时间后，两管液面高度关系是：',
    type: 'single' as const,
    options: [
      { label: 'A', text: '两管液面一样高' },
      { label: 'B', text: '湿布包裹的试管液面较高' },
      { label: 'C', text: '无法判断' },
      { label: 'D', text: '湿布包裹的试管液面较低' },
    ],
    correctAnswer: 'D',
    studentAnswer: 'B',
    knowledgePoints: ['流体压强与流速的关系', '蒸发吸热'],
  },
  {
    id: 'wq0-3',
    questionText: '以下哪些现象可以用伯努利原理解释？',
    type: 'multiple' as const,
    options: [
      { label: 'A', text: '火车站台设置安全线' },
      { label: 'B', text: '飞机机翼产生升力' },
      { label: 'C', text: '用吸管喝饮料' },
      { label: 'D', text: '台风掀翻屋顶' },
    ],
    correctAnswer: 'ABD',
    studentAnswer: 'AB',
    knowledgePoints: ['伯努利原理应用', '液体压强'],
  },
];

// ============ 知识点 ============

export const fluidPressureKnowledgePoints = [
  { id: 'bernoulli', name: '伯努利原理', description: '流速越大，压强越小' },
  { id: 'fluid-pressure', name: '流体压强与流速关系', description: '流体流速不同导致压强差' },
  { id: 'bernoulli-applications', name: '伯努利原理应用', description: '飞机升力、喷雾器、虹吸现象等' },
];

// ============ 学习资源 ============

export const fluidPressureResources: Resource[] = [
  {
    id: 'bernoulli-video-01',
    title: '伯努利原理演示实验',
    type: 'video',
    description: '通过乒乓球、纸张等简单实验演示伯努利效应',
    url: '/resources/bernoulli-demo.mp4',
  },
  {
    id: 'fluid-pressure-doc-01',
    title: '流体压强与流速关系 讲义',
    type: 'document',
    description: '涵盖伯努利原理、流体压强基本概念及典型例题',
    url: '/resources/fluid-pressure-notes.pdf',
  },
  {
    id: 'fluid-mechanics-article-01',
    title: '流体力学基础',
    type: 'document',
    description: '从基本概念到实际应用的系统讲解',
    url: '/resources/fluid-mechanics-basics.pdf',
  },
];

// ============ 练习题 ============

export const fluidPressureQuestions: TaskQuestion[] = [
  {
    id: 'fp-q1',
    type: 'single_choice',
    content: '龙卷风经过时，能把地面上的物体「吸」到空中，这是因为：',
    options: [
      'A. 龙卷风内部气流速度极大，气压远低于外部，内外压强差将物体推入气流中',
      'B. 龙卷风产生的强大吸力直接将物体吸起',
      'C. 龙卷风的旋转产生离心力将物体甩起',
      'D. 龙卷风内部温度极高，热空气上升带动物体',
    ],
    answer: 'A',
    explanation: '根据伯努利原理，流速大的地方压强小，龙卷风内部气压远低于外部，外部高气压将物体推入低压区域。',
    points: 10,
  },
  {
    id: 'fp-q2',
    type: 'single_choice',
    content: '地铁站台为什么要设置安全线？',
    options: [
      'A. 列车经过时，站台与列车间气流速度大，压强低，压强差会把人推向列车',
      'B. 列车产生的吸力会把人吸向列车',
      'C. 列车产生的风力会把人吹向列车',
      'D. 防止乘客不小心掉落轨道',
    ],
    answer: 'A',
    explanation: '列车高速通过时，靠近列车的空气流速大，压强小，人体外侧压强大于内侧，压强差会把人推向列车方向。',
    points: 10,
  },
  {
    id: 'fp-q3',
    type: 'single_choice',
    content: '飞机机翼上表面弯曲，下表面平直，这样设计的原因是：',
    options: [
      'A. 上表面气流速度快，压强小，下表面压强大，压强差产生向上的升力',
      'B. 上表面产生吸力，把飞机吸向上方',
      'C. 弯曲表面产生离心力，把飞机推向上方',
      'D. 减小空气阻力，提高飞行速度',
    ],
    answer: 'A',
    explanation: '机翼上表面弯曲，空气流过的路程长，流速快，压强小；下表面平直，流速慢，压强大。上下压强差产生向上的升力。',
    points: 10,
  },
  {
    id: 'fp-q4',
    type: 'multiple_choice',
    content: '以下哪些现象的本质是「压强差产生推力」而非「吸力」？',
    options: [
      'A. 真空吸盘吸附在墙上',
      'B. 用注射器抽取药液',
      'C. 台风掀翻屋顶',
      'D. 磁铁吸引铁钉',
    ],
    answer: ['A', 'B', 'C'],
    explanation: 'ABC 都是压强差的体现。D 是磁力，不是压强差。',
    points: 10,
  },
  {
    id: 'fp-q5',
    type: 'single_choice',
    content: '两支相同试管装等量水，一支用湿布包裹，用电风扇吹风一段时间后，两管液面高度关系是：',
    options: [
      'A. 两管液面一样高',
      'B. 湿布试管液面较高',
      'C. 无法判断',
      'D. 湿布试管液面较低',
    ],
    answer: 'D',
    explanation: '湿布表面水分蒸发加速附近空气流动，流速大的地方压强小，同时蒸发吸热也会加速该侧液体减少。',
    points: 10,
  },
];
