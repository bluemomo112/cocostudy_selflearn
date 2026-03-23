'use client';

import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { QuestionProps } from '../taskTypes';

interface ShortAnswerQuestionProps extends QuestionProps {
  gradingStatus?: 'instant' | 'grading' | 'graded';
  aiScore?: number;
  aiFeedback?: string;
}

export default function ShortAnswerQuestion({
  question, selectedAnswer, onAnswer, disabled, showResult,
  gradingStatus, aiScore, aiFeedback, compact,
}: ShortAnswerQuestionProps) {
  const { t } = useLanguage();
  const currentValue = (selectedAnswer as string) || '';

  if (showResult) {
    if (gradingStatus === 'grading') {
      return (
        <div className={`space-y-${compact ? '3' : '4'}`}>
          <div className={`${compact ? 'p-3 rounded-lg' : 'p-4 rounded-xl'} border-2 border-gray-200 bg-gray-50`}>
            <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-500 mb-2`}>{t('你的回答：')}</p>
            <p className={`${compact ? 'text-sm' : 'text-base'} text-gray-700 whitespace-pre-wrap`}>{currentValue || t('（未作答）')}</p>
          </div>
          <div className={`${compact ? 'p-3 rounded-lg' : 'p-5 rounded-xl'} border-2 border-blue-200 bg-blue-50 flex items-center gap-3`}>
            <Loader2 size={compact ? 14 : 18} className="text-blue-500 animate-spin flex-shrink-0" />
            <div>
              <p className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-blue-700`}>{t('正在批改中…')}</p>
              <p className={`${compact ? 'text-xs' : 'text-xs'} text-blue-500 mt-0.5`}>{t('AI 正在认真阅读你的回答，请稍候')}</p>
            </div>
          </div>
        </div>
      );
    }

    if (gradingStatus === 'graded') {
      const scoreColor = aiScore !== undefined
        ? aiScore >= 80 ? 'green' : aiScore >= 60 ? 'yellow' : 'red'
        : 'gray';
      const colorMap = {
        green: { border: 'border-green-300', bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
        yellow: { border: 'border-yellow-300', bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
        red: { border: 'border-red-300', bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
        gray: { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600' },
      };
      const c = colorMap[scoreColor];
      return (
        <div className={`space-y-${compact ? '3' : '4'}`}>
          <div className={`${compact ? 'p-3 rounded-lg' : 'p-4 rounded-xl'} border-2 border-gray-200 bg-gray-50`}>
            <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-500 mb-2`}>{t('你的回答：')}</p>
            <p className={`${compact ? 'text-sm' : 'text-base'} text-gray-700 whitespace-pre-wrap`}>{currentValue || t('（未作答）')}</p>
          </div>
          <div className={`${compact ? 'p-3 rounded-lg' : 'p-5 rounded-xl'} border-2 ${c.border} ${c.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${compact ? 'text-xs' : 'text-sm'} font-semibold ${c.text}`}>{t('AI 批改结果')}</p>
              {aiScore !== undefined && (
                <span className={`${compact ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'} rounded-full font-bold ${c.badge}`}>
                  {aiScore} {t('分')}
                </span>
              )}
            </div>
            {aiFeedback && (
              <p className={`${compact ? 'text-xs' : 'text-sm'} ${c.text} leading-relaxed whitespace-pre-wrap`}>{t(aiFeedback)}</p>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <textarea
      value={currentValue}
      onChange={(e) => onAnswer(question.id, e.target.value, false)}
      placeholder={t('请在此输入你的回答，尽量详细说明你的理解…')}
      disabled={disabled}
      className={`w-full ${compact ? 'h-24 p-2 text-sm rounded-lg border' : 'h-40 p-4 text-base rounded-xl border-2'} border-gray-200 focus:border-primary-500 focus:outline-none resize-none disabled:bg-gray-50 disabled:text-gray-400 transition-colors`}
    />
  );
}
