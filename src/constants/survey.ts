/**
 * Survey config types + mock data
 *
 * Designed to be fetched from a backend API — the SurveyConfig shape is what
 * you would receive from an endpoint like GET /api/surveys/:id.
 * Swap `COMPANY_ONBOARDING_SURVEY` with a real fetch call when the backend is ready.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuestionType = 'single_choice' | 'text';

export interface SingleChoiceOption {
  id: string;
  label: string;
  description?: string;
}

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  /** Badge shown above the question heading */
  tag?: {
    label: string;
    /** pale = light-green chip, filled = solid-green chip */
    variant: 'pale' | 'filled';
  };
  question: string;
  description?: string;
  /** Only for type === 'single_choice' */
  options?: SingleChoiceOption[];
  /** Only for type === 'text' */
  placeholder?: string;
  /** If true, the Continue/Submit button is always enabled */
  optional?: boolean;
}

export interface SurveyConfig {
  id: string;
  title: string;
  /** ISO 8601 date string — shown on the splash card */
  dueDate: string;
  estimatedMinutes: number;
  questions: SurveyQuestion[];
}

// ─── Mock data (replace with API call in production) ─────────────────────────

/** Returns tomorrow's date formatted as "DD Mon" (e.g. "25 Apr") */
function getTomorrowLabel(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'short' });
  return `${day} ${month}`;
}

export const COMPANY_ONBOARDING_SURVEY: SurveyConfig = {
  id: 'company-onboarding-survey',
  title: 'Company Onboarding Survey',
  dueDate: getTomorrowLabel(),
  estimatedMinutes: 1,
  questions: [
    {
      id: 'q1',
      type: 'single_choice',
      tag: { label: 'Quick check', variant: 'pale' },
      question: 'How satisfied are you with your onboarding experience so far?',
      description:
        'Your feedback helps us improve the onboarding process for future employees.',
      options: [
        {
          id: 'very_satisfied',
          label: 'Very satisfied',
          description: 'Everything was clear and well supported.',
        },
        {
          id: 'satisfied',
          label: 'Satisfied',
          description: 'Overall good, with a few minor improvements needed.',
        },
        {
          id: 'unsatisfied',
          label: 'Unsatisfied',
          description: 'Some parts were unclear or missing important information.',
        },
        {
          id: 'very_unsatisfied',
          label: 'Very unsatisfied',
          description: 'The onboarding experience was confusing or poorly supported.',
        },
      ],
    },
    {
      id: 'q2',
      type: 'text',
      tag: { label: 'Survey', variant: 'filled' },
      question: 'How can we improve our onboarding process? (optional)',
      description:
        'Your feedback helps us improve the onboarding process for future employees.',
      placeholder: 'Share your feedback',
      optional: true,
    },
  ],
};
