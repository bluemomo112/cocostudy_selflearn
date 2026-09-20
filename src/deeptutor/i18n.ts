'use client';

/**
 * Drop-in replacement for react-i18next's `useTranslation`, used by components
 * ported from DeepTutor (whose keys are English sentences).
 *
 * Lookup: zh dictionary (synced from DeepTutor's locales/zh) -> key itself.
 * Then the result goes through self-learn's LanguageContext so zh-TW conversion still applies.
 */
import { useCallback } from 'react';
import { useLanguage } from '../contexts';
import zhDict from './locales/zh.json';

const dict = zhDict as Record<string, string>;

type Vars = Record<string, unknown>;

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) =>
    name in vars ? String(vars[name]) : `{{${name}}}`,
  );
}

export function useTranslation() {
  const { language, t: convert } = useLanguage();

  const t = useCallback(
    (key: string, vars?: Vars | string): string => {
      const fallback = typeof vars === 'string' ? vars : key;
      const params = typeof vars === 'object' ? vars : undefined;
      const template = dict[key] ?? fallback;
      return convert(interpolate(template, params));
    },
    [convert],
  );

  return { t, i18n: { language } };
}
