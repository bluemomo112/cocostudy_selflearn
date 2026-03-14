// Main components
export { default as SelfStudyWorkbench } from './components/SelfStudyWorkbench';
export { default as SpaceManager } from './components/SpaceManager';
export { default as SpaceResults } from './components/SpaceResults';

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
