# Seseyuan 学习空间演示剧本 - 完整版

## 📋 演示场景概述

**场景名称**：二次函数单元测验后的AI引导学习

**学生角色**：李小明（中三学生）

**测验信息**：
- 测验名称：第二章 二次函數 單元測驗
- 科目：數學
- 年级：中三
- 班级：中三(1)班
- 测验日期：2024-01-15
- 总题数：15题
- 得分：88分（满分150分）
- 答对：11题
- 答错：4题

---

## 🎯 演示目标

展示学生在完成测验后，如何通过学习空间：
1. **查看测验结果**：看到自己的得分和错题
2. **AI苏格拉底式引导**：通过对话理解错误原因
3. **知识点关联学习**：查看相关讲义和视频
4. **变式题练习**：做类似题巩固理解
5. **工具辅助学习**：使用概念图、笔记模板等工具

---

## 🏗️ 一、架构理解

### 1.1 教师端/学生端关系

self-learn 是一个通用组件库，教师端和学生端共用同一套代码，通过 `mode` 参数区分：

```typescript
SelfStudyWorkbench({
  mode: 'teacher' | 'student',
  config: SpaceConfig,
  spaceId?: string
})

// 内部实现
const isStudentMode = mode === 'student'

// 通过 isStudentMode 控制 UI 显示/隐藏
{!isStudentMode && (
  <button>發佈學習空間</button>
)}
```

### 1.2 现有组件

- **PublishModal.tsx** - 发布配置弹窗（已存在）
  - 学习空间名称
  - 年级、科目、章节选择
  - 班级绑定
  - 匿名模式开关
  - 发布范围配置

- **SettingsModal.tsx** - 设置弹窗（已存在）
  - AI 助手风格
  - 知识围栏
  - 学习方式（需删除）
  - AI 监督配置（需添加）

### 1.3 seseyuan 项目引用方式

```typescript
// seseyuan_teacher/app/learning-space/[id]/page.tsx
import { SelfStudyWorkbench } from '@cross-workspace/self-learn'

<SelfStudyWorkbench
  mode="teacher"
  config={spaceConfig}
  onUpdateConfig={handleUpdate}
/>

// seseyuan_stu/app/learning/[spaceId]/page.tsx
<SelfStudyWorkbench
  mode="student"
  spaceId={spaceId}
  config={loadedConfig}
/>
```

---

## 📊 二、测验数据结构

### 2.1 测验结果 (TestResult)

```typescript
interface TestResult {
  taskId: string
  studentId: string
  studentName: string
  score: number
  totalScore: number
  correctCount: number
  totalCount: number
  completedAt: string
  wrongAnswers: WrongAnswer[]
}

interface WrongAnswer {
  questionId: string
  questionContent: string
  questionType: 'single_choice' | 'multiple_choice' | 'calculation' | 'essay'
  studentAnswer: string
  correctAnswer: string
  score: number
  fullScore: number
  knowledgePoint: string
  knowledgePointId: string

  // AI错误成因分析（来自 coco-assessment）
  aiErrorAnalysis: {
    summary: string
    errorTypes: {
      type: string
      description: string
      percentage: number
    }[]
    rootCauses: string[]
  }

  // AI补救教学建议（来自 coco-assessment）
  aiTeachingSuggestion: {
    summary: string
    strategies: {
      title: string
      description: string
    }[]
    resources: string[]
  }
}
```

### 2.2 李小明的测验结果

```typescript
const demoTestResult: TestResult = {
  taskId: 'math-quadratic-test-001',
  studentId: 'student_002',
  studentName: '李小明',
  score: 88,
  totalScore: 150,
  correctCount: 11,
  totalCount: 15,
  completedAt: '2024-01-15T15:30:00',

  wrongAnswers: [
    // 见下文详细数据
  ]
}
```

---

## 🌳 三、知识点体系

### 3.1 知识点树状结构

```
第二章 二次函數
├── 2.1 二次函數的概念
│   ├── kp_definition          二次函數定義
│   └── kp_general_form        一般式 y=ax²+bx+c
│
├── 2.2 二次函數的圖像
│   ├── kp_parabola            拋物線特徵
│   ├── kp_opening             開口方向（a的符號）
│   ├── kp_symmetry_axis       對稱軸 x=-b/2a        ← 錯題 q2
│   ├── kp_vertex_coord        頂點坐標              ← 錯題 q4
│   └── kp_intersection        與坐標軸交點
│
├── 2.3 二次函數的性質
│   ├── kp_vertex_form         頂點式 y=a(x-h)²+k
│   ├── kp_monotonicity        單調性判斷            ← 錯題 q6
│   ├── kp_max_min             最大值/最小值
│   └── kp_transformation      圖像平移變換
│
└── 2.4 二次函數的應用
    ├── kp_undetermined        待定係數法
    ├── kp_application_max     最值應用題            ← 錯題 q9
    └── kp_application_motion  拋物線運動
```

### 3.2 知识点关联资源

| 知识点 | 讲义 | 视频 | 互动工具 |
|--------|------|------|----------|
| 對稱軸公式 | 對稱軸公式推導講義 | 對稱軸公式推導動畫(3min) | 二次函數圖像工具 |
| 頂點坐標計算 | 配方法詳解講義 | 配方法分步示範(5min) | 頂點坐標計算器 |
| 單調性判斷 | 二次函數性質對比表 | 單調性動態演示(4min) | GeoGebra 互動 |
| 應用題建模 | 經典應用題題型歸納 | 應用題解題流程(6min) | 情境分析模板 |

---

## ❌ 四、4道错题的完整数据

以下数据直接来自 seseyuan-coco-assessment 的 WrongQuestionBook.tsx

### 错题1：对称轴方程（q2）

```typescript
{
  questionId: 'q2',
  questionContent: '寫出二次函數 y=x²-6x+5 之對稱軸方程',
  questionType: 'calculation',
  studentAnswer: 'x=6',
  correctAnswer: 'x=3',
  score: 8,
  fullScore: 10,
  knowledgePoint: '二次函數性質',
  knowledgePointId: 'kp_symmetry_axis',

  aiErrorAnalysis: {
    summary: '對稱軸公式 x=-b/2a 記錯，直接使用 b 之值而非 -b/2a',
    errorTypes: [
      {
        type: '公式記憶錯誤',
        description: '忘記負號，直接用 b=6 作為對稱軸',
        percentage: 100
      }
    ],
    rootCauses: [
      '對稱軸公式理解不深，只是機械記憶',
      '沒有理解公式中負號的來源（從頂點式推導）',
      '缺乏用圖像驗證的習慣'
    ]
  },

  aiTeachingSuggestion: {
    summary: '建議從頂點式推導對稱軸公式，建立公式與圖像的聯繫',
    strategies: [
      {
        title: '公式推導理解',
        description: '從 y=a(x-h)²+k 出發，理解 x=h=-b/2a 的來源'
      },
      {
        title: '圖像驗證法',
        description: '畫出圖像，用對稱性驗證對稱軸位置'
      },
      {
        title: '記憶口訣',
        description: '「負b除以2a」，強調負號不能丟'
      }
    ],
    resources: [
      '對稱軸公式推導動畫',
      '二次函數圖像工具',
      '對稱軸專項練習'
    ]
  }
}
```
