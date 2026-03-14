# Self-Learn 集成指南

## 适用场景

如果你有一个类似 cross-new 的平台项目，想要集成 self-learn 模块，本指南将帮助你完成集成。

## 方式 1：作为 npm 包使用（推荐）

这是最简单、最标准的方式，适合大多数场景。

### 1.1 安装

```bash
# 从 GitHub 安装
npm install github:你的GitHub用户名/self-learn

# 或从 npm 安装（如果已发布）
npm install @cross/self-learn
```

### 1.2 基础使用

```tsx
import { SelfStudyWorkbench } from '@cross/self-learn';

function MyLearningPage() {
  return (
    <SelfStudyWorkbench
      spaceId="my-space-123"
      mode="student"
      onBack={() => router.back()}
    />
  );
}
```

### 1.3 使用特定组件

```tsx
// 只使用部分组件
import { SpaceManager } from '@cross/self-learn';
import { useLanguage } from '@cross/self-learn';

function MyCustomPage() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('title')}</h1>
      <SpaceManager onSpaceSelect={(id) => console.log(id)} />
    </div>
  );
}
```

### 1.4 使用类型定义

```tsx
import type { SpaceConfig, LearningMode, Task } from '@cross/self-learn';

const myConfig: SpaceConfig = {
  id: 'space-1',
  name: 'My Learning Space',
  mode: 'free' as LearningMode,
  // ...
};
```

### 1.5 使用 Mock 数据（开发/测试）

```tsx
import { mockResources, mockTasks } from '@cross/self-learn';

// 在开发环境使用 mock 数据
const resources = process.env.NODE_ENV === 'development'
  ? mockResources
  : await fetchRealResources();
```

## 方式 2：定制化集成

如果你需要修改 self-learn 的样式或行为，有以下几种方式：

### 2.1 通过 Props 定制（推荐）

```tsx
<SelfStudyWorkbench
  spaceId="my-space"
  mode="student"
  // 自定义配置
  customConfig={{
    theme: 'dark',
    language: 'zh-CN',
    features: {
      aiChat: true,
      notes: true,
      timeline: false
    }
  }}
  // 自定义回调
  onTaskComplete={(task) => {
    // 你的自定义逻辑
    console.log('Task completed:', task);
  }}
  onResourceView={(resource) => {
    // 你的自定义逻辑
    console.log('Resource viewed:', resource);
  }}
/>
```

### 2.2 CSS 覆盖

在你的项目中创建自定义样式：

```css
/* your-project/styles/self-learn-overrides.css */

/* 覆盖 self-learn 的样式 */
.self-study-workbench {
  --primary-color: #your-brand-color;
  --background-color: #your-bg-color;
}

/* 或使用更具体的选择器 */
.self-study-workbench .chat-panel {
  background: linear-gradient(to bottom, #fff, #f5f5f5);
}
```

### 2.3 使用 patch-package（小修改）

如果需要修改 self-learn 的源码，但不想 fork：

```bash
# 1. 安装 patch-package
npm install -D patch-package

# 2. 修改 node_modules/@cross/self-learn 中的代码

# 3. 生成补丁
npx patch-package @cross/self-learn

# 4. 在 package.json 中添加
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

### 2.4 Fork 仓库（深度定制）

如果需要大量修改：

```bash
# 1. Fork self-learn 仓库到你的 GitHub

# 2. 克隆你的 fork
git clone https://github.com/你的用户名/self-learn.git

# 3. 修改代码

# 4. 在你的项目中安装你的 fork
npm install github:你的用户名/self-learn#your-branch
```

## 方式 3：Monorepo 集成（高级）

如果你的项目也使用 monorepo，可以将 self-learn 作为子包：

### 3.1 添加为 Git Submodule

```bash
cd your-project
git submodule add https://github.com/原作者/self-learn.git packages/self-learn
```

### 3.2 配置 Workspace

```json
// your-project/package.json
{
  "workspaces": [
    "packages/*"
  ]
}
```

### 3.3 引用

```json
// your-project/packages/your-app/package.json
{
  "dependencies": {
    "@cross/self-learn": "workspace:*"
  }
}
```

## 常见集成场景

### 场景 1：嵌入到现有页面

```tsx
import { SelfStudyWorkbench } from '@cross/self-learn';

function MyPlatformPage() {
  return (
    <div className="my-platform-layout">
      <MyHeader />
      <div className="content-area">
        <MySidebar />
        <main>
          {/* 嵌入 self-learn */}
          <SelfStudyWorkbench
            spaceId="space-123"
            mode="student"
            onBack={() => router.push('/dashboard')}
          />
        </main>
      </div>
      <MyFooter />
    </div>
  );
}
```

### 场景 2：只使用部分功能

```tsx
import {
  ResourceLibraryModal,
  TaskInlineViewer,
  ChatPanel
} from '@cross/self-learn/components';

function MyCustomLearningPage() {
  const [showResources, setShowResources] = useState(false);

  return (
    <div>
      <button onClick={() => setShowResources(true)}>
        打开资源库
      </button>

      {showResources && (
        <ResourceLibraryModal
          onClose={() => setShowResources(false)}
          onSelect={(resource) => console.log(resource)}
        />
      )}

      <TaskInlineViewer taskId="task-123" />
      <ChatPanel messages={messages} />
    </div>
  );
}
```

### 场景 3：与现有数据系统集成

```tsx
import { SelfStudyWorkbench } from '@cross/self-learn';
import type { Resource, Task } from '@cross/self-learn';

function IntegratedLearningPage() {
  // 从你的 API 获取数据
  const { data: resources } = useQuery<Resource[]>('/api/my-resources');
  const { data: tasks } = useQuery<Task[]>('/api/my-tasks');

  return (
    <SelfStudyWorkbench
      spaceId="space-123"
      mode="student"
      // 传入你的数据
      initialResources={resources}
      initialTasks={tasks}
      // 处理数据变化
      onResourceUpdate={async (resource) => {
        await fetch('/api/my-resources', {
          method: 'PUT',
          body: JSON.stringify(resource)
        });
      }}
      onTaskUpdate={async (task) => {
        await fetch('/api/my-tasks', {
          method: 'PUT',
          body: JSON.stringify(task)
        });
      }}
    />
  );
}
```

## 版本管理

### 锁定版本（生产环境推荐）

```json
{
  "dependencies": {
    "@cross/self-learn": "1.0.0"  // 精确版本
  }
}
```

### 跟随更新（开发环境）

```json
{
  "dependencies": {
    "@cross/self-learn": "^1.0.0"  // 兼容版本
  }
}
```

### 使用特定分支

```json
{
  "dependencies": {
    "@cross/self-learn": "github:用户名/self-learn#dev"
  }
}
```

## 更新 self-learn

```bash
# 更新到最新版本
npm update @cross/self-learn

# 或指定版本
npm install @cross/self-learn@1.2.0

# 查看可用版本
npm view @cross/self-learn versions
```

## 故障排查

### 问题 1：类型定义找不到

```bash
# 确保安装了类型定义
npm install --save-dev @types/react @types/react-dom
```

### 问题 2：样式不生效

```tsx
// 确保导入了样式文件（如果有）
import '@cross/self-learn/dist/styles.css';
```

### 问题 3：依赖冲突

```bash
# 查看依赖树
npm ls @cross/self-learn

# 使用 overrides 解决冲突（npm 8.3+）
{
  "overrides": {
    "react": "19.2.3"
  }
}
```

## 最佳实践

1. **版本控制**：生产环境使用精确版本，避免意外更新
2. **按需导入**：只导入需要的组件，减小打包体积
3. **类型安全**：充分利用 TypeScript 类型定义
4. **样式隔离**：使用 CSS Modules 或 CSS-in-JS 避免样式冲突
5. **数据集成**：通过 props 传递数据，而不是修改 self-learn 内部逻辑
6. **错误处理**：使用 Error Boundary 包裹 self-learn 组件

## 示例项目结构

```
your-platform/
├── src/
│   ├── pages/
│   │   └── learning/
│   │       └── [spaceId].tsx          # 使用 self-learn 的页面
│   ├── components/
│   │   └── LearningWrapper.tsx        # 包装 self-learn 的组件
│   ├── styles/
│   │   └── self-learn-overrides.css   # 自定义样式
│   └── hooks/
│       └── useLearningData.ts         # 数据集成 hook
├── package.json
└── tsconfig.json
```

## 需要帮助？

- 查看 self-learn 的 README.md
- 查看示例代码：`packages/cross-new/src/app/learn/[id]/page.tsx`
- 提交 Issue：https://github.com/用户名/self-learn/issues
