'use client';

import { QuestionProps } from './taskTypes';
import SingleChoiceQuestion from './questions/SingleChoiceQuestion';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import TrueFalseQuestion from './questions/TrueFalseQuestion';
import FillInBlankQuestion from './questions/FillInBlankQuestion';
import ShortAnswerQuestion from './questions/ShortAnswerQuestion';
import { useLanguage } from '../../contexts/LanguageContext';

interface ExtendedQuestionProps extends QuestionProps {
  gradingStatus?: 'instant' | 'grading' | 'graded';
  aiScore?: number;
  aiFeedback?: string;
}

export default function QuestionRenderer(props: ExtendedQuestionProps) {
  const { t } = useLanguage();
  switch (props.question.type) {
    case 'single_choice':
      return <SingleChoiceQuestion {...props} />;
    case 'multiple_choice':
      return <MultipleChoiceQuestion {...props} />;
    case 'true_false':
      return <TrueFalseQuestion {...props} />;
    case 'fill_in_blank':
      return <FillInBlankQuestion {...props} />;
    case 'short_answer':
      return <ShortAnswerQuestion {...props} />;
    default:
      return <SingleChoiceQuestion {...props} />;
  }
}

// 题型标签文本
export function getQuestionTypeLabel(type: string, t: (s: string) => string): string {
  switch (type) {
    case 'single_choice': return t('单选题');
    case 'multiple_choice': return t('多选题');
    case 'true_false': return t('判断题');
    case 'fill_in_blank': return t('填空题');
    case 'short_answer': return t('简答题');
    default: return t('选择题');
  }
}
