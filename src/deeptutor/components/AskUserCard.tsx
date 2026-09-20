"use client";

/**
 * The tutor pauses its turn to ask the student something (e.g. the intake questions of a learning path:
 * prior knowledge, goal, time). One card holds up to three questions; submitting sends all answers back
 * and the same turn carries on.
 */
import { HelpCircle } from "lucide-react";
import { useState } from "react";

import type { AskUserPayload } from "../chatSession";

export interface AskUserCardProps {
  payload: AskUserPayload;
  /** Set once submitted: question id -> answer text. */
  answers?: Record<string, string>;
  onSubmit: (answers: Array<{ questionId: string; text: string }>) => void;
}

interface Option {
  label: string;
  description?: string;
}

const normalize = (options: AskUserPayload["questions"][number]["options"]): Option[] =>
  (options ?? []).map((o) => (typeof o === "string" ? { label: o } : o));

const SEPARATOR = "、";

export default function AskUserCard({ payload, answers, onSubmit }: AskUserCardProps) {
  // Per question: the chosen option labels, and the free text typed instead / in addition.
  const [chosen, setChosen] = useState<Record<string, string[]>>({});
  const [typed, setTyped] = useState<Record<string, string>>({});
  const submitted = Boolean(answers);

  const answerFor = (id: string) => [...(chosen[id] ?? []), (typed[id] ?? "").trim()].filter(Boolean).join(SEPARATOR);
  const complete = payload.questions.every((q) => answerFor(q.id).length > 0);

  const toggle = (id: string, label: string, multi: boolean) =>
    setChosen((prev) => {
      const current = prev[id] ?? [];
      if (!multi) return { ...prev, [id]: current[0] === label ? [] : [label] };
      return { ...prev, [id]: current.includes(label) ? current.filter((l) => l !== label) : [...current, label] };
    });

  return (
    <div className="mt-3 overflow-hidden rounded-lg border-2 border-sky-300 bg-gradient-to-br from-sky-50 to-indigo-50">
      <div className="flex items-center gap-1.5 border-b border-sky-200 bg-sky-100/60 px-4 py-2 text-xs font-bold text-sky-800">
        <HelpCircle size={14} />
        <span>AI 想先了解你</span>
      </div>
      <div className="space-y-4 p-4 text-sm text-gray-800">
        {payload.intro ? <p className="whitespace-pre-wrap text-gray-600">{payload.intro}</p> : null}
        {payload.questions.map((q, index) => {
          const options = normalize(q.options);
          const submittedText = answers?.[q.id];
          return (
            <div key={q.id}>
              {q.header ? <div className="mb-1 text-xs font-semibold text-sky-700">{q.header}</div> : null}
              <p className="mb-2 font-medium">
                {payload.questions.length > 1 ? `${index + 1}. ` : ""}
                {q.prompt}
              </p>
              {options.length > 0 ? (
                <div className="space-y-1.5">
                  {options.map((option) => {
                    const selected = submitted ? (submittedText ?? "").split(SEPARATOR).includes(option.label) : (chosen[q.id] ?? []).includes(option.label);
                    return (
                      <button
                        key={option.label}
                        type="button"
                        disabled={submitted}
                        onClick={() => toggle(q.id, option.label, Boolean(q.multi_select))}
                        className={`block w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                          selected ? "border-sky-500 bg-sky-500 text-white" : "border-gray-300 bg-white hover:border-sky-400 hover:bg-sky-50"
                        } ${submitted && !selected ? "opacity-50" : ""} ${submitted ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <span className="font-medium">{option.label}</span>
                        {option.description ? (
                          <span className={`mt-0.5 block text-xs ${selected ? "text-sky-50" : "text-gray-500"}`}>{option.description}</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {q.allow_free_text || options.length === 0 ? (
                <input
                  type="text"
                  disabled={submitted}
                  value={typed[q.id] ?? ""}
                  onChange={(e) => setTyped((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder={q.placeholder || (options.length ? "或者用自己的话回答…" : "在这里回答…")}
                  className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400 ${options.length ? "mt-2" : ""}`}
                />
              ) : null}
              {submitted && submittedText && !options.some((o) => submittedText.split(SEPARATOR).includes(o.label)) ? (
                <p className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-gray-600">你的回答：{submittedText}</p>
              ) : null}
            </div>
          );
        })}
        {!submitted ? (
          <button
            type="button"
            disabled={!complete}
            onClick={() => onSubmit(payload.questions.map((q) => ({ questionId: q.id, text: answerFor(q.id) })))}
            className="rounded-lg bg-sky-600 px-4 py-1.5 font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            提交回答
          </button>
        ) : (
          <p className="text-xs text-gray-500">已提交，AI 正在根据你的回答继续…</p>
        )}
      </div>
    </div>
  );
}
