import type { LucideIcon } from 'lucide-react';
import { GraduationCap, Compass, Users, HelpCircle, Swords, BookOpen } from 'lucide-react';

export interface AgentPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  bestFor: string;
  sampleLine: string;
  icon: LucideIcon;
  gradient: string; // 卡片背景渐变
  ring: string; // 选中时的高亮环颜色
  solidBtn: string; // 确认按钮实心背景色
  chipBg: string; // 标签 chip 背景色
  intensityOptions?: string[]; // 仅苏格拉底式使用：引导强度档位
}

export const AGENT_PRESETS: AgentPreset[] = [
  {
    id: 'socratic',
    name: '苏格拉底式',
    tagline: '不给答案，靠提问带你想明白',
    description:
      '完全没思路时用它。它不会直接告诉你答案，而是通过一层层提问，带你自己推导出解法。可以调节引导强度——提示给多给少。',
    tags: ['从零开始', '深度理解', '可调引导强度'],
    bestFor: '做新题完全没头绪，需要从零搭出解题路径时选它',
    sampleLine: '别急着要答案，我们一步步来。你觉得这道题第一步应该从哪里入手？',
    icon: Compass,
    gradient: 'from-sky-500 to-sky-600',
    ring: 'ring-sky-500',
    solidBtn: 'bg-sky-600 hover:bg-sky-700',
    chipBg: 'bg-sky-50 text-sky-700 border-sky-200',
    intensityOptions: ['轻提示', '中提示', '不给答案'],
  },
  {
    id: 'standard',
    name: '标准助教',
    tagline: '直接讲清楚，效率优先',
    description: '有问题直接给你答案，配上解释、例子和资料出处，不绕弯子。',
    tags: ['快速答疑', '查漏补缺', '标准讲解'],
    bestFor: '赶时间、只想对答案或查漏补缺时选它',
    sampleLine: '你好，我是标准助教。有什么问题尽管问，我会直接告诉你答案，并讲清楚为什么。',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-blue-600',
    ring: 'ring-blue-500',
    solidBtn: 'bg-blue-600 hover:bg-blue-700',
    chipBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'feynman',
    name: '费曼式',
    tagline: '反过来，你来教AI',
    description:
      '已经学过、想确认是不是真的搞懂了？我会假装什么都不懂，让你讲给我听，哪里讲不清楚，就是你还没吃透的地方。',
    tags: ['复习自测', '检验理解深度', '角色反转'],
    bestFor: '复习或考前自测，想确认自己是"记住了"还是"真讲得清"时选它',
    sampleLine: '我对这个知识点完全不懂，你可以像给一个新手讲课一样教教我吗？',
    icon: Users,
    gradient: 'from-orange-500 to-amber-600',
    ring: 'ring-orange-500',
    solidBtn: 'bg-orange-600 hover:bg-orange-700',
    chipBg: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    id: 'skeptic',
    name: '质疑者',
    tagline: '追问到底，验证你是真懂还是背答案',
    description:
      '你答对了，但我会继续追问"为什么""你怎么知道"，一路问到最底层的依据。理科的推导、史实的因果都适用。',
    tags: ['验证理解', '打破砂锅问到底', '适用任意学科'],
    bestFor: '答案已经对了，但想确认自己是真理解还是死记硬背时选它',
    sampleLine: '你说得对，但为什么会是这样？你是怎么推出这一步的？',
    icon: HelpCircle,
    gradient: 'from-teal-500 to-cyan-600',
    ring: 'ring-teal-500',
    solidBtn: 'bg-teal-600 hover:bg-teal-700',
    chipBg: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'debater',
    name: '辩论对手',
    tagline: '站在你对面，跟你吵一场',
    description:
      '只用于有争议、可以多角度讨论的话题（议论文、政策利弊、伦理两难）。我会站在你的对立面，用反例反驳你，逼你把论证做扎实。不适合有唯一正解的题目。',
    tags: ['议论文', '开放性话题', '练说服力'],
    bestFor: '写议论文、准备辩论，需要练"说服力"而不是"对不对"时选它',
    sampleLine: '我不同意你的观点。你说的这个理由，难道没有反例吗？',
    icon: Swords,
    gradient: 'from-rose-500 to-red-600',
    ring: 'ring-rose-500',
    solidBtn: 'bg-rose-600 hover:bg-rose-700',
    chipBg: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'material-guide',
    name: '资料精讲官',
    tagline: '带你逐段读透你上传的资料',
    description: '围绕你上传的具体资料，主动带你过一遍内容结构，逐段讲解，你可以随时打断追问细节。',
    tags: ['资料精读', '结构讲解', '可持续追问'],
    bestFor: '刚拿到一份新资料，想先被人带着读一遍时选它',
    sampleLine: '我已经看完你上传的资料了，要不要我先带你过一遍整体结构？',
    icon: BookOpen,
    gradient: 'from-emerald-500 to-green-600',
    ring: 'ring-emerald-500',
    solidBtn: 'bg-emerald-600 hover:bg-emerald-700',
    chipBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

export function getAgentPreset(id: string): AgentPreset {
  return AGENT_PRESETS.find((a) => a.id === id) || AGENT_PRESETS[0];
}
