// Mock 数据 - 用于配置面板（支持国际化）

// 获取 Agent 列表
export const getMockAgents = (t: (text: string) => string) => [
  {
    id: 'agent_general',
    name: t('通用助手'),
    description: t('適合各類學科的全能助手'),
  },
  {
    id: 'agent_science',
    name: t('理科專家'),
    description: t('擅長數學、物理、化學等理科科目'),
  },
  {
    id: 'agent_humanities',
    name: t('文科導師'),
    description: t('擅長語文、歷史、文學等文科科目'),
  },
  {
    id: 'agent_language',
    name: t('語言教練'),
    description: t('專注於外語學習和語言能力提升'),
  },
];

// 获取 Workflow 列表
export const getMockWorkflows = (t: (text: string) => string) => [
  {
    id: 'workflow_5e',
    name: t('5E 教學法'),
    description: t('參與-探索-解釋-精緻-評價'),
    stages: [
      {
        id: 'engage',
        name: t('參與 Engage'),
        defaultPrompt: t('通過提問或展示現象，激發學生的好奇心和學習興趣'),
      },
      {
        id: 'explore',
        name: t('探索 Explore'),
        defaultPrompt: t('引導學生主動探索，通過實踐和觀察發現規律'),
      },
      {
        id: 'explain',
        name: t('解釋 Explain'),
        defaultPrompt: t('幫助學生理解概念，建立知識框架'),
      },
      {
        id: 'elaborate',
        name: t('精緻 Elaborate'),
        defaultPrompt: t('引導學生深化理解，應用到新情境'),
      },
      {
        id: 'evaluate',
        name: t('評價 Evaluate'),
        defaultPrompt: t('評估學習成果，反思學習過程'),
      },
    ],
  },
  {
    id: 'workflow_pbl',
    name: t('PBL 問題式學習'),
    description: t('問題導向的探究式學習'),
    stages: [
      {
        id: 'problem',
        name: t('提出問題'),
        defaultPrompt: t('呈現真實問題，激發學生思考'),
      },
      {
        id: 'research',
        name: t('研究探索'),
        defaultPrompt: t('引導學生收集資訊，分析問題'),
      },
      {
        id: 'solution',
        name: t('提出方案'),
        defaultPrompt: t('幫助學生設計解決方案'),
      },
      {
        id: 'present',
        name: t('展示交流'),
        defaultPrompt: t('引導學生展示成果，互相學習'),
      },
    ],
  },
  {
    id: 'workflow_feynman',
    name: t('費曼學習法'),
    description: t('通過教學來深化理解'),
    stages: [
      {
        id: 'learn',
        name: t('學習概念'),
        defaultPrompt: t('引導學生理解核心概念'),
      },
      {
        id: 'teach',
        name: t('簡單講解'),
        defaultPrompt: t('讓學生用簡單語言解釋概念'),
      },
      {
        id: 'identify',
        name: t('發現盲點'),
        defaultPrompt: t('幫助學生識別理解不足之處'),
      },
      {
        id: 'simplify',
        name: t('簡化精煉'),
        defaultPrompt: t('引導學生用類比和例子深化理解'),
      },
    ],
  },
];

// 获取监控策略列表
export const getMockStrategies = (t: (text: string) => string) => [
  {
    id: 'strategy_light',
    name: t('輕度監控'),
    description: t('僅在明顯偏離學習目標時提醒'),
  },
  {
    id: 'strategy_standard',
    name: t('標準監控'),
    description: t('定期檢查學習狀態，適時提供反饋'),
  },
  {
    id: 'strategy_deep',
    name: t('深度監控'),
    description: t('即時追蹤學習過程，主動干預和引導'),
  },
];

// 获取笔记模板列表
export const getNoteTemplates = (t: (text: string) => string) => [
  {
    id: 'blank',
    name: t('空白筆記'),
    description: t('無預製提示，自由記錄'),
    defaultContent: '',
  },
  {
    id: 'cornell',
    name: t('康奈爾筆記'),
    description: t('引導學生記錄關鍵概念、問題和總結'),
    defaultContent: '## 筆記區\n\n\n## 線索區\n\n\n## 總結區\n',
  },
  {
    id: 'sky_rain_umbrella',
    name: t('空雨傘'),
    description: t('引導學生思考現象（空）、原因（雨）和對策（傘）'),
    defaultContent: '## 空（現象）\n\n\n## 雨（原因）\n\n\n## 傘（對策）\n',
  },
];
