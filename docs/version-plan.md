# 自学空间功能版本拆分计划

> 生成日期：2026-03-25
> 项目：self-learn（自学空间模块）
> 说明：V1 = 最小可用通路，V2 = 核心体验完善，V3 = 高级功能与数据分析，V4 = 全量功能

---

## 交付补充（给开发的实现说明）

### A. V1 核心通路（按用户操作顺序）

1. 教师端创建空间（创建方式弹窗）
   - 入口：任务中心页面点击“创建课程”
   - 状态：`空闲` → `弹窗打开` → `选择创建方式` → `进入工作台`
   - 关键约束：V1 的资源库仅显示“资源”Tab；AI 创建入口在 V1 隐藏

2. 教师端配置内容（工作台）
   - 左栏：上传/导入资源、手动添加任务、编辑任务
   - 中栏：基础 AI 对话（文本输入 + 快捷回复）
   - 右栏：笔记 + 学习状态 + Studio 工具（仅 V1 可用工具）
   - 状态：`编辑中` / `任务作答中` / `结果复查`

3. 教师端发布
   - 当前实际主路径：`NoteInfoModal -> PublishSuccessModal`
   - 发布成功后可复制链接/访问码并打开学生端

4. 学生端学习
   - 入口：分享链接进入空间
   - 路径：看资源（内联）→ 做题（全屏/嵌入/内联）→ 提交 → 结果复查 → 返回对话

### B. 关键组件状态（V1 必须关注）

1. LeftPanel（资源/任务）
   - 面板状态：`展开` / `折叠`
   - 区块状态：`资源区展开/折叠`、`任务区展开/折叠`
   - 任务学习状态：`locked | available | in_progress | grading | completed`

2. TaskEditModal（任务编辑）
   - 编辑状态：`题目列表编辑`、`题型切换`、`拖拽排序`
   - V1 限制：隐藏“AI 智能出题”折叠区

3. RightPanel（右栏）
   - Tab 状态：`workspace` / `status`
   - Studio 工具区：`展开` / `折叠`
   - V1 仅显示 `minVersion <= v1` 的工具卡（如思维导图、记忆卡片、知识测验、说明动画）

4. 发布链路
   - 当前生效路径：NoteInfo 弹窗内直接发布成功
   - `PublishModal` 组件当前代码存在但未接入触发入口（见“V1 对照核查”）

### C. 弹窗覆盖核查（当前代码）

已在文档覆盖的弹窗：
- CreationMethodModal
- FileUploadModal
- UnifiedResourceLibraryModal
- AIGenerateFormModal
- ExamDetectedModal
- LinkInputModal
- InteractiveViewerModal
- TaskEditModal
- SettingsModal / FreeModeConfigModal / GuidedModeConfigModal / MetaConfigModal
- NoteInfoModal / PublishSuccessModal

文档建议补充（代码中存在但表格未单列）：
- LeftPanel 内置“直接粘贴文本”弹窗（内联实现，非独立组件）

### D. V1 对照核查（2026-03-26）

已对齐（文档与实现一致）的关键点：
- V1 资源库只显示“资源”Tab
- V1 隐藏设置按钮/标题编辑/语言切换
- V1 隐藏 AI 生成表单与试卷检测弹窗
- V1 保留互动查看器

存在偏差（建议以代码实际为准）：
1. PublishModal 在文档中标记为可用，但当前未接线（无触发 setIsPublishModalOpen(true)）
2. 资源批量选择 / 任务批量选择在文档标 V3 才开启，但当前代码 V1 已可见
3. 下载二维码依赖 PublishModal；由于 PublishModal 未接线，V1 实际不可达

### E. 截图索引（可直接给开发看）

1. 创建方式弹窗（4种入口）

![创建方式弹窗](../image/seseyuan版本的修改/1773718891210.png)

2. 任务编辑弹窗（题目编辑、题型切换）

![任务编辑弹窗](../image/seseyuan版本的修改/1773720379443.png)

3. 手动输入题目弹窗（题干/答案/解析）

![手动输入题目弹窗](../image/seseyuan版本的修改/1773719136372.png)

4. 发布配置弹窗（课程信息、班级绑定、发布范围）

![发布配置弹窗](../image/seseyuan版本的修改/1773720096918.png)

---

## 一、页面级功能

| # | 功能描述 | 所在页面/模块 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|-------------|:---:|:---:|:---:|:---:|:---:|:---:|
| 1.1 | 空间管理器（列表页：展示所有学习空间卡片） | SpaceManager | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1.2 | 空间卡片：进度条、最后访问时间、学习模式标签 | SpaceManager | - | ✅ | - | ✅ | ✅ | ✅ |
| 1.3 | 空间卡片：右键菜单（编辑/删除） | SpaceManager | - | ✅ | - | ✅ | ✅ | ✅ |
| 1.4 | 空间管理器：统计面板（总空间数、平均进度、近7天活跃） | SpaceManager | - | ✅ | - | - | ✅ | ✅ |
| 1.5 | 删除空间确认对话框 | SpaceManager | - | ✅ | - | ✅ | ✅ | ✅ |
| 1.6 | 引导式创建流程（Onboarding） | Onboarding | - | ✅ | - | - | - | ✅ |
| 1.7 | Onboarding：场景选择（备考/论文/技能/兴趣） | Onboarding | - | ✅ | - | - | - | ✅ |
| 1.8 | Onboarding：学习模式选择（自主/AI引导/诊断） | Onboarding | - | ✅ | - | - | - | ✅ |
| 1.9 | Onboarding：模式预览（自由探索/引导学习预览卡片） | Onboarding | - | ✅ | - | - | - | ✅ |
| 1.10 | 工作台三栏布局（左-资源/中-对话/右-笔记） | SelfStudyWorkbench | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1.11 | 学习结果页（SpaceResults：班级数据、学生列表、能力分析） | SpaceResults | - | ✅ | - | - | ✅ | ✅ |
| 1.12 | 学生端入口页（通过 spaceId 路由进入） | [spaceId]/page | ✅ | - | ✅ | ✅ | ✅ | ✅ |
| 1.13 | 学生端结果页 | [spaceId]/results/page | ✅ | - | - | - | ✅ | ✅ |

---

## 二、创建空间流程（弹窗）

| # | 功能描述 | 所在弹窗/组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|-------------|:---:|:---:|:---:|:---:|:---:|:---:|
| 2.1 | 创建方式选择弹窗（AI创建/上传文件/资源库导入/空白） | CreationMethodModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2.2 | 文件上传弹窗（支持拖拽、多文件） | FileUploadModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2.3 | 统一资源库弹窗（V1仅资源Tab；V2起显示全部5个Tab） | UnifiedResourceLibraryModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2.4 | 资源库 - 资源Tab（搜索、筛选、批量选择导入） | UnifiedResourceLibraryModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2.5 | 资源库 - 错题本Tab（按题型/标签筛选、批量导入） | UnifiedResourceLibraryModal | - | ✅ | - | ✅ | ✅ | ✅ |
| 2.6 | 资源库 - 历史测验Tab（选择测验记录导入） | UnifiedResourceLibraryModal | - | ✅ | - | ✅ | ✅ | ✅ |
| 2.7 | 资源库 - 笔记Tab（选择笔记导入） | UnifiedResourceLibraryModal | - | ✅ | - | ✅ | ✅ | ✅ |
| 2.8 | 资源库 - 互动网页Tab（选择互动内容导入） | UnifiedResourceLibraryModal | - | ✅ | - | - | ✅ | ✅ |
| 2.9 | AI生成表单弹窗（输入主题、学习风格、水平） | AIGenerateFormModal | - | ✅ | - | ✅ | ✅ | ✅ |
| 2.10 | 试卷检测弹窗（检测到试卷文件时弹出，选择处理模式） | ExamDetectedModal | - | ✅ | - | ✅ | ✅ | ✅ |
| 2.11 | 试卷检测 - 批量模式选择（分开/同卷多人/合并） | ExamDetectedModal | - | ✅ | - | - | ✅ | ✅ |
| 2.12 | 试卷检测 - 高级选项（手写识别开关） | ExamDetectedModal | - | ✅ | - | - | ✅ | ✅ |

---

## 三、工作台顶部栏（Header）

| # | 功能描述 | 所在组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| 3.1 | 返回按钮 | WorkbenchHeader | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3.2 | 空间标题显示 | WorkbenchHeader | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3.3 | 空间标题内联编辑 | WorkbenchHeader | - | ✅ | - | ✅ | ✅ | ✅ |
| 3.4 | 设置按钮（打开 SettingsModal） | WorkbenchHeader | - | ✅ | - | ✅ | ✅ | ✅ |
| 3.5 | 发布按钮（打开 NoteInfoModal/PublishModal） | WorkbenchHeader | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3.6 | 查看数据分析按钮 | WorkbenchHeader | - | ✅ | - | - | ✅ | ✅ |
| 3.7 | 语言切换（简/繁） | LanguageSwitch | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| 3.8 | Demo 场景选择器 | WorkbenchHeader | - | ✅ | - | - | - | ✅ |

---

## 四、左栏 - 资源与任务管理

| # | 功能描述 | 所在组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| **资源区** |
| 4.1 | 资源列表展示（文档/PPT/视频/互动 图标区分） | LeftPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.2 | 资源折叠/展开面板 | LeftPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.3 | 点击资源 → 内联查看器（ResourceInlineViewer） | LeftPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.4 | 添加资源按钮（+号，弹出上传/链接/资源库选项） | LeftPanel | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.5 | 上传文件（工作台内） | FileUploadModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.6 | 添加链接弹窗（URL + 标题 + 资源类型选择） | LinkInputModal | - | ✅ | - | ✅ | ✅ | ✅ |
| 4.7 | 链接弹窗 - 互动内容分类选择（动画/可视化/模拟/测试） | LinkInputModal | - | ✅ | - | - | ✅ | ✅ |
| 4.8 | 从资源库导入（工作台内） | UnifiedResourceLibraryModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.9 | 资源可见性设置弹窗（始终可见/任务后可见/隐藏） | ResourceSettingsPopover | - | ✅ | - | ✅ | ✅ | ✅ |
| 4.10 | 资源批量选择（checkbox） | LeftPanel | - | ✅ | - | - | ✅ | ✅ |
| 4.11 | 资源全选/取消全选 | LeftPanel | - | ✅ | - | - | ✅ | ✅ |
| 4.12 | 互动内容全屏查看器（动画/可视化/模拟/测试） | InteractiveViewerModal | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| 4.13 | 互动查看器 → 缩小为内联 | InteractiveViewerModal | ✅ | ✅ | - | - | ✅ | ✅ |
| 4.14 | 学生端：添加自己的资源（source='student'标记） | LeftPanel | ✅ | - | - | ✅ | ✅ | ✅ |
| **任务区** |
| 4.20 | 任务列表展示（quiz/assignment/reflection 图标区分） | LeftPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.21 | 任务折叠/展开面板 | LeftPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.22 | 任务状态标记（locked/available/in_progress/grading/completed） | LeftPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.23 | 点击任务 → 展开做题卡片（TaskExpandedCard） | LeftPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.24 | AI 生成测试按钮 | LeftPanel | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.25 | 任务设置弹窗（显示答案/解析/允许重做/全屏/开卷） | TaskSettingsPopover | - | ✅ | - | ✅ | ✅ | ✅ |
| 4.26 | 任务编辑弹窗（编辑题目内容、选项、答案，V1不含AI智能出题） | TaskEditModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.27 | 任务批量选择（checkbox） | LeftPanel | - | ✅ | - | - | ✅ | ✅ |
| 4.28 | 任务全选/取消全选 | LeftPanel | - | ✅ | - | - | ✅ | ✅ |
| 4.29 | 重做任务按钮 | LeftPanel | ✅ | - | - | ✅ | ✅ | ✅ |
| 4.30 | 试卷转换进度条（detecting → extracting → converting → done） | LeftPanel | - | ✅ | - | ✅ | ✅ | ✅ |
| **左栏整体** |
| 4.40 | 左栏折叠/展开 | LeftPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4.41 | 左栏宽度拖拽调整（Resizer） | Resizer | ✅ | ✅ | - | ✅ | ✅ | ✅ |

---

## 五、中栏 - AI 对话

| # | 功能描述 | 所在组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| 5.1 | 对话消息列表（Markdown 渲染） | ChatPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5.2 | 文字输入框 + 发送按钮 | ChatPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5.3 | 语音输入按钮 | ChatPanel | ✅ | ✅ | - | - | ✅ | ✅ |
| 5.4 | 快捷回复按钮（suggestions.quickReplies） | ChatPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5.5 | 功能卡片按钮（suggestions.actionButtons → Studio工具） | ChatPanel | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| 5.6 | Demo 场景操作卡片（actionCards） | ChatPanel | - | ✅ | - | - | - | ✅ |
| 5.7 | 资源引用卡片（resourceRef：点击跳转资源） | ChatPanel | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| 5.8 | 知识检查点（checkpoint：内嵌选择题） | ChatPanel | ✅ | - | - | - | ✅ | ✅ |
| 5.9 | 主题过渡卡片（transition：从A到B的学习过渡） | ChatPanel | ✅ | - | - | - | ✅ | ✅ |
| 5.10 | 模式切换卡片（modeTransition：自主↔引导） | ChatPanel | ✅ | - | - | - | ✅ | ✅ |
| 5.11 | 嵌入式任务卡片（embeddedTask：在对话中做题） | ChatPanel | ✅ | - | - | ✅ | ✅ | ✅ |
| 5.12 | 消息复制按钮 | ChatPanel | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| 5.13 | 消息保存到笔记按钮 | ChatPanel | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| 5.14 | 自主模式快捷操作（搜索概念/总结要点/举例/生成测试） | ChatPanel | ✅ | - | ✅ | ✅ | ✅ | ✅ |
| 5.15 | 引导模式快捷操作（考考我/下一知识点/查看路径/给提示） | ChatPanel | ✅ | - | - | - | ✅ | ✅ |
| 5.16 | 学习反思提醒（定时弹出反思卡片） | ChatPanel | ✅ | - | - | - | ✅ | ✅ |

---

## 六、做题系统

| # | 功能描述 | 所在组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| 6.1 | 全屏做题卡片（TaskExpandedCard fullscreen模式） | TaskExpandedCard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.2 | 嵌入式做题卡片（TaskExpandedCard embedded模式） | TaskExpandedCard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.3 | 内联做题查看器（左栏内小窗做题） | TaskInlineViewer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.4 | 单选题组件 | SingleChoiceQuestion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.5 | 多选题组件 | MultipleChoiceQuestion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.6 | 填空题组件 | FillInBlankQuestion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.7 | 判断题组件 | TrueFalseQuestion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.8 | 简答题组件 | ShortAnswerQuestion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.9 | 提交工具栏（文字/文件/照片/语音 4种提交方式） | SubmissionToolbar | ✅ | - | - | - | ✅ | ✅ |
| 6.10 | 题目导航（上一题/下一题/题号跳转） | TaskExpandedCard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.11 | 提交答案 + 即时判分 | TaskExpandedCard | ✅ | - | ✅ | ✅ | ✅ | ✅ |
| 6.12 | AI 批改主观题（grading状态 + 评分 + 评语） | TaskExpandedCard | ✅ | - | - | ✅ | ✅ | ✅ |
| 6.13 | 结果复查页（逐题查看对错、解析） | TaskResultReview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.14 | 结果复查 - 总分统计页 | TaskResultReview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6.15 | 结果复查 - 重做错题按钮 | TaskResultReview | ✅ | - | - | ✅ | ✅ | ✅ |
| 6.16 | 结果复查 - 重做全部按钮 | TaskResultReview | ✅ | - | - | ✅ | ✅ | ✅ |
| 6.17 | 结果复查 - 生成变种练习按钮 | TaskResultReview | ✅ | - | - | - | ✅ | ✅ |
| 6.18 | 结果复查 - 返回对话按钮 | TaskResultReview | ✅ | - | ✅ | ✅ | ✅ | ✅ |
| 6.19 | 结果复查 - 请AI讲解按钮（跳转错题对话） | TaskResultReview | ✅ | - | - | ✅ | ✅ | ✅ |
| 6.20 | 结果复查 - 缩小为内联按钮 | TaskResultReview | ✅ | - | - | ✅ | ✅ | ✅ |
| 6.21 | 错题AI对话（ErrorQuestionChat：针对错题的AI讲解） | ErrorQuestionChat | ✅ | - | - | ✅ | ✅ | ✅ |
| 6.22 | 富文本内容渲染（Markdown + 图片 + 视频） | RichContent | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 七、右栏 - 笔记与学习状态

| # | 功能描述 | 所在组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| **笔记面板（workspace tab）** |
| 7.1 | 笔记列表（多笔记切换） | EnhancedNotesPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.2 | 新建笔记按钮 | EnhancedNotesPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.3 | 笔记编辑（Markdown 编辑器） | EnhancedNotesPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.4 | 笔记预览模式（Markdown 渲染） | EnhancedNotesPanel | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| 7.5 | AI 生成笔记按钮 | EnhancedNotesPanel | ✅ | - | - | - | ✅ | ✅ |
| 7.6 | 笔记添加图片 | EnhancedNotesPanel | ✅ | ✅ | - | - | ✅ | ✅ |
| 7.7 | 笔记语音录制 | EnhancedNotesPanel | ✅ | ✅ | - | - | ✅ | ✅ |
| 7.8 | 笔记删除 | EnhancedNotesPanel | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| 7.9 | 笔记添加到资源（转为学习资源） | EnhancedNotesPanel | ✅ | - | - | - | ✅ | ✅ |
| **学习状态面板（status tab）** |
| 7.10 | 学习时长计时器 | LearningStatusPanel | ✅ | - | ✅ | ✅ | ✅ | ✅ |
| 7.11 | 学习路径进度（已掌握/学习中/待学习节点） | LearningStatusPanel | ✅ | - | - | - | ✅ | ✅ |
| 7.12 | 学习日志时间线（资源完成/任务完成/AI观察等事件） | LearningStatusPanel | ✅ | - | - | - | ✅ | ✅ |
| **Studio 工具面板** |
| 7.20 | Studio 工具网格（资源生成类：音频概述/思维导图/记忆卡片/时间线/学习报告/搜索概念/总结要点/举例说明） | RightPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.21 | Studio 工具网格（任务生成类：知识测验/练习题/生成变种题） | RightPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.22 | Studio 工具网格（互动内容类：说明动画/可视化/互动模拟/互动测试，V1仅含说明动画） | RightPanel | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| 7.23 | Studio 工具配置弹窗（自定义工具参数） | SelfStudyWorkbench | - | ✅ | - | - | ✅ | ✅ |
| **右栏整体** |
| 7.30 | 右栏 Tab 切换（V1仅显示笔记Tab；V2起显示笔记+学习状态） | RightPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.31 | 右栏折叠/展开 | RightPanel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 7.32 | 右栏宽度拖拽调整（Resizer） | Resizer | ✅ | ✅ | - | ✅ | ✅ | ✅ |

---

## 八、配置弹窗（教师端）

| # | 功能描述 | 所在弹窗/组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|-------------|:---:|:---:|:---:|:---:|:---:|:---:|
| 8.1 | 自学空间设置弹窗（总入口） | SettingsModal | - | ✅ | - | ✅ | ✅ | ✅ |
| 8.2 | 设置 - AI 助手模式选择（个性化Agent / 统一配置） | SettingsModal | - | ✅ | - | - | ✅ | ✅ |
| 8.3 | 设置 - 笔记模板选择（空白/康奈尔/天雨伞） | SettingsModal | - | ✅ | - | - | ✅ | ✅ |
| 8.4 | 设置 - 学习监督Agent选择 + 自定义提示词 | SettingsModal | - | ✅ | - | - | ✅ | ✅ |
| 8.5 | 自由对话模式配置弹窗（选AI助手 + 追加教学指令 + 围栏开关） | FreeModeConfigModal | - | ✅ | - | ✅ | ✅ | ✅ |
| 8.6 | 引导学习模式配置弹窗（选教学法流程 + 各阶段提示词微调） | GuidedModeConfigModal | - | ✅ | - | - | ✅ | ✅ |
| 8.7 | 学情监控配置弹窗（选监控策略 + 自定义监控指令） | MetaConfigModal | - | ✅ | - | - | ✅ | ✅ |

---

## 九、发布流程

| # | 功能描述 | 所在弹窗/组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|-------------|:---:|:---:|:---:|:---:|:---:|:---:|
| 9.1 | 课程信息弹窗（NoteInfoModal：课程名/年级/学科/班级/章节） | note-config/modals | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 9.2 | 课程信息 - 匿名模式 + 访问码 | note-config/modals | - | ✅ | - | ✅ | ✅ | ✅ |
| 9.3 | 课程信息 - 绑定班级（多选） | note-config/modals | - | ✅ | - | ✅ | ✅ | ✅ |
| 9.4 | 发布弹窗（PublishModal：发布范围选择） | PublishModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 9.5 | 发布范围 - 包含资源/任务/AI设置/学习路径 开关 | PublishModal | - | ✅ | - | ✅ | ✅ | ✅ |
| 9.6 | 发布成功弹窗（链接 + 二维码 + 访问码） | PublishSuccessModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 9.7 | 复制链接按钮 | PublishSuccessModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 9.8 | 复制访问码按钮 | PublishSuccessModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 9.9 | 打开学生端预览按钮 | PublishSuccessModal | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| 9.10 | 下载二维码按钮 | PublishSuccessModal | - | ✅ | - | ✅ | ✅ | ✅ |

---

## 十、数据分析与结果（教师端）

| # | 功能描述 | 所在组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| 10.1 | 班级概览（完成率/平均分/参与人数） | SpaceResults | - | ✅ | - | - | ✅ | ✅ |
| 10.2 | 学生列表（状态筛选：未开始/进行中/已完成/需关注） | SpaceResults | - | ✅ | - | - | ✅ | ✅ |
| 10.3 | 学生详情（资源查看记录 + 任务提交详情 + 能力画像） | SpaceResults | - | ✅ | - | - | ✅ | ✅ |
| 10.4 | 能力维度分析（批判性思维/信息整合/元认知等雷达图） | SpaceResults | - | ✅ | - | - | - | ✅ |
| 10.5 | 班级能力分布图 | SpaceResults | - | ✅ | - | - | - | ✅ |
| 10.6 | 任务完成率柱状图 | SpaceResults | - | ✅ | - | - | ✅ | ✅ |
| 10.7 | 资源使用热力图 | SpaceResults | - | ✅ | - | - | - | ✅ |
| 10.8 | 学习时长趋势图 | SpaceResults | - | ✅ | - | - | - | ✅ |

---

## 十一、其他功能

| # | 功能描述 | 所在组件 | 学生端 | 教师端 | V1 | V2 | V3 | V4 |
|---|---------|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| 11.1 | 国际化支持（简体/繁体切换） | LanguageContext | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| 11.2 | 状态持久化（localStorage） | usePersistedState | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 11.3 | AI 生成加载动画（骨架屏） | SelfStudyWorkbench | ✅ | ✅ | - | ✅ | ✅ | ✅ |
| 11.4 | 学习模式切换（自主↔引导，运行时切换） | SelfStudyWorkbench | ✅ | - | - | - | ✅ | ✅ |
| 11.5 | 能力追踪维度配置 | SpaceConfig | - | ✅ | - | - | - | ✅ |
| 11.6 | 用户画像配置（学习目标/水平/AI风格/知识边界） | SpaceConfig | - | ✅ | - | - | ✅ | ✅ |
| 11.7 | 学习路径（AI引导模式下的节点式学习路径） | SpaceConfig | ✅ | ✅ | - | - | ✅ | ✅ |
| 11.8 | Demo 场景系统（预设演示剧本） | demoScenarios | - | ✅ | - | - | - | ✅ |

---

## 版本总结

### V1 — 最小可用通路（MVP）

**目标**：教师能创建空间 → 上传/导入资源 → 添加任务 → 发布 → 学生能进入 → 看资源 → 做题 → AI对话自学

**教师端核心通路**：
- 空间管理器（列表页）→ 创建方式选择 → 上传文件 / 资源库导入（仅资源Tab）
- 工作台三栏布局（资源列表 + AI对话 + 笔记）
- 资源管理（查看、添加、上传）
- 任务管理（AI生成测试 + 手动编辑题目）← 修正：V1必须有添加任务的能力
- 发布流程（课程信息 → 发布 → 分享链接/访问码）

**学生端核心通路**：
- 通过链接进入学习空间
- 查看资源（内联查看器）
- 做任务（全屏做题 → 提交 → 查看结果 → 返回对话）
- AI 对话（基础问答 + 快捷回复）
- 记笔记（基础编辑）

**V1 精简策略**：
- 资源库弹窗：仅显示"资源"Tab，隐藏错题/历史测验/笔记/互动网页 Tab
- 右栏：显示笔记面板 + 学习状态Tab（含学习时长计时器）+ Studio工具（思维导图/记忆卡片/知识测验/说明动画）
- AI配置：使用默认配置，不开放教师自定义（SettingsModal = V2）
- 做题：支持全屏/嵌入式/内联三种模式
- 任务编辑：支持手动编辑题目，但隐藏AI智能出题功能（V2+）
- 互动内容：支持查看器，但互动模拟工具移至V2

**预估功能项**：~42 项

### V2 — 核心体验完善

**新增**：AI生成、试卷识别、任务设置、错题讲解、资源可见性、Studio工具、链接导入、语言切换、拖拽调整等

**预估新增功能项**：~35 项

### V3 — 高级功能与数据分析

**新增**：学习路径、知识检查点、学情监控、数据分析页、互动内容、能力追踪、批量操作等

**预估新增功能项**：~30 项

### V4 — 全量功能

**新增**：Onboarding引导流程、Demo场景系统、能力分布图、资源热力图、高级配置等

**预估新增功能项**：~15 项
