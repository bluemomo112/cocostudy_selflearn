/**
 * 版本功能开关配置
 * V1 = 最小可用通路（MVP）
 * 修改 CURRENT_VERSION 即可切换版本
 */

export type Version = 'v1' | 'v2' | 'v3' | 'v4';

export const CURRENT_VERSION: Version = 'v1';

type FeatureFlags = {
  // 页面级
  onboarding: boolean;           // 1.6-1.9 Onboarding 引导流程
  spaceResults: boolean;         // 1.11 教师端数据分析页
  spaceCardDetails: boolean;     // 1.2-1.5 空间卡片进度/右键菜单/统计面板
  studentResultsPage: boolean;   // 1.13 学生端结果页

  // 创建流程
  aiGenerateModal: boolean;      // 2.9 AI 生成表单弹窗
  examDetectedModal: boolean;    // 2.10-2.12 试卷检测弹窗
  resourceLibraryExtraTabs: boolean; // 2.5-2.8 资源库额外 Tab（错题/历史/笔记/互动）

  // Header
  titleInlineEdit: boolean;      // 3.3 标题内联编辑
  settingsButton: boolean;       // 3.4 设置按钮
  dataAnalysisButton: boolean;   // 3.6 数据分析按钮
  languageSwitch: boolean;       // 3.7 语言切换
  demoSelector: boolean;         // 3.8 Demo 场景选择器

  // 左栏 - 资源
  linkInputModal: boolean;       // 4.6-4.7 添加链接弹窗
  resourceVisibilitySettings: boolean; // 4.9 资源可见性设置
  resourceBatchSelect: boolean;  // 4.10-4.11 资源批量选择
  interactiveViewer: boolean;    // 4.12-4.13 互动内容查看器
  studentAddResource: boolean;   // 4.14 学生端添加资源

  // 左栏 - 任务
  taskSettings: boolean;         // 4.25 任务设置弹窗
  taskBatchSelect: boolean;      // 4.27-4.28 任务批量选择
  taskRedo: boolean;             // 4.29 重做任务按钮
  examProcessingProgress: boolean; // 4.30 试卷转换进度条

  // 布局
  panelResizer: boolean;         // 4.41/7.32 左右栏宽度拖拽

  // 对话
  voiceInput: boolean;           // 5.3 语音输入
  actionButtons: boolean;        // 5.5 功能卡片按钮（Studio 工具）
  demoActionCards: boolean;      // 5.6 Demo 场景操作卡片
  resourceRefCards: boolean;     // 5.7 资源引用卡片
  knowledgeCheckpoint: boolean;  // 5.8 知识检查点
  topicTransition: boolean;      // 5.9 主题过渡卡片
  modeSwitchCard: boolean;       // 5.10 模式切换卡片
  embeddedTask: boolean;         // 5.11 嵌入式任务卡片
  messageCopy: boolean;          // 5.12 消息复制
  saveToNotes: boolean;          // 5.13 保存到笔记
  guidedModeShortcuts: boolean;  // 5.15 引导模式快捷操作
  reflectionReminder: boolean;   // 5.16 学习反思提醒

  // 做题系统
  embeddedTaskCard: boolean;     // 6.2 嵌入式做题卡片
  inlineTaskViewer: boolean;     // 6.3 内联做题查看器
  submissionToolbar: boolean;    // 6.9 提交工具栏（文字/文件/照片/语音）
  aiGrading: boolean;            // 6.12 AI 批改主观题
  redoWrongQuestions: boolean;   // 6.15 重做错题
  redoAllQuestions: boolean;     // 6.16 重做全部
  generateVariants: boolean;     // 6.17 生成变种练习
  aiExplainButton: boolean;      // 6.19 请 AI 讲解
  minimizeToInline: boolean;     // 6.20 缩小为内联
  errorQuestionChat: boolean;    // 6.21 错题 AI 对话

  // 笔记
  notesPreviewMode: boolean;     // 7.4 笔记预览模式
  aiGenerateNotes: boolean;      // 7.5 AI 生成笔记
  notesAddImage: boolean;        // 7.6 笔记添加图片
  notesVoiceRecording: boolean;  // 7.7 笔记语音录制
  notesDelete: boolean;          // 7.8 笔记删除
  notesAddToResource: boolean;   // 7.9 笔记添加到资源

  // 右栏
  learningStatusPanel: boolean;  // 7.10-7.12 学习状态面板
  studioTools: boolean;          // 7.20-7.23 Studio 工具

  // 配置弹窗
  settingsModal: boolean;        // 8.1-8.7 设置弹窗

  // 发布流程
  anonymousMode: boolean;        // 9.2 匿名模式 + 访问码
  classBinding: boolean;         // 9.3 绑定班级
  publishScopeOptions: boolean;  // 9.5 发布范围开关
  downloadQR: boolean;           // 9.10 下载二维码

  // 其他
  aiLoadingSkeleton: boolean;    // 11.3 AI 生成加载动画
  learningModeSwitch: boolean;   // 11.4 学习模式切换
  demoSystem: boolean;           // 11.8 Demo 场景系统
};

const VERSION_FLAGS: Record<Version, FeatureFlags> = {
  v1: {
    onboarding: false,
    spaceResults: false,
    spaceCardDetails: false,
    studentResultsPage: false,

    aiGenerateModal: false,
    examDetectedModal: false,
    resourceLibraryExtraTabs: false,

    titleInlineEdit: false,
    settingsButton: true,
    dataAnalysisButton: false,
    languageSwitch: true,
    demoSelector: false,

    linkInputModal: false,
    resourceVisibilitySettings: false,
    resourceBatchSelect: false,
    interactiveViewer: true,
    studentAddResource: false,

    taskSettings: false,
    taskBatchSelect: false,
    taskRedo: false,
    examProcessingProgress: false,

    panelResizer: false,

    voiceInput: true,
    actionButtons: false,
    demoActionCards: false,
    resourceRefCards: false,
    knowledgeCheckpoint: false,
    topicTransition: false,
    modeSwitchCard: false,
    embeddedTask: false,
    messageCopy: false,
    saveToNotes: false,
    guidedModeShortcuts: false,
    reflectionReminder: false,

    embeddedTaskCard: true,
    inlineTaskViewer: true,
    submissionToolbar: false,
    aiGrading: false,
    redoWrongQuestions: false,
    redoAllQuestions: false,
    generateVariants: false,
    aiExplainButton: false,
    minimizeToInline: false,
    errorQuestionChat: false,

    notesPreviewMode: false,
    aiGenerateNotes: false,
    notesAddImage: false,
    notesVoiceRecording: false,
    notesDelete: false,
    notesAddToResource: false,

    learningStatusPanel: true,
    studioTools: true,

    settingsModal: true,

    anonymousMode: false,
    classBinding: true,
    publishScopeOptions: true,
    downloadQR: false,

    aiLoadingSkeleton: false,
    learningModeSwitch: false,
    demoSystem: false,
  },
  v2: {
    onboarding: false,
    spaceResults: false,
    spaceCardDetails: true,
    studentResultsPage: false,

    aiGenerateModal: true,
    examDetectedModal: true,
    resourceLibraryExtraTabs: true,

    titleInlineEdit: true,
    settingsButton: true,
    dataAnalysisButton: false,
    languageSwitch: true,
    demoSelector: false,

    linkInputModal: true,
    resourceVisibilitySettings: true,
    resourceBatchSelect: false,
    interactiveViewer: false,
    studentAddResource: true,

    taskSettings: true,
    taskBatchSelect: false,
    taskRedo: true,
    examProcessingProgress: true,

    panelResizer: true,

    voiceInput: false,
    actionButtons: true,
    demoActionCards: false,
    resourceRefCards: true,
    knowledgeCheckpoint: false,
    topicTransition: false,
    modeSwitchCard: false,
    embeddedTask: true,
    messageCopy: true,
    saveToNotes: true,
    guidedModeShortcuts: false,
    reflectionReminder: false,

    embeddedTaskCard: true,
    inlineTaskViewer: true,
    submissionToolbar: false,
    aiGrading: true,
    redoWrongQuestions: true,
    redoAllQuestions: true,
    generateVariants: false,
    aiExplainButton: true,
    minimizeToInline: true,
    errorQuestionChat: true,

    notesPreviewMode: true,
    aiGenerateNotes: false,
    notesAddImage: false,
    notesVoiceRecording: false,
    notesDelete: true,
    notesAddToResource: false,

    learningStatusPanel: true,
    studioTools: true,

    settingsModal: true,

    anonymousMode: true,
    classBinding: true,
    publishScopeOptions: true,
    downloadQR: true,

    aiLoadingSkeleton: true,
    learningModeSwitch: false,
    demoSystem: false,
  },
  v3: {
    onboarding: false,
    spaceResults: true,
    spaceCardDetails: true,
    studentResultsPage: true,

    aiGenerateModal: true,
    examDetectedModal: true,
    resourceLibraryExtraTabs: true,

    titleInlineEdit: true,
    settingsButton: true,
    dataAnalysisButton: true,
    languageSwitch: true,
    demoSelector: false,

    linkInputModal: true,
    resourceVisibilitySettings: true,
    resourceBatchSelect: true,
    interactiveViewer: true,
    studentAddResource: true,

    taskSettings: true,
    taskBatchSelect: true,
    taskRedo: true,
    examProcessingProgress: true,

    panelResizer: true,

    voiceInput: true,
    actionButtons: true,
    demoActionCards: false,
    resourceRefCards: true,
    knowledgeCheckpoint: true,
    topicTransition: true,
    modeSwitchCard: true,
    embeddedTask: true,
    messageCopy: true,
    saveToNotes: true,
    guidedModeShortcuts: true,
    reflectionReminder: true,

    embeddedTaskCard: true,
    inlineTaskViewer: true,
    submissionToolbar: true,
    aiGrading: true,
    redoWrongQuestions: true,
    redoAllQuestions: true,
    generateVariants: true,
    aiExplainButton: true,
    minimizeToInline: true,
    errorQuestionChat: true,

    notesPreviewMode: true,
    aiGenerateNotes: true,
    notesAddImage: true,
    notesVoiceRecording: true,
    notesDelete: true,
    notesAddToResource: true,

    learningStatusPanel: true,
    studioTools: true,

    settingsModal: true,

    anonymousMode: true,
    classBinding: true,
    publishScopeOptions: true,
    downloadQR: true,

    aiLoadingSkeleton: true,
    learningModeSwitch: true,
    demoSystem: false,
  },
  v4: {
    onboarding: true,
    spaceResults: true,
    spaceCardDetails: true,
    studentResultsPage: true,

    aiGenerateModal: true,
    examDetectedModal: true,
    resourceLibraryExtraTabs: true,

    titleInlineEdit: true,
    settingsButton: true,
    dataAnalysisButton: true,
    languageSwitch: true,
    demoSelector: true,

    linkInputModal: true,
    resourceVisibilitySettings: true,
    resourceBatchSelect: true,
    interactiveViewer: true,
    studentAddResource: true,

    taskSettings: true,
    taskBatchSelect: true,
    taskRedo: true,
    examProcessingProgress: true,

    panelResizer: true,

    voiceInput: true,
    actionButtons: true,
    demoActionCards: true,
    resourceRefCards: true,
    knowledgeCheckpoint: true,
    topicTransition: true,
    modeSwitchCard: true,
    embeddedTask: true,
    messageCopy: true,
    saveToNotes: true,
    guidedModeShortcuts: true,
    reflectionReminder: true,

    embeddedTaskCard: true,
    inlineTaskViewer: true,
    submissionToolbar: true,
    aiGrading: true,
    redoWrongQuestions: true,
    redoAllQuestions: true,
    generateVariants: true,
    aiExplainButton: true,
    minimizeToInline: true,
    errorQuestionChat: true,

    notesPreviewMode: true,
    aiGenerateNotes: true,
    notesAddImage: true,
    notesVoiceRecording: true,
    notesDelete: true,
    notesAddToResource: true,

    learningStatusPanel: true,
    studioTools: true,

    settingsModal: true,

    anonymousMode: true,
    classBinding: true,
    publishScopeOptions: true,
    downloadQR: true,

    aiLoadingSkeleton: true,
    learningModeSwitch: true,
    demoSystem: true,
  },
};

export const features = VERSION_FLAGS[CURRENT_VERSION];

/** 检查某个功能是否在当前版本启用 */
export function isEnabled(flag: keyof FeatureFlags): boolean {
  return VERSION_FLAGS[CURRENT_VERSION][flag];
}
