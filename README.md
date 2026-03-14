# @cross/self-learn

自习室核心模块，包含教师端和学生端的完整工作台组件、Mock 数据和类型定义。

## 安装

```bash
# npm
npm install github:bluemomo112/cocostudy_selflearn

# pnpm
pnpm add github:bluemomo112/cocostudy_selflearn
```

## 教师端集成

教师端提供自习空间的创建、配置、资源管理和学习数据分析功能。

### 路由结构

```
/teacher/self-study              → 空间管理页（列表 / 引导 / 创建）
/teacher/self-study/[spaceId]    → 工作台（编辑资源、任务、AI 对话）
/teacher/self-study/[spaceId]/results → 班级学习数据分析
```

### 示例

```tsx
// app/teacher/self-study/page.tsx
'use client';

import { useState } from 'react';
import {
  SelfStudyWorkbench,
  SpaceManager,
  Onboarding,
  CreationMethodModal,
  FileUploadModal,
  UnifiedResourceLibraryModal,
  AIGenerateFormModal,
  SpaceResults,
  usePersistedState,
  clearSpaceStorage,
  type SpaceSummary,
  type SpaceConfig,
  createDefaultSpaceConfig,
  type Resource,
} from '@cross/self-learn';

export default function SelfStudyPage() {
  // 完整实现参考 cross-new/src/app/teacher/self-study/page.tsx
}
```

## 学生端集成

学生端提供学习资源浏览、AI 辅导对话、任务完成和笔记记录功能。

### 路由结构

```
/learn/[spaceId]    → 学生学习工作台
```

### 示例

```tsx
// app/learn/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { SelfStudyWorkbench } from '@cross/self-learn';

export default function LearnPage() {
  const params = useParams();
  const spaceId = params.id as string;

  return (
    <div className="h-screen w-screen overflow-hidden">
      <SelfStudyWorkbench
        spaceId={spaceId}
        mode="student"
        onBack={() => window.history.back()}
      />
    </div>
  );
}
```

## Tailwind 配置

### Tailwind v3（大多数项目）

在 `tailwind.config.js` 的 `content` 中添加：

```js
content: [
  // ... 原有配置
  './node_modules/@cross/self-learn/src/**/*.{ts,tsx}',
]
```

### Tailwind v4

在 `globals.css` 中添加 `@source`：

```css
@import "tailwindcss";
@source "../../../self-learn/src/**/*.{ts,tsx}";
```

## 可用导出

### 核心组件

| 组件 | 说明 |
|------|------|
| `SelfStudyWorkbench` | 主工作台（教师端 / 学生端共用） |
| `SpaceManager` | 空间列表管理 |
| `SpaceResults` | 学习数据分析 |
| `Onboarding` | 首次使用引导 |

### 弹窗组件

`CreationMethodModal` / `FileUploadModal` / `UnifiedResourceLibraryModal` / `AIGenerateFormModal` / `ExamDetectedModal` / `FreeModeConfigModal` / `GuidedModeConfigModal` / `InteractiveViewerModal` / `KnowledgeBaseModal` / `LinkInputModal` / `MetaConfigModal` / `PublishModal` / `ResourceInlineViewer` / `ResourceLibraryModal` / `ResourceSettingsPopover` / `SettingsModal` / `TaskSettingsPopover`

### 类型 / 工具 / 数据

```tsx
// 类型
import type { SpaceConfig, SpaceSummary, LearningMode, Resource, Task } from '@cross/self-learn';

// 工具
import { usePersistedState, clearSpaceStorage, loadFromStorage, useLanguage } from '@cross/self-learn';

// Mock 数据
import { mockResources, mockTasks } from '@cross/self-learn';
```

## 更新

```bash
npm install github:bluemomo112/cocostudy_selflearn   # npm
pnpm add github:bluemomo112/cocostudy_selflearn       # pnpm
```

## 环境要求

- React >= 18
- Next.js >= 14
- Node.js >= 18
