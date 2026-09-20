"use client";

/**
 * Shows how the tutor grounded an answer: the knowledge-base searches it ran and the passages it cited.
 * Written for self-learn (DeepTutor's own trace panels are ~2000 lines bound to its metadata contract).
 */
import { ChevronDown, FileText, Globe, Search } from "lucide-react";

import { useTranslation } from "../i18n";

export interface MessageSource {
  title: string;
  snippet: string;
  page?: string;
  score?: number;
  url?: string;
  type?: string;
}

export interface MessageToolCall {
  name: string;
  query?: string;
}

const TOOL_LABELS: Record<string, string> = {
  rag: "Searched the knowledge base",
  web_search: "Searched the web",
  web_fetch: "Read a web page",
  paper_search: "Searched papers",
  reason: "Reasoned step by step",
  brainstorm: "Brainstormed",
};

function groupByTitle(sources: MessageSource[]) {
  const groups = new Map<string, MessageSource[]>();
  for (const s of sources) {
    const key = s.title || s.url || "";
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  return [...groups.entries()];
}

export default function MessageSources({
  sources,
  toolCalls,
}: {
  sources?: MessageSource[];
  toolCalls?: MessageToolCall[];
}) {
  const { t } = useTranslation();
  const calls = toolCalls ?? [];
  const cited = sources ?? [];
  if (calls.length === 0 && cited.length === 0) return null;
  const groups = groupByTitle(cited);

  return (
    <div className="mt-3 space-y-2 text-[12px]">
      {calls.length > 0 ? (
        <ul className="space-y-1 text-[var(--muted-foreground)]">
          {calls.map((c, i) => (
            <li key={`${c.name}-${i}`} className="flex items-start gap-1.5">
              <Search size={12} className="mt-0.5 shrink-0 opacity-70" />
              <span>
                {t(TOOL_LABELS[c.name] ?? "Used a tool")}
                {c.query ? (
                  <span className="ml-1 text-[var(--foreground)]/70">「{c.query}」</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {groups.length > 0 ? (
        <details className="group/src overflow-hidden rounded-lg border border-[var(--border)]/70 bg-[var(--card)]/40">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 px-2.5 py-1.5 font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
            <ChevronDown size={12} className="shrink-0 opacity-70 transition-transform group-open/src:rotate-180" />
            <span>
              {t("Sources")} ({groups.length})
            </span>
          </summary>
          <ul className="divide-y divide-[var(--border)]/50 border-t border-[var(--border)]/50">
            {groups.map(([title, items]) => (
              <li key={title} className="px-2.5 py-2">
                <div className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                  {items[0].url ? (
                    <Globe size={12} className="shrink-0 opacity-70" />
                  ) : (
                    <FileText size={12} className="shrink-0 opacity-70" />
                  )}
                  {items[0].url ? (
                    <a href={items[0].url} target="_blank" rel="noreferrer" className="truncate underline-offset-2 hover:underline">
                      {title}
                    </a>
                  ) : (
                    <span className="truncate">{title}</span>
                  )}
                  {items[0].page ? (
                    <span className="shrink-0 text-[var(--muted-foreground)]">
                      {t("Page {{n}}", { n: items[0].page })}
                    </span>
                  ) : null}
                </div>
                {items[0].snippet ? (
                  <p className="mt-1 line-clamp-3 whitespace-pre-line text-[var(--muted-foreground)]">
                    {items[0].snippet.trim()}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
