// Slimmed from DeepTutor web/components/common/code-block-themes.ts:
// the original statically imports ~40 Prism themes and lets the user pick one.
// We only need the default dark theme.
import type { CSSProperties } from "react";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";

type PrismTheme = {
  [key: string]: CSSProperties;
};

export const DEFAULT_CODE_BLOCK_THEME_ID = "oneDark";

export function getCodeBlockTheme(_id?: string): PrismTheme {
  return oneDark as PrismTheme;
}

/** Extract the background color from a Prism style object. */
export function getCodeBlockThemeBackground(
  style: PrismTheme,
): string | undefined {
  const preStyle = style['pre[class*="language-"]'];
  if (preStyle && typeof preStyle === "object") {
    const backgroundColor = preStyle.backgroundColor;
    if (typeof backgroundColor === "string") {
      return backgroundColor;
    }
    const background = preStyle.background;
    if (typeof background === "string") {
      return background;
    }
  }
  return undefined;
}
