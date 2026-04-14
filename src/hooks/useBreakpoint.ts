import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS, type Breakpoint } from '@/constants/breakpoints';

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();

  if (width >= BREAKPOINTS.DESKTOP) return 'desktop';
  if (width >= BREAKPOINTS.TABLET) return 'tablet';
  return 'mobile';
}
