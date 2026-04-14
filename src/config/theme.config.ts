/**
 * @cross/self-learn - 绿色主题配置
 *
 * 与 cross-new/src/config/theme.config.ts 中的 greenTheme 保持同步。
 * 如需在 JS/TS 中读取颜色值，直接 import 此文件使用。
 */

export interface ThemeColors {
  primary: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;
  accent: Record<50 | 100 | 200 | 300 | 400 | 500 | 600, string>;
  fresh: Record<50 | 100 | 200 | 300 | 400 | 500 | 600, string>;
  background: { default: string; gradient: string; card: string };
  glow: { primary: string; accent: string };
}

export const greenThemeColors: ThemeColors = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  accent: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
  },
  fresh: {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
  },
  background: {
    default: '#ffffff',
    gradient: 'linear-gradient(180deg, #f0fdf6 0%, #fafafa 100%)',
    card: 'rgba(255, 255, 255, 0.8)',
  },
  glow: {
    primary: 'rgba(16, 185, 129, 0.35)',
    accent: 'rgba(20, 184, 166, 0.35)',
  },
};
