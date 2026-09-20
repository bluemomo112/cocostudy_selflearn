// Stub of DeepTutor web/components/common/InlineFileCard.tsx.
// The original turns generated-file mentions and `attachment:` links in assistant prose into
// clickable file cards, and is wired to DeepTutor's chat state. self-learn has no such state
// yet, so links stay plain links and the context is always empty. Keep the exports so the
// Markdown renderers copied from DeepTutor work unchanged.
import type { ReactNode } from "react";

export function parseAttachmentHref(_href?: string): string | null {
  return null;
}

export function makeFileLinkRemarkPlugin(_files: unknown[]): null {
  return null;
}

export function useInlineFileCardContext(): { files: unknown[] } | null {
  return null;
}

export function InlineFileCard({
  fallback,
}: {
  name: string;
  fallback?: ReactNode;
}) {
  return <>{fallback}</>;
}

export function InlineWorkspaceImage({
  name,
  alt,
}: {
  name: string;
  alt?: string;
  className?: string;
}) {
  return <>{alt || name}</>;
}
