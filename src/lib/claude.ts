/**
 * Claude API — feedback analysis & course recommendation
 *
 * Calls the Anthropic Messages API with the employee's survey answers,
 * picks the most relevant course from the catalog, and returns a
 * personalised recommendation reason.
 *
 * API key: set EXPO_PUBLIC_ANTHROPIC_API_KEY in your .env file.
 * (Expo exposes EXPO_PUBLIC_* vars to the JS bundle at build time.)
 */

// ─── Course catalogue (used for both matching and result lookup) ───────────────

export interface CatalogCourse {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  totalModules: number;
  tags: string[];
  description: string;
}

export const COURSE_CATALOGUE: CatalogCourse[] = [
  {
    id: 'c1',
    title: 'ShiftUp: Step Into Leadership',
    thumbnail: 'https://shiftup-scorm.vercel.app/story_content/thumbnail.jpg',
    duration: '20 min',
    totalModules: 5,
    tags: ['leadership', 'management', 'team', 'delegation', 'promotion', 'new manager'],
    description: 'For new managers and frontline leaders stepping up from team member roles. Covers delegation, building trust, and motivating your team.',
  },
  {
    id: 'c2',
    title: 'Check the Label: Allergen Awareness',
    thumbnail: 'https://check-the-label-scorm.vercel.app/course-config/assets/images/02-allergens/2-1_IM_BG_Desktop.png',
    duration: '15 min',
    totalModules: 5,
    tags: ['food safety', 'allergens', 'health', 'compliance', 'hospitality', 'labels'],
    description: 'Identifying the 14 recognised food allergens, legal obligations, and keeping every customer safe.',
  },
  {
    id: 'c3',
    title: 'Setting the Tone: Manager Responsibilities',
    thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80',
    duration: '15 min',
    totalModules: 5,
    tags: ['management', 'expectations', 'accountability', 'leadership', 'team standards', 'communication'],
    description: 'Setting clear expectations and upholding team standards as a manager.',
  },
  {
    id: 'c4',
    title: 'Engaging Safely at the UN',
    thumbnail: 'https://engaging-safely-scorm.vercel.app/story_content/thumbnail.jpg',
    duration: '3 hr',
    totalModules: 5,
    tags: ['safety', 'international', 'compliance', 'digital security', 'events', 'travel'],
    description: 'Personal safety, digital security, and responsible participation at international events.',
  },
  {
    id: 'c5',
    title: 'Retail Resilience: Stress Toolkit',
    thumbnail: 'https://retail-stress-toolkit-scorm.vercel.app/story_content/thumbnail.jpg',
    duration: '5 min',
    totalModules: 4,
    tags: ['wellbeing', 'stress', 'resilience', 'mental health', 'self-care', 'retail'],
    description: 'Practical toolkit for managing stress on the shop floor in the moment.',
  },
  {
    id: 'c-safety',
    title: 'Workplace Safety Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
    duration: '15 min',
    totalModules: 5,
    tags: ['safety', 'procedures', 'policies', 'onboarding', 'compliance', 'workplace', 'documentation', 'hazard', 'emergency', 'protocols'],
    description: 'Key safety policies, required protocols, emergency procedures, and where to find official documentation — so you start your role with confidence.',
  },
];

// ─── Recommendation result ─────────────────────────────────────────────────────

export interface CourseRecommendation {
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  courseDuration: string;
  totalModules: number;
  reason: string;
}

// ─── API call ──────────────────────────────────────────────────────────────────

const SATISFACTION_LABELS: Record<string, string> = {
  very_satisfied:   'Very satisfied — the onboarding went well',
  satisfied:        'Satisfied — generally good, minor improvements needed',
  unsatisfied:      'Unsatisfied — some parts were unclear or missing',
  very_unsatisfied: 'Very unsatisfied — the onboarding was confusing or poorly supported',
};

function buildPrompt(q1Answer: string, feedbackText: string): string {
  const satisfaction = SATISFACTION_LABELS[q1Answer] ?? q1Answer;
  const feedback = feedbackText?.trim() || '(no written comments provided)';

  const courseList = COURSE_CATALOGUE.map(
    (c) => `- ID: "${c.id}" | "${c.title}" (${c.duration}) — ${c.description} [tags: ${c.tags.join(', ')}]`,
  ).join('\n');

  return `An employee just completed their company onboarding survey with the following responses:

Satisfaction level: ${satisfaction}
Written feedback: "${feedback}"

Based on their feedback, recommend the single most relevant training course from the list below. If the feedback mentions safety, procedures, or not knowing where to find information, prefer the safety course. If no written feedback, infer from satisfaction level.

Available courses:
${courseList}

Respond with ONLY a valid JSON object — no markdown fences, no explanation outside the JSON:
{
  "courseId": "<id of the best matching course>",
  "reason": "<2–3 sentences explaining specifically why this course was chosen based on the employee's own words>"
}`;
}

/**
 * Calls Claude claude-haiku, selects the best course, and returns a
 * personalised recommendation. Falls back gracefully if the API is
 * unavailable or the key is missing.
 */
export async function analyzeAndRecommend(
  q1Answer: string,
  feedbackText: string,
): Promise<CourseRecommendation> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

  // ── If no API key, do local keyword matching instead ──────────────────────
  if (!apiKey) {
    return localFallback(q1Answer, feedbackText);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5',
        max_tokens: 300,
        system:     'You are a learning experience AI. Always respond with valid JSON only — no markdown, no prose outside the JSON object.',
        messages:   [{ role: 'user', content: buildPrompt(q1Answer, feedbackText) }],
      }),
    });

    if (!response.ok) throw new Error(`API ${response.status}`);

    const data = await response.json();
    const raw  = (data.content?.[0]?.text ?? '').trim();

    // Strip accidental markdown fences
    const json = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '');
    const parsed: { courseId?: string; reason?: string } = JSON.parse(json);

    const courseId = parsed.courseId ?? 'c-safety';
    const matched  = COURSE_CATALOGUE.find((c) => c.id === courseId) ?? COURSE_CATALOGUE[COURSE_CATALOGUE.length - 1];

    return {
      courseId:        matched.id,
      courseTitle:     matched.title,
      courseThumbnail: matched.thumbnail,
      courseDuration:  matched.duration,
      totalModules:    matched.totalModules,
      reason:          parsed.reason ?? defaultReason(matched.title),
    };
  } catch (err) {
    console.warn('[claude] API error, falling back to local matching:', err);
    return localFallback(q1Answer, feedbackText);
  }
}

// ─── Local keyword-based fallback ─────────────────────────────────────────────

function localFallback(q1Answer: string, feedbackText: string): CourseRecommendation {
  const text = `${q1Answer} ${feedbackText}`.toLowerCase();

  let best = COURSE_CATALOGUE[COURSE_CATALOGUE.length - 1]; // default: safety
  let bestScore = 0;

  for (const course of COURSE_CATALOGUE) {
    const score = course.tags.reduce(
      (acc, tag) => acc + (text.includes(tag) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      best = course;
    }
  }

  return {
    courseId:        best.id,
    courseTitle:     best.title,
    courseThumbnail: best.thumbnail,
    courseDuration:  best.duration,
    totalModules:    best.totalModules,
    reason:          defaultReason(best.title),
  };
}

function defaultReason(title: string): string {
  return `Based on your survey responses, we've identified "${title}" as the most relevant course for you. It directly addresses the gaps raised in your feedback and will help you start your role with confidence.`;
}
