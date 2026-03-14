# 给同事的快速集成指南

## 安装

在你的项目中安装 cocostudy_selflearn：

```bash
# 使用 npm
npm install github:bluemomo112/cocostudy_selflearn

# 使用 pnpm
pnpm add github:bluemomo112/cocostudy_selflearn

# 使用 yarn
yarn add github:bluemomo112/cocostudy_selflearn
```

## 快速开始

### 1. 完整使用（最简单）

如果你想使用完整的自习室功能：

```tsx
import { SelfStudyWorkbench } from '@cross/self-learn';

function LearningPage() {
  return (
    <SelfStudyWorkbench
      spaceId="my-space-123"
      mode="student"
      onBack={() => window.history.back()}
    />
  );
}
```

### 2. 部分使用（推荐）

如果你只需要某些功能，可以单独导入组件：

```tsx
// 只使用资源管理
import { SpaceManager } from '@cross/self-learn';

// 只使用任务查看器
import { TaskInlineViewer } from '@cross/self-learn/components/task/TaskInlineViewer';

// 只使用聊天面板
import { ChatPanel } from '@cross/self-learn/components/workbench/chat/ChatPanel';
```

### 3. 与你的平台数据集成

```tsx
import { SelfStudyWorkbench } from '@cross/self-learn';
import type { Resource, Task } from '@cross/self-learn';

function MyPlatformLearningPage() {
  // 从你的 API 获取数据
  const resources = await fetchMyResources();
  const tasks = await fetchMyTasks();

  return (
    <SelfStudyWorkbench
      spaceId="space-123"
      mode="student"
      // 传入你的数据
      initialResources={resources}
      initialTasks={tasks}
      // 处理更新
      onResourceUpdate={(resource) => {
        // 保存到你的数据库
        saveToMyDatabase(resource);
      }}
      onTaskComplete={(task) => {
        // 记录到你的系统
        logToMySystem(task);
      }}
    />
  );
}
```

## 常见集成场景

### 场景 A：嵌入到现有页面

```tsx
function MyPlatformPage() {
  return (
    <div className="my-layout">
      <MyHeader />
      <div className="content">
        <MySidebar />
        <main>
          {/* 嵌入自习室 */}
          <SelfStudyWorkbench
            spaceId="space-123"
            mode="student"
          />
        </main>
      </div>
    </div>
  );
}
```

### 场景 B：只使用资源库

```tsx
import { ResourceLibraryModal } from '@cross/self-learn';

function MyResourcePage() {
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <>
      <button onClick={() => setShowLibrary(true)}>
        打开资源库
      </button>

      {showLibrary && (
        <ResourceLibraryModal
          onClose={() => setShowLibrary(false)}
          onSelect={(resource) => {
            console.log('选中资源:', resource);
            // 你的处理逻辑
          }}
        />
      )}
    </>
  );
}
```

### 场景 C：自定义样式

```tsx
// 在你的项目中创建样式文件
// styles/self-learn-custom.css

.self-study-workbench {
  /* 覆盖主题色 */
  --primary-color: #your-brand-color;
  --background-color: #your-bg-color;
}

/* 调整布局 */
.self-study-workbench .chat-panel {
  max-width: 400px;
}
```

## 类型定义

所有类型都可以从包中导入：

```tsx
import type {
  SpaceConfig,
  LearningMode,
  Task,
  Resource,
  TaskQuestion,
  ChatMessage
} from '@cross/self-learn';

// 使用类型
const myTask: Task = {
  id: 'task-1',
  title: '我的任务',
  // ...
};
```

## 更新版本

```bash
# 更新到最新版本
npm update @cross/self-learn

# 或重新安装
npm install github:bluemomo112/cocostudy_selflearn
```

## 需要帮助？

1. 查看完整文档：`INTEGRATION_GUIDE.md`
2. 查看示例代码：`cross-new` 项目中的使用示例
3. 联系原作者获取支持

## 注意事项

- 确保你的项目使用 React 18+ 和 Next.js 14+
- 需要安装 peer dependencies：`react`, `react-dom`, `next`
- 如果遇到样式问题，检查是否有 CSS 冲突
