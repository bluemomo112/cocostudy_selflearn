// Main components
export { default as SelfStudyWorkbench } from './components/SelfStudyWorkbench';
export { default as SpaceManager } from './components/SpaceManager';
export { default as SpaceResults } from './components/SpaceResults';
export { default as Onboarding } from './components/Onboarding';
export { default as LanguageSwitch } from './components/LanguageSwitch';

// Modal components
export { default as CreationMethodModal } from './components/CreationMethodModal';
export { default as FileUploadModal } from './components/FileUploadModal';
export { default as UnifiedResourceLibraryModal } from './components/UnifiedResourceLibraryModal';
export { default as AIGenerateFormModal } from './components/AIGenerateFormModal';
export { default as ExamDetectedModal } from './components/ExamDetectedModal';
export { default as FreeModeConfigModal } from './components/FreeModeConfigModal';
export { default as GuidedModeConfigModal } from './components/GuidedModeConfigModal';
export { default as InteractiveViewerModal } from './components/InteractiveViewerModal';
export { default as KnowledgeBaseModal } from './components/KnowledgeBaseModal';
export { default as LinkInputModal } from './components/LinkInputModal';
export { default as MetaConfigModal } from './components/MetaConfigModal';
export { default as PublishModal } from './components/PublishModal';
export { default as ResourceInlineViewer } from './components/ResourceInlineViewer';
export { default as ResourceLibraryModal } from './components/ResourceLibraryModal';
export { default as ResourceSettingsPopover } from './components/ResourceSettingsPopover';
export { default as SettingsModal } from './components/SettingsModal';
export { default as TaskSettingsPopover } from './components/TaskSettingsPopover';

// Types
export * from './types/self-study';
export * from './types/shared-context';

// Data
export * from './data/mockLearningData';
export * from './data/mockKnowledgeBase';
export * from './data/demoScenarios';

// Contexts
export { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Utils
export * from './utils/storage';
