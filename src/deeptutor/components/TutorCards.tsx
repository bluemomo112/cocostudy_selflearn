'use client';

/**
 * Visual cards for the new-knowledge / review tutor personas' structured turns (see
 * docs/导师SOP与提示词草稿-202609202256.md §5-6). Parsed out of the message text by
 * `splitContentSegments` (../lib/parse-cards) and rendered in place of the raw ```card:xxx
 * fenced block, so the student sees a real roadmap/result card instead of a generic code block.
 */
import { Map, RotateCcw, CheckCircle2, AlertTriangle, ListOrdered } from 'lucide-react';
import type { RoadmapCardData, ReviewResultCardData, ReviewOrderCardData } from '../lib/parse-cards';

const ACCENT: Record<'new' | 'review', { border: string; chipBg: string; chipText: string; icon: string }> = {
  new: { border: 'border-indigo-200', chipBg: 'bg-indigo-50', chipText: 'text-indigo-700', icon: 'text-indigo-500' },
  review: { border: 'border-cyan-200', chipBg: 'bg-cyan-50', chipText: 'text-cyan-700', icon: 'text-cyan-500' },
};

function CardShell({
  variant,
  label,
  icon: Icon,
  children,
}: {
  variant: 'new' | 'review';
  label: string;
  icon: typeof Map;
  children: React.ReactNode;
}) {
  const a = ACCENT[variant];
  return (
    <div className={`mt-2 rounded-xl border ${a.border} bg-white overflow-hidden`}>
      <div className={`flex items-center gap-1.5 px-3 py-1.5 ${a.chipBg} ${a.chipText} text-xs font-medium`}>
        <Icon size={13} className={a.icon} />
        {label}
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );
}

export function RoadmapCard({ data }: { data: RoadmapCardData }) {
  const variant = data.kind === 'roadmap-new' ? 'new' : 'review';
  const label = data.kind === 'roadmap-new' ? '本节课路线图' : '复习路线图';
  return (
    <CardShell variant={variant} label={label} icon={Map}>
      <ol className="space-y-3">
        {data.items.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full ${ACCENT[variant].chipBg} ${ACCENT[variant].chipText} text-xs font-medium flex items-center justify-center mt-0.5`}>
              {i + 1}
            </span>
            <div className="min-w-0 text-sm">
              <div className="text-gray-800">
                <span className="font-medium">「{item.title}」</span>
                {item.focus && <span className="text-gray-500">· 重点：{item.focus}</span>}
              </div>
              {item.material && <div className="text-gray-400 text-xs mt-0.5">《{item.material}》</div>}
              {item.outcome && <div className="text-gray-600 text-xs mt-1">学完你能：{item.outcome}</div>}
            </div>
          </li>
        ))}
      </ol>
    </CardShell>
  );
}

export function ReviewResultCard({ data }: { data: ReviewResultCardData }) {
  return (
    <CardShell variant="review" label="自测结果" icon={RotateCcw}>
      <div className="space-y-3">
        {data.mastered.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mb-1.5">
              <CheckCircle2 size={13} />
              掌握较好
            </div>
            <ul className="space-y-1">
              {data.mastered.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 pl-[19px]">{item}</li>
              ))}
            </ul>
          </div>
        )}
        {data.weak.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 mb-1.5">
              <AlertTriangle size={13} />
              薄弱点
            </div>
            <ul className="space-y-1">
              {data.weak.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 pl-[19px]">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CardShell>
  );
}

export function ReviewOrderCard({ data }: { data: ReviewOrderCardData }) {
  return (
    <CardShell variant="review" label="今天的复习顺序" icon={ListOrdered}>
      <ol className="space-y-1.5">
        {data.items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-medium flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ol>
    </CardShell>
  );
}
