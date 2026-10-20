/**
 * "Learning tools" (Studio), mocked for the UI-only build: every generator returns canned data in exactly
 * the shape the matching viewer in InteractiveViewerModal / ResourceInlineViewer consumes, after a short delay.
 *   flashcards -> { front, back }[]            mind map -> { center, branches: { title, items[] }[] }
 *   audio      -> { time, title, content }[]   documents -> markdown
 *   interactive page -> complete HTML (rendered in a sandboxed iframe via srcDoc)
 */
import { MOCK_LATENCY_MS, sleep } from './config';

export interface StudioContext {
  /** Knowledge bases holding the space's resources; generation needs at least one. */
  knowledgeBases: string[];
  /** Free-text focus from the tool's configuration dialog. */
  focus?: string;
  signal?: AbortSignal;
}

const LATENCY = MOCK_LATENCY_MS * 4;

// ── flashcards ───────────────────────────────────────────────────────────

export interface Flashcard {
  front: string;
  back: string;
}

const CARDS: Flashcard[] = [
  { front: '什么是植物工厂？', back: '在封闭环境中，用人工光源和自动控制系统全年连续种植植物的生产方式。' },
  { front: '水培与土培最大的区别？', back: '水培不用土壤，养分溶于营养液，由根系直接吸收。' },
  { front: '光周期指什么？', back: '一天中光照与黑暗的时间比例，影响植物的生长和开花。' },
  { front: 'LED 补光灯的优势？', back: '光谱可调、发热少、耗电较低，适合近距离照射植物。' },
  { front: '营养液 EC 值反映什么？', back: '营养液中可溶性盐类的浓度，用来判断养分是否充足。' },
  { front: '集中控制系统的作用？', back: '统一采集并调节光照、温湿度、营养液等参数，保持环境稳定。' },
];

export async function generateFlashcards(_ctx: StudioContext, opts: { count: number }): Promise<Flashcard[]> {
  await sleep(LATENCY);
  return Array.from({ length: Math.max(1, opts.count) }, (_, i) => CARDS[i % CARDS.length]);
}

// ── mind map ─────────────────────────────────────────────────────────────

export interface MindMap {
  center: string;
  branches: Array<{ title: string; items: string[] }>;
}

export async function generateMindMap(_ctx: StudioContext): Promise<MindMap> {
  await sleep(LATENCY);
  return {
    center: '植物工厂',
    branches: [
      { title: '基本概念', items: ['封闭可控环境', '全年连续生产', '与传统农业对比'] },
      { title: '环境因子', items: ['光照与光周期', '温度与湿度', 'CO₂ 浓度', '营养液'] },
      { title: '水培系统', items: ['深液流 DFT', '营养液膜 NFT', '雾培 / 气培'] },
      { title: '集中控制', items: ['传感器采集', '自动调节', '远程监控'] },
      { title: '设计与评价', items: ['容器结构', '成本与能耗', '方案改进'] },
    ],
  };
}

// ── documents (markdown) ─────────────────────────────────────────────────

export type DocKind = 'summary' | 'key_points' | 'examples' | 'concept_search';

const DOCS: Record<DocKind, string> = {
  summary: `## 学习总结

植物工厂是在**封闭、可控**的环境里，用人工光源和自动控制系统种植植物的生产方式，不受季节和天气影响。

### 1. 为什么需要植物工厂
- 节约土地和水资源
- 全年稳定供应，品质可控

### 2. 关键环境因子
| 因子 | 作用 | 常见控制方式 |
| --- | --- | --- |
| 光照 | 光合作用能量来源 | LED 补光、调节光周期 |
| 温湿度 | 影响蒸腾与病害 | 空调、除湿 |
| 营养液 | 提供矿质养分 | 监测 EC / pH |

### 复习建议
1. 对照学生手册，复述植物工厂的定义。
2. 画出水培系统的循环示意图。
3. 用自己的话比较水培与土培。`,
  key_points: `## 必记要点

1. 植物工厂在封闭环境中用人工光源种植植物。（《认识植物工厂》）
2. 水培的养分来自营养液，不是土壤。（《认识植物工厂》）
3. 光周期影响植物生长和开花。
4. 集中控制系统统一调节光照、温湿度和营养液。

### 容易混淆
- **水培 vs 雾培**：水培根系浸在营养液里，雾培是把营养液喷成雾。
- **EC 值 vs pH 值**：EC 看浓度，pH 看酸碱度。`,
  examples: `## 实例分析

### 实例一：生菜工厂
- **情境**：某工厂全年生产叶菜。
- **知识点**：光周期、营养液配方。
- **分析**：缩短光照时长会让生长变慢，因此采用连续补光。
- **结论**：精确控制光照可以提高产量和稳定性。

### 实例二：家庭阳台水培
- **情境**：用塑料盒和营养液种薄荷。
- **知识点**：水培容器结构。
- **结论**：容器需遮光，否则容易长藻。`,
  concept_search: `## 核心概念

- **植物工厂**：封闭环境中全年连续种植的系统。例如：地铁站里的蔬菜货架。
- **水培**：用营养液代替土壤。例如：水养的绿萝。
- **光周期**：每天光照时长的安排。例如：夏天白天长，植物开花时间也会不同。

**联系**：植物工厂通过集中控制调节光周期和营养液，实现水培作物的稳定生长。`,
};

export async function generateDocument(_ctx: StudioContext, kind: DocKind): Promise<string> {
  await sleep(LATENCY);
  return DOCS[kind];
}

// ── timeline ─────────────────────────────────────────────────────────────

export interface TimelineEvent {
  year: string;
  icon: string;
  title: string;
  description: string;
}

export async function generateTimeline(_ctx: StudioContext): Promise<TimelineEvent[]> {
  await sleep(LATENCY);
  return [
    { year: '第一步', icon: '🌱', title: '认识植物工厂', description: '了解定义、特点与应用场景。' },
    { year: '第二步', icon: '💡', title: '环境因子', description: '光、温、水、肥如何影响生长。' },
    { year: '第三步', icon: '💧', title: '水培系统', description: '比较不同水培方式与容器结构。' },
    { year: '第四步', icon: '🎛️', title: '集中控制', description: '传感器与自动调节的工作流程。' },
    { year: '第五步', icon: '📐', title: '设计容器', description: '给指定作物设计水培容器。' },
    { year: '第六步', icon: '✅', title: '评价与改进', description: '根据成本和效果优化方案。' },
  ];
}

// ── audio overview ───────────────────────────────────────────────────────

export interface AudioChapter {
  time: string;
  title: string;
  content: string;
}

const CHAPTERS: Array<{ title: string; content: string }> = [
  { title: '走进植物工厂', content: '同学们好，今天我们来认识一种特别的农场——植物工厂。这里没有田地，也不看天吃饭，一切都由系统来调控。' },
  { title: '光和水的秘密', content: '植物要长好，离不开光照和营养。在植物工厂里，LED 灯提供光，营养液提供养分，两者都能被精确控制。' },
  { title: '聪明的控制中心', content: '传感器会不停地测量温度、湿度和营养液浓度，一旦偏离设定值，控制中心就会自动调整。' },
  { title: '动手设计一个容器', content: '最后，请你想一想：如果要在教室里种一盆生菜，水培容器需要有哪些结构？带着这个问题去完成设计吧。' },
];

export async function generateAudioScript(_ctx: StudioContext, opts: { chapters: number }): Promise<AudioChapter[]> {
  await sleep(LATENCY);
  let seconds = 0;
  return Array.from({ length: Math.max(1, opts.chapters) }, (_, i) => CHAPTERS[i % CHAPTERS.length]).map((c) => {
    const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    seconds += Math.max(20, Math.round(c.content.length / 4.5));
    return { time, title: c.title, content: c.content };
  });
}

// ── interactive page ─────────────────────────────────────────────────────

export interface InteractivePage {
  title: string;
  description: string;
  html: string;
}

const MOCK_PAGE_HTML = `<!doctype html><html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#f0fdf4;color:#14532d}
.plant{height:160px;display:flex;align-items:flex-end;justify-content:center}
.stem{width:14px;background:#16a34a;border-radius:7px;transition:height .2s}
label{display:block;margin:16px 0 4px;font-weight:600}input{width:100%}</style></head><body>
<h2>光照时长与生长高度</h2><div class="plant"><div class="stem" id="stem" style="height:80px"></div></div>
<label>每天光照：<span id="v">12</span> 小时</label><input id="s" type="range" min="4" max="20" value="12">
<p id="t">适中的光照，植物长势正常。</p>
<script>const s=document.getElementById('s'),v=document.getElementById('v'),st=document.getElementById('stem'),t=document.getElementById('t');
s.oninput=()=>{v.textContent=s.value;st.style.height=(20+s.value*8)+'px';t.textContent=s.value<8?'光照不足，植物长得细弱。':s.value>16?'光照过长，植物可能被抑制。':'适中的光照，植物长势正常。'}</script></body></html>`;

export async function generateInteractivePage(_ctx: StudioContext, opts: { goal: string; includeControls?: boolean }): Promise<InteractivePage> {
  await sleep(LATENCY);
  return { title: opts.goal || '光照时长与生长高度', description: '拖动滑块，观察光照时长对植物生长的影响。', html: MOCK_PAGE_HTML };
}
