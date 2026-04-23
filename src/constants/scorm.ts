/**
 * SCORM content — per-course Vercel deployments
 *
 * Each course has its own Vercel project so packages can be updated
 * independently. To add a new course:
 *   1. Extract the zip to /tmp/scorm-content/<CourseName>/
 *   2. Drop a vercel.json with CORS headers in that folder
 *   3. Run: cd /tmp/scorm-content/<CourseName> && vercel deploy --prod
 *   4. Add the courseId → launch URL entry below
 *
 * Re-deploy an existing course:
 *   cd /tmp/scorm-content/ShiftUp_Alpha   && vercel deploy --prod
 *   cd /tmp/scorm-content/CheckTheLabel   && vercel deploy --prod
 */

const SHIFTUP_URL       = 'https://shiftup-scorm.vercel.app';
const CHECK_LABEL_URL   = 'https://check-the-label-scorm.vercel.app';
const SETTING_TONE_URL  = 'https://setting-the-tone-scorm.vercel.app';

/**
 * Map of courseId → full SCORM launch URL.
 * courseIds match the mock data ids in (app)/index.tsx and learning.tsx.
 */
export const SCORM_LAUNCH_FILES: Record<string, string> = {
  c1: `${SHIFTUP_URL}/index_lms.html`,       // ShiftUp Alpha       — Food Safety: Hot Holding & Temps
  c2: `${CHECK_LABEL_URL}/index.html`,        // Check the Label     — Allergen Awareness
  c3: `${SETTING_TONE_URL}/launch.html`,      // Setting the Tone    — Manager Responsibilities (Elucidat)
  c4: `${SHIFTUP_URL}/index_lms.html`,        // placeholder — swap when content is ready
  c5: `${SHIFTUP_URL}/index_lms.html`,
  c6: `${SHIFTUP_URL}/index_lms.html`,
};

/** Returns the full SCORM launch URL for a given courseId */
export function getScormUrl(courseId: string): string {
  return SCORM_LAUNCH_FILES[courseId] ?? `${SHIFTUP_URL}/index_lms.html`;
}
