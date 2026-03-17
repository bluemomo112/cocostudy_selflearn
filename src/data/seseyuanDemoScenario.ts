/**
 * seseyuan 演示劇本數據
 * 場景：學生王芳完成「流體壓強與流速關係 專項測驗」後進入學習空間
 * 在 AI 蘇格拉底式引導下學習
 */

// ============ 1. 學生檔案 ============

export const demoStudentProfile = {
  id: 's3',
  name: '王芳',
  grade: '中二',
  className: '中二(1)班',
  preScore: 38,
  postScore: 85,
};

// ============ 2. 測驗結果 ============

export const demoTestResult = {
  taskId: 'physics-fluid-pressure-001',
  testName: '流體壓強與流速關係 專項測驗',
  score: 60,
  totalQuestions: 15,
  correctCount: 9,
  wrongCount: 6,
  completedAt: new Date('2024-01-20T10:30:00'),
};

// ============ 3. 錯題數據 ============

export const demoWrongQuestions = [
  {
    id: 'wq0-1',
    questionText: '龍捲風經過時，能把地面上的物體「吸」到空中，這是因為：',
    type: 'single' as const,
    options: [
      { label: 'A', text: '龍捲風內部氣流速度極大，氣壓遠低於外部，內外壓強差將物體推入氣流中' },
      { label: 'B', text: '龍捲風產生的強大吸力直接將物體吸起' },
      { label: 'C', text: '龍捲風的旋轉產生離心力將物體甩起' },
      { label: 'D', text: '龍捲風內部溫度極高，熱空氣上升帶動物體' },
    ],
    correctAnswer: 'A',
    studentAnswer: 'B',
    knowledgePoints: ['流體壓強與流速的關係', '伯努利原理'],
    aiErrorAnalysis: {
      summary: '學生使用了日常語言「吸」來解釋物理現象，未能區分「吸力」與「壓強差」的本質區別。',
      errorTypes: [
        { type: '概念理解錯誤', percentage: 53 },
        { type: '因果關係混淆', percentage: 33 },
        { type: '忽略流速影響', percentage: 14 },
      ],
      rootCauses: ['將日常用語「吸」等同於物理概念', '未建立「流速→壓強→力」的因果鏈'],
    },
    aiTeachingSuggestion: {
      summary: '通過實驗和生活實例建立正確的壓強差概念',
      strategies: ['實驗演示：用吹風機和乒乓球演示伯努利效應', '生活實例：地鐵安全線、飛機機翼', '概念辨析：「吸」vs「壓強差推動」', '圖示分析：流速-壓強關係圖'],
      resources: ['bernoulli-video-01', 'fluid-pressure-doc-01'],
    },
  },
  {
    id: 'wq0-2',
    questionText: '如圖所示，在兩支相同的試管中裝入等量的水，其中一支用濕布包裹。用電風扇對兩支試管吹風，一段時間後，兩管液面的高度關係是：',
    type: 'single' as const,
    options: [
      { label: 'A', text: '兩管液面一樣高' },
      { label: 'B', text: '濕布包裹的試管液面較高' },
      { label: 'C', text: '無法判斷' },
      { label: 'D', text: '濕布包裹的試管液面較低' },
    ],
    correctAnswer: 'D',
    studentAnswer: 'B',
    knowledgePoints: ['流體壓強與流速的關係', '蒸發吸熱'],
    aiErrorAnalysis: {
      summary: '學生混淆了蒸發吸熱導致的液面變化方向。',
      errorTypes: [{ type: '概念理解錯誤', percentage: 60 }, { type: '因果關係混淆', percentage: 40 }],
      rootCauses: ['未理解蒸發吸熱會加速液體減少'],
    },
    aiTeachingSuggestion: {
      summary: '結合蒸發吸熱與流體壓強兩個知識點進行綜合分析',
      strategies: ['實驗演示', '生活實例', '概念辨析', '圖示分析'],
      resources: ['fluid-pressure-doc-01'],
    },
  },
  {
    id: 'wq0-3',
    questionText: '以下哪些現象可以用伯努利原理解釋？',
    type: 'multiple' as const,
    options: [
      { label: 'A', text: '火車站台設置安全線' },
      { label: 'B', text: '飛機機翼產生升力' },
      { label: 'C', text: '用吸管喝飲料' },
      { label: 'D', text: '颱風掀翻屋頂' },
    ],
    correctAnswer: 'ABD',
    studentAnswer: 'AB',
    knowledgePoints: ['伯努利原理應用', '液體壓強'],
    aiErrorAnalysis: {
      summary: '學生遺漏了颱風掀翻屋頂的伯努利原理應用場景。',
      errorTypes: [{ type: '知識遷移不足', percentage: 70 }, { type: '場景識別不全', percentage: 30 }],
      rootCauses: ['對伯努利原理的應用場景認知不夠全面'],
    },
    aiTeachingSuggestion: {
      summary: '拓展伯努利原理的應用場景認知',
      strategies: ['生活實例', '概念辨析'],
      resources: ['bernoulli-video-01'],
    },
  },
  {
    id: 'wq0-4',
    questionText: '用同一把尺子撥動，橡皮筋繃得越緊，發出的聲音：',
    type: 'single' as const,
    options: [
      { label: 'A', text: '音調越高' },
      { label: 'B', text: '音調越低' },
      { label: 'C', text: '響度越大' },
      { label: 'D', text: '響度越小' },
    ],
    correctAnswer: 'A',
    studentAnswer: 'C',
    knowledgePoints: ['音調與頻率', '振動頻率'],
    aiErrorAnalysis: {
      summary: '學生混淆了音調和響度的概念。',
      errorTypes: [{ type: '概念混淆', percentage: 80 }, { type: '物理量對應錯誤', percentage: 20 }],
      rootCauses: ['未區分音調（頻率）和響度（振幅）'],
    },
    aiTeachingSuggestion: {
      summary: '對比音調與響度的決定因素',
      strategies: ['實驗演示', '概念辨析'],
      resources: [],
    },
  },
  {
    id: 'wq0-5',
    questionText: '下列樂器中，利用空氣柱振動發聲的是：',
    type: 'single' as const,
    options: [
      { label: 'A', text: '古箏' },
      { label: 'B', text: '長笛' },
      { label: 'C', text: '架子鼓' },
      { label: 'D', text: '二胡' },
    ],
    correctAnswer: 'B',
    studentAnswer: 'A',
    knowledgePoints: ['樂器發聲原理', '空氣柱振動'],
    aiErrorAnalysis: {
      summary: '學生未能正確分類樂器的發聲方式。',
      errorTypes: [{ type: '分類錯誤', percentage: 70 }, { type: '知識記憶不牢', percentage: 30 }],
      rootCauses: ['對弦振動、空氣柱振動、膜振動的分類不清'],
    },
    aiTeachingSuggestion: {
      summary: '系統梳理樂器發聲分類',
      strategies: ['概念辨析', '圖示分析'],
      resources: [],
    },
  },
  {
    id: 'wq0-6',
    questionText: '關於聲波，下列說法正確的是：',
    type: 'single' as const,
    options: [
      { label: 'A', text: '聲波可以在真空中傳播' },
      { label: 'B', text: '聲波的傳播速度與介質無關' },
      { label: 'C', text: '聲波是一種縱波' },
      { label: 'D', text: '聲波的頻率越高，傳播速度越快' },
    ],
    correctAnswer: 'C',
    studentAnswer: 'D',
    knowledgePoints: ['聲波基本特徵', '縱波與橫波'],
    aiErrorAnalysis: {
      summary: '學生誤認為頻率影響聲速。',
      errorTypes: [{ type: '概念理解錯誤', percentage: 60 }, { type: '因果關係混淆', percentage: 40 }],
      rootCauses: ['混淆了聲速的決定因素（介質）與聲音特性（頻率）'],
    },
    aiTeachingSuggestion: {
      summary: '釐清聲速與頻率的關係',
      strategies: ['概念辨析', '生活實例'],
      resources: [],
    },
  },
];

// ============ 4. 對話腳本 ============

export interface DemoStep {
  id: number;
  prefilledInput: string | null;
  aiResponse: string;
  actionCards?: Array<{
    icon: string;
    title: string;
    subtitle: string;
    action: string;
    actionPayload?: string;
  }>;
  sideEffects?: Array<{
    type: 'log' | 'knowledge_progress' | 'add_task' | 'highlight_resource';
    payload: any;
  }>;
}

export const demoConversationScript: DemoStep[] = [
  // Step 0：歡迎 + 成績概覽
  {
    id: 0,
    prefilledInput: null,
    aiResponse: `你好王芳！👋 歡迎來到你的學習空間。

我看到你剛完成了**「流體壓強與流速關係」專項測驗**，成績如下：

| 項目 | 結果 |
|------|------|
| 得分 | 60 / 100 |
| 答對 | 9 / 15 題 |
| 答錯 | 6 題 |

其中有幾道關於**伯努利原理**和**流體壓強**的題目值得我們一起回顧。

你覺得哪些題目最讓你困惑？我們可以從那裡開始。`,
    sideEffects: [
      { type: 'log', payload: { action: 'enter_space', detail: '進入學習空間，載入測驗結果' } },
    ],
  },
  // Step 1：引導回顧龍捲風題
  {
    id: 1,
    prefilledInput: '龍捲風那題我不太確定',
    aiResponse: `好的，我們來看看這道龍捲風的題目。

> 龍捲風經過時，能把地面上的物體「吸」到空中，這是因為……

你當時選了 **B：龍捲風產生的強大吸力直接將物體吸起**。

我想先問你一個問題：你覺得「吸」這個動作，在物理上到底是怎麼發生的？真的存在一種「吸力」嗎？🤔`,
    sideEffects: [
      { type: 'log', payload: { action: 'review_wrong', detail: '開始回顧錯題 wq0-1（龍捲風題）' } },
      { type: 'highlight_resource', payload: { resourceId: 'bernoulli-video-01' } },
    ],
  },
  // Step 2：追問伯努利原理
  {
    id: 2,
    prefilledInput: '應該是有什麼力量把東西推上去的？',
    aiResponse: `很好！你的直覺方向是對的——確實是「推」而不是「吸」。

在物理學中，**不存在真正的「吸力」**。那麼問題來了：

如果龍捲風內部的空氣在高速旋轉，根據你學過的知識，**流速快的地方，壓強會怎麼變化？**`,
    sideEffects: [
      { type: 'knowledge_progress', payload: { knowledgeId: 'bernoulli', status: 'learning' } },
    ],
  },
  // Step 3：揭示答案 + 錯誤分析
  {
    id: 3,
    prefilledInput: '流速快...壓強應該變小？',
    aiResponse: `完全正確！🎯

**流速越大，壓強越小**——這就是**伯努利原理**的核心。

所以龍捲風的真相是：
1. 龍捲風內部氣流速度極大
2. 根據伯努利原理，內部氣壓**遠低於**外部
3. 外部的高氣壓把物體**推入**低壓區域

正確答案是 **A**。你選的 B 說「吸力」，其實物理上不存在吸力，本質都是**壓強差產生的推力**。

> 💡 記住：每當你聽到「吸」，都可以翻譯成「另一側壓強更大，把東西推過來」。

想更深入理解嗎？可以看看這個演示影片，或者查看詳細的錯題分析。`,
    actionCards: [
      { icon: '🎬', title: '觀看影片', subtitle: '伯努利原理演示實驗', action: 'open_resource', actionPayload: 'bernoulli-video-01' },
      { icon: '📋', title: '查看錯題分析', subtitle: '龍捲風題詳細解析', action: 'open_task', actionPayload: 'wq0-1' },
    ],
    sideEffects: [
      { type: 'log', payload: { action: 'concept_clarified', detail: '理解伯努利原理核心概念' } },
    ],
  },
  // Step 4：影片觀後 + 生成類似題
  {
    id: 4,
    prefilledInput: '我看完影片了，地鐵站台設安全線是因為列車經過時速度快，旁邊壓強變小',
    aiResponse: `太棒了！你已經能把伯努利原理遷移到新的場景了。

地鐵安全線就是一個經典的例子：列車高速通過 → 靠近列車的空氣流速大 → 壓強小 → 人會被「推向」列車方向。

現在我想用一道類似題來檢驗一下你的理解，這道題和你之前做錯的「濕布瓶題」有關：

> 兩支相同試管裝等量水，一支用濕布包裹，用電風扇吹風一段時間後，兩管液面高度關係是？
>
> A. 兩管液面一樣高
> B. 濕布試管液面較高
> C. 無法判斷
> D. 濕布試管液面較低

試試看？`,
    actionCards: [
      { icon: '✏️', title: '開始作答', subtitle: '回覆你的答案即可', action: 'next_topic' },
    ],
    sideEffects: [
      { type: 'log', payload: { action: 'video_complete', detail: '觀看伯努利原理演示影片' } },
      { type: 'knowledge_progress', payload: { knowledgeId: 'bernoulli', status: 'practicing' } },
    ],
  },
  // Step 5：正確反饋 + 學習小結
  {
    id: 5,
    prefilledInput: 'D，因為濕布蒸發讓那邊流速更快，壓強更小，水面被壓下去',
    aiResponse: `回答正確！🎉

你的分析思路很清晰：
1. 濕布表面水分蒸發 → 加速附近空氣流動
2. 流速增大 → 該側氣壓降低
3. 另一側氣壓相對較高 → 將液面「壓低」

**本次學習小結：**
- ✅ 掌握了伯努利原理的核心（流速↑ → 壓強↓）
- ✅ 能正確區分「吸力」與「壓強差」
- ✅ 能將原理遷移到新場景（地鐵安全線、濕布實驗）

**補救建議：** 你還有 4 道錯題涉及聲學知識（音調、樂器發聲、聲波特徵），建議接下來繼續學習。`,
    actionCards: [
      { icon: '📚', title: '繼續學習', subtitle: '進入聲學錯題回顧', action: 'next_topic' },
      { icon: '📝', title: '記筆記', subtitle: '記錄今天的學習心得', action: 'open_note' },
      { icon: '🧠', title: '生成思維導圖', subtitle: '整理流體壓強知識結構', action: 'generate_mindmap' },
    ],
    sideEffects: [
      { type: 'log', payload: { action: 'exercise_correct', detail: '正確完成類似題（濕布瓶題）' } },
      { type: 'knowledge_progress', payload: { knowledgeId: 'bernoulli', status: 'mastered' } },
      { type: 'knowledge_progress', payload: { knowledgeId: 'fluid-pressure', status: 'mastered' } },
    ],
  },
  // Step 6：元認知導師觀察
  {
    id: 6,
    prefilledInput: null,
    aiResponse: `**🔍 學習狀態觀察（導師面板）**

王芳在本次學習中表現出良好的思維品質：

- **思維轉變**：從「吸力」的日常認知成功過渡到「壓強差」的物理概念
- **遷移能力**：能主動將伯努利原理應用到地鐵安全線場景
- **自我修正**：在引導下逐步修正了錯誤認知，而非被動接受答案

**建議關注**：聲學部分的 4 道錯題顯示學生在「物理量對應關係」上存在系統性薄弱，建議下次學習重點突破。`,
    sideEffects: [
      { type: 'log', payload: { action: 'ai_observation', detail: '元認知導師生成學習狀態觀察報告' } },
    ],
  },
];

// ============ 5. AI 生成的類似題 ============

export const demoVariantQuestions = [
  {
    id: 'variant-wq0-2',
    basedOn: 'wq0-2',
    questionText: '兩支相同試管裝等量水，一支用濕布包裹，用電風扇吹風一段時間後，兩管液面高度關係是：',
    type: 'single' as const,
    options: [
      { label: 'A', text: '兩管液面一樣高' },
      { label: 'B', text: '濕布試管液面較高' },
      { label: 'C', text: '無法判斷' },
      { label: 'D', text: '濕布試管液面較低' },
    ],
    correctAnswer: 'D',
    explanation: '濕布表面水分蒸發加速附近空氣流動，根據伯努利原理，流速大的地方壓強小，因此濕布側液面被壓低。同時蒸發吸熱也會加速該側液體減少。',
  },
];

// ============ 6. 學習資源 ============

export const demoLearningResources = [
  {
    id: 'fluid-pressure-doc-01',
    title: '流體壓強與流速關係 講義',
    type: 'document' as const,
    format: 'PDF',
    description: '涵蓋伯努利原理、流體壓強基本概念及典型例題',
    url: '/resources/fluid-pressure-notes.pdf',
    knowledgePoints: ['流體壓強與流速的關係', '伯努利原理'],
  },
  {
    id: 'bernoulli-video-01',
    title: '伯努利原理演示實驗',
    type: 'video' as const,
    format: 'MP4',
    description: '通過乒乓球、紙張等簡單實驗演示伯努利效應',
    url: '/resources/bernoulli-demo.mp4',
    duration: 480,
    knowledgePoints: ['伯努利原理', '伯努利原理應用'],
  },
];

// ============ 7. 學習日誌時間線 ============

export const demoLearningLog = [
  { id: 'log-1', type: 'enter', timestamp: new Date('2024-01-20T10:35:00'), title: '進入學習空間', description: '載入「流體壓強與流速關係」測驗結果' },
  { id: 'log-2', type: 'review_wrong', timestamp: new Date('2024-01-20T10:36:00'), title: '回顧錯題', description: '開始回顧龍捲風題（wq0-1）' },
  { id: 'log-3', type: 'concept_discuss', timestamp: new Date('2024-01-20T10:38:00'), title: '概念探討', description: '討論「吸力」vs「壓強差」的物理本質' },
  { id: 'log-4', type: 'concept_clarified', timestamp: new Date('2024-01-20T10:42:00'), title: '概念釐清', description: '理解伯努利原理核心：流速↑ → 壓強↓' },
  { id: 'log-5', type: 'resource_view', timestamp: new Date('2024-01-20T10:43:00'), title: '觀看影片', description: '觀看「伯努利原理演示實驗」影片' },
  { id: 'log-6', type: 'knowledge_transfer', timestamp: new Date('2024-01-20T10:51:00'), title: '知識遷移', description: '將伯努利原理應用到地鐵安全線場景' },
  { id: 'log-7', type: 'exercise_complete', timestamp: new Date('2024-01-20T10:53:00'), title: '完成練習', description: '正確完成類似題（濕布瓶題變式）' },
  { id: 'log-8', type: 'mastery', timestamp: new Date('2024-01-20T10:54:00'), title: '知識點掌握', description: '伯努利原理、流體壓強 → 已掌握' },
];

// ============ 8. 知識點掌握進度 ============

export const demoKnowledgeProgress = [
  {
    id: 'bernoulli',
    name: '伯努利原理',
    stages: [
      { status: 'pending' as const, timestamp: new Date('2024-01-20T10:35:00'), trigger: '測驗結果載入' },
      { status: 'learning' as const, timestamp: new Date('2024-01-20T10:38:00'), trigger: '開始討論龍捲風題' },
      { status: 'mastered' as const, timestamp: new Date('2024-01-20T10:53:00'), trigger: '正確完成類似題' },
    ],
  },
  {
    id: 'fluid-pressure',
    name: '流體壓強與流速關係',
    stages: [
      { status: 'pending' as const, timestamp: new Date('2024-01-20T10:35:00'), trigger: '測驗結果載入' },
      { status: 'learning' as const, timestamp: new Date('2024-01-20T10:42:00'), trigger: '理解壓強差概念' },
      { status: 'mastered' as const, timestamp: new Date('2024-01-20T10:53:00'), trigger: '正確完成類似題' },
    ],
  },
];
