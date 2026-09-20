"use client";

/**
 * The question the tutor asks while checking mastery. The correct answer is kept server-side: the student's
 * answer goes back to DeepTutor (`mastery_answer`), which grades it and updates the learning map.
 */
import { CheckCircle2, Target, XCircle } from "lucide-react";
import { useState } from "react";

import type { MasteryGrade, MasteryQuestion } from "../mastery";

export interface MasteryQuestionCardProps {
  question: MasteryQuestion;
  /** What the student answered (set once submitted). */
  answered?: string;
  grade?: MasteryGrade;
  /** Disabled while another turn is running. */
  disabled?: boolean;
  onAnswer: (text: string) => void;
}

export default function MasteryQuestionCard({ question, answered, grade, disabled, onAnswer }: MasteryQuestionCardProps) {
  const [draft, setDraft] = useState("");
  const options = question.options ?? [];
  const canType = question.allow_free_text || options.length === 0;
  const locked = Boolean(answered) || disabled;

  return (
    <div className="mt-3 overflow-hidden rounded-lg border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="flex items-center gap-1.5 border-b border-amber-200 bg-amber-100/60 px-4 py-2 text-xs font-bold text-amber-800">
        <Target size={14} />
        <span>掌握度检查{question.objective?.name ? `：${question.objective.name}` : ""}</span>
      </div>
      <div className="p-4 text-sm text-gray-800">
        <p className="mb-3 whitespace-pre-wrap font-medium">{question.prompt}</p>

        {options.length > 0 ? (
          <div className="space-y-2">
            {options.map((option) => {
              const chosen = answered === option.label || answered === `${option.label}. ${option.body}`;
              const isCorrect = grade && grade.correct_label === option.label;
              let style = "border-gray-200 bg-white hover:border-amber-400 hover:bg-amber-50";
              if (answered) {
                if (isCorrect) style = "border-emerald-400 bg-emerald-50 text-emerald-800";
                else if (chosen) style = "border-red-400 bg-red-50 text-red-800";
                else style = "border-gray-200 bg-gray-50 text-gray-400";
              }
              return (
                <button
                  key={option.label}
                  type="button"
                  disabled={locked}
                  onClick={() => onAnswer(`${option.label}. ${option.body}`)}
                  className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${style} ${locked ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span className="mt-0.5 font-semibold">{option.label}</span>
                  <span className="flex-1">{option.body}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {canType && !answered ? (
          <div className={options.length > 0 ? "mt-3" : ""}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={locked}
              rows={3}
              placeholder={options.length > 0 ? "也可以用自己的话回答…" : "在这里写下你的回答…"}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              disabled={locked || !draft.trim()}
              onClick={() => onAnswer(draft.trim())}
              className="mt-2 rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              提交回答
            </button>
          </div>
        ) : null}

        {answered && !options.length ? (
          <p className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-gray-600">你的回答：{answered}</p>
        ) : null}

        {grade ? (
          <div className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 ${grade.is_correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
            {grade.is_correct ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <XCircle size={16} className="mt-0.5 shrink-0" />}
            <div className="text-sm">
              <div className="font-semibold">{grade.is_correct ? "答对了" : "这次没答对"}</div>
              {grade.explanation ? <div className="mt-0.5 whitespace-pre-wrap opacity-90">{grade.explanation}</div> : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
