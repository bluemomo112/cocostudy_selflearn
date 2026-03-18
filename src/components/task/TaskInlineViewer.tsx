'use client';

import { useState, useEffect } from 'react';
import { Maximize2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Lightbulb, Shuffle, Loader2 } from 'lucide-react';
import { Task, TaskQuestion } from '../../types/shared-context';
import { useLanguage } from '../../contexts/LanguageContext';
import { getQuestionTypeLabel } from './QuestionRenderer';
import RichContent from './RichContent';
import { QuickResultData } from './taskTypes';

interface TaskInlineViewerProps {
  task: Task;
  mode: 'doing' | 'explaining';
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string | string[]>;
  quickResult?: QuickResultData | null;
  explainQuestion?: TaskQuestion | null;
  onFullscreen: () => void;
  onBack: () => void;
  onPrevQuestion?: () => void;
  onNextQuestion?: () => void;
  onExplainQuestion?: (question: TaskQuestion, userAnswer: string | string[], correctAnswer: string | string[]) => void;
  onGenerateVariant?: (question: TaskQuestion) => void;
}

export default function TaskInlineViewer({
  task, mode, currentQuestionIndex, selectedAnswers,
  quickResult, explainQuestion, onFullscreen, onBack,
  onPrevQuestion, onNextQuestion, onExplainQuestion, onGenerateVariant,
}: TaskInlineViewerProps) {
  const { t } = useLanguage();
  const questions = task.questions || [];
  const totalQuestions = questions.length;
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setShowSummary(false);
  }, [explainQuestion]);

  const activeQuestion = explainQuestion ?? questions[currentQuestionIndex] ?? questions[0];
  const currentIdx = activeQuestion ? questions.findIndex(q => q.id === activeQuestion.id) : 0;

  const detail = quickResult?.details.find(d => d.questionId === activeQuestion?.id);
  const isCorrect = detail?.correct ?? false;
  const userAnswer = detail?.userAnswer || (activeQuestion ? selectedAnswers[activeQuestion.id] : '') || '';
  const correctAnswer = detail?.correctAnswer || activeQuestion?.answer || '';
  const isShortAnswer = activeQuestion?.type === 'short_answer';
  const gradingStatus = detail?.gradingStatus;

  // 所有题目是否全部批改完成
  const allGraded = quickResult
    ? quickResult.details.every(d => !d.gradingStatus || d.gradingStatus === 'instant' || d.gradingStatus === 'graded')
    : false;

  if (showSummary && quickResult) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm">
            <ChevronLeft size={16} />{t('返回')}
          </button>
          <span className="text-xs text-gray-500 font-medium">{t('AI 总结')}</span>
          <button onClick={onFullscreen} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title={t('全屏')}>
            <Maximize2 size={14} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="text-center space-y-1">
            <div className={`text-3xl font-bold ${
              quickResult.allCorrect ? 'text-green-600' :
              quickResult.correctCount >= quickResult.totalCount / 2 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {quickResult.correctCount} / {quickResult.totalCount}
            </div>
            <div className="text-xs text-gray-500">
              {quickResult.allCorrect ? t('全部答对！') :
               quickResult.correctCount === 0 ? t('继续加油！') :
               t('继续练习，会更好')}
            </div>
          </div>
          <div className="space-y-2">
            {questions.map((q, i) => {
              const d = quickResult.details.find(det => det.questionId === q.id);
              const isSubjective = q.type === 'short_answer';
              const dGradingStatus = d?.gradingStatus;
              const isGrading = dGradingStatus === 'grading';
              const isGraded = dGradingStatus === 'graded';
              const scoreOk = isGraded && d?.aiScore !== undefined && d.aiScore >= 60;
              const borderCls = isSubjective
                ? (isGrading ? 'border-blue-200 bg-blue-50' : isGraded ? (scoreOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-gray-200 bg-gray-50')
                : (d?.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50');
              const dotCls = isSubjective
                ? (isGrading ? 'bg-blue-400' : isGraded ? (scoreOk ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-400')
                : (d?.correct ? 'bg-green-500' : 'bg-red-500');
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setShowSummary(false);
                    if (onExplainQuestion) {
                      onExplainQuestion(q, d?.userAnswer || '', d?.correctAnswer || '');
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-left flex items-center gap-2 hover:opacity-80 transition-opacity ${borderCls}`}
                >
                  <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${dotCls}`}>
                    {isGrading ? <Loader2 size={10} className="animate-spin" /> : i + 1}
                  </span>
                  <span className="text-xs text-gray-700 flex-1 line-clamp-1">{q.content}</span>
                  {isSubjective
                    ? (isGrading
                        ? <Loader2 size={12} className="text-blue-400 flex-shrink-0 animate-spin" />
                        : isGraded
                          ? (scoreOk ? <CheckCircle size={12} className="text-green-500 flex-shrink-0" /> : <XCircle size={12} className="text-red-500 flex-shrink-0" />)
                          : null)
                    : (d?.correct
                        ? <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                        : <XCircle size={12} className="text-red-500 flex-shrink-0" />)
                  }
                  {isSubjective && isGraded && d?.aiScore !== undefined && (
                    <span className={`text-xs font-bold flex-shrink-0 ${scoreOk ? 'text-green-600' : 'text-red-600'}`}>{d.aiScore}分</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="px-3 py-2.5 border-t border-gray-200 bg-white flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowSummary(false)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 flex items-center gap-1"
          >
            <ChevronLeft size={14} />{t('上一页')}
          </button>
          <div className="flex-1 text-center text-xs text-gray-400">{t('AI 总结')}</div>
          <span className="px-3 py-2 opacity-30 text-xs flex items-center gap-1 cursor-not-allowed">
            {t('下一页')}<ChevronRight size={14} />
          </span>
        </div>
      </div>
    );
  }

  if (!activeQuestion) return null;

  const isLastQuestion = currentIdx >= totalQuestions - 1;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm">
          <ChevronLeft size={16} />{t('返回')}
        </button>
        <span className="text-xs text-gray-500 font-medium">{t('AI 讲解中')}</span>
        <button onClick={onFullscreen} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title={t('全屏')}>
          <Maximize2 size={14} className="text-gray-500" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            detail
              ? (isShortAnswer
                  ? (gradingStatus === 'grading' ? 'bg-blue-400' : gradingStatus === 'graded' ? (detail.aiScore !== undefined && detail.aiScore >= 60 ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-400')
                  : (isCorrect ? 'bg-green-500' : 'bg-red-500'))
              : 'bg-gray-400'
          }`}>
            {detail
              ? (isShortAnswer
                  ? (gradingStatus === 'grading' ? <Loader2 size={10} className="animate-spin" /> : currentIdx + 1)
                  : (isCorrect ? '✓' : '✗'))
              : currentIdx + 1}
          </span>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            {getQuestionTypeLabel(activeQuestion.type, t)}
          </span>
          {isShortAnswer && gradingStatus === 'grading' && (
            <span className="text-xs text-blue-500 flex items-center gap-1">
              <Loader2 size={10} className="animate-spin" />{t('批改中…')}
            </span>
          )}
          {isShortAnswer && gradingStatus === 'graded' && detail?.aiScore !== undefined && (
            <span className={`text-xs font-semibold ${detail.aiScore >= 60 ? 'text-green-600' : 'text-red-600'}`}>
              {detail.aiScore} {t('分')}
            </span>
          )}
          <span className="text-xs text-gray-400 ml-auto">{currentIdx + 1} / {totalQuestions}</span>
        </div>
        <div className="text-sm font-medium text-gray-900 leading-relaxed">
          <RichContent content={activeQuestion.content} />
        </div>
        {/* 简答题：显示用户回答 + 批改状态 */}
        {isShortAnswer && detail && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 mb-1">{t('你的回答：')}</p>
              <p className="text-xs text-gray-700 whitespace-pre-wrap">{(userAnswer as string) || t('（未作答）')}</p>
            </div>
            {gradingStatus === 'grading' && (
              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 flex items-center gap-2">
                <Loader2 size={14} className="text-blue-500 animate-spin flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-blue-700">{t('正在批改中…')}</p>
                  <p className="text-xs text-blue-500">{t('AI 正在认真阅读你的回答，请稍候')}</p>
                </div>
              </div>
            )}
            {gradingStatus === 'graded' && detail.aiFeedback && (
              <div className={`p-3 rounded-lg border ${
                detail.aiScore !== undefined && detail.aiScore >= 80 ? 'border-green-200 bg-green-50'
                : detail.aiScore !== undefined && detail.aiScore >= 60 ? 'border-yellow-200 bg-yellow-50'
                : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-700">{t('AI 批改结果')}</p>
                  {detail.aiScore !== undefined && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      detail.aiScore >= 80 ? 'bg-green-100 text-green-700'
                      : detail.aiScore >= 60 ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                    }`}>{detail.aiScore} {t('分')}</span>
                  )}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{detail.aiFeedback}</p>
              </div>
            )}
          </div>
        )}
        {/* 客观题：选项展示 */}
        {!isShortAnswer && activeQuestion.options && (
          <div className="space-y-2">
            {activeQuestion.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isUserAnswer = Array.isArray(userAnswer) ? userAnswer.includes(letter) : userAnswer === letter;
              const isCorrectAnswer = Array.isArray(correctAnswer) ? correctAnswer.includes(letter) : correctAnswer === letter;
              return (
                <div key={i} className={`px-3 py-2 rounded-lg text-xs border ${
                  detail ? (
                    isCorrectAnswer ? 'border-green-300 bg-green-50' :
                    isUserAnswer ? 'border-red-300 bg-red-50' :
                    'border-gray-200 bg-white'
                  ) : 'border-gray-200 bg-white'
                }`}>
                  <span className="font-medium mr-2">{letter}.</span>
                  {opt}
                  {detail && isCorrectAnswer && <CheckCircle size={12} className="inline ml-1 text-green-500" />}
                  {detail && isUserAnswer && !isCorrectAnswer && <XCircle size={12} className="inline ml-1 text-red-500" />}
                </div>
              );
            })}
          </div>
        )}
        {!isShortAnswer && (detail?.explanation || activeQuestion.explanation) && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs font-semibold text-blue-800 mb-1">{t('解析')}</div>
            <div className="text-xs text-blue-900 leading-relaxed">
              <RichContent content={detail?.explanation || activeQuestion.explanation || ''} />
            </div>
          </div>
        )}
      </div>

      <div className="px-3 py-2.5 border-t border-gray-200 bg-white flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onPrevQuestion}
          disabled={currentIdx <= 0}
          className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <ChevronLeft size={14} />{t('上一题')}
        </button>
        <div className="flex-1 flex gap-2">
          {onExplainQuestion && (
            <button
              onClick={() => onExplainQuestion(activeQuestion, userAnswer, correctAnswer)}
              className="flex-1 px-3 py-2 rounded-lg bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium hover:bg-primary-100 flex items-center justify-center gap-1"
            >
              <Lightbulb size={14} />{t('详细解释')}
            </button>
          )}
          {!isCorrect && detail && onGenerateVariant && (
            <button
              onClick={() => onGenerateVariant(activeQuestion)}
              className="flex-1 px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-medium hover:bg-orange-100 flex items-center justify-center gap-1"
            >
              <Shuffle size={14} />{t('变种题')}
            </button>
          )}
        </div>
        <button
          onClick={() => {
            if (isLastQuestion && quickResult && allGraded) {
              setShowSummary(true);
            } else {
              onNextQuestion?.();
            }
          }}
          disabled={isLastQuestion ? (!quickResult || !allGraded) : false}
          className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1 ${
            isLastQuestion && quickResult && allGraded
              ? 'bg-green-600 text-white hover:bg-green-700'
              : isLastQuestion && quickResult && !allGraded
                ? 'bg-blue-100 text-blue-400 cursor-not-allowed flex items-center gap-1'
                : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-30 disabled:cursor-not-allowed'
          }`}
        >
          {isLastQuestion && quickResult && !allGraded
            ? <><Loader2 size={12} className="animate-spin" />{t('批改中…')}</>
            : isLastQuestion && quickResult
              ? t('查看总结')
              : t('下一题')}
          {!(isLastQuestion && quickResult && !allGraded) && <ChevronRight size={14} />}
        </button>
      </div>
    </div>
  );
}
