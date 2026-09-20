"use client";

/**
 * Slimmed from DeepTutor web/components/common/AssistantResponse.tsx.
 * Dropped: reading / watching citation linkification (needs DeepTutor's Reading/Watching contexts).
 * Added: `thinking` — reasoning text collected from `thinking` stream events, shown in the same
 * collapsible card DeepTutor uses for inline <think> blocks.
 */
import { Fragment, memo, useMemo } from "react";

import { useSmoothStreamText } from "../hooks/useSmoothStreamText";
import {
  hasVisibleMarkdownContent,
  repairChineseEmphasis,
  repairMalformedStrongEmphasis,
  stripArtifactAnnotations,
} from "../lib/markdown-display";
import { parseModelThinkingSegments } from "../lib/think-segments";
import MarkdownRenderer from "./MarkdownRenderer";
import ModelThinkingCard from "./ModelThinkingCard";

interface AssistantResponseProps {
  content: string;
  /** Reasoning text from `thinking` events (separate from the answer). */
  thinking?: string;
  className?: string;
  /** True while this message is still being streamed: typewriter on, thinking card open. */
  isStreaming?: boolean;
  language?: string;
}

function AssistantResponseImpl({
  content,
  thinking,
  className = "text-sm leading-relaxed",
  isStreaming = false,
  language,
}: AssistantResponseProps) {
  const displayContent = useSmoothStreamText(content, isStreaming);
  const segments = useMemo(
    () => parseModelThinkingSegments(stripArtifactAnnotations(displayContent)),
    [displayContent],
  );

  const hasThinking = Boolean(thinking && thinking.trim());
  const hasRenderableSegment = useMemo(
    () =>
      segments.some((segment) =>
        segment.kind === "think"
          ? segment.content.trim().length > 0
          : hasVisibleMarkdownContent(segment.content),
      ),
    [segments],
  );

  if (!hasThinking && !hasRenderableSegment) return null;

  // The reasoning card stays open while the model is still thinking (no answer text yet)
  // and folds itself once the answer starts or the turn ends.
  const thinkingClosed = !isStreaming || hasRenderableSegment;

  return (
    <div
      role="article"
      aria-live="polite"
      aria-atomic="false"
      className={className}
    >
      {hasThinking ? (
        <ModelThinkingCard content={thinking!.trim()} closed={thinkingClosed} />
      ) : null}
      {segments.map((segment, index) => {
        if (segment.kind === "think") {
          return (
            <ModelThinkingCard
              key={`think-${index}`}
              content={segment.content}
              closed={segment.closed}
            />
          );
        }
        const repairedContent = isStreaming
          ? repairMalformedStrongEmphasis(segment.content)
          : repairChineseEmphasis(
              repairMalformedStrongEmphasis(segment.content),
              language,
            );

        if (!hasVisibleMarkdownContent(repairedContent)) {
          return <Fragment key={`text-${index}`} />;
        }

        return (
          <MarkdownRenderer
            key={`text-${index}`}
            content={repairedContent}
            variant="prose"
            className="text-[var(--foreground)]"
          />
        );
      })}
    </div>
  );
}

// Memoized so finished bubbles don't re-parse markdown while a sibling streams.
const AssistantResponse = memo(AssistantResponseImpl);
AssistantResponse.displayName = "AssistantResponse";
export default AssistantResponse;
