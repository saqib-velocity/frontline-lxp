export const BREAKPOINTS = {
  MOBILE: 0,
  TABLET: 768,
  DESKTOP: 1200,
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';
