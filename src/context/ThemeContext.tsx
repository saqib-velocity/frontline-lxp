import React, { createContext, useContext, useState } from 'react';

// ─── Theme types ──────────────────────────────────────────────────────────────

export type BrandTheme = 'orange' | 'dark';

export interface ThemeTokens {
  id: BrandTheme;
  /** App header / welcome screen background */
  headerBg: string;
  /** Icon + text colour on the header */
  headerTint: string;
  /** Primary brand accent (buttons, active states, links) */
  brandPrimary: string;
  /** Slightly darker pressed state */
  brandDark: string;
  /** Loading screen background */
  loadingBg: string;
}

// ─── Theme definitions ────────────────────────────────────────────────────────

export const THEMES: Record<BrandTheme, ThemeTokens> = {
  orange: {
    id:           'orange',
    headerBg:     '#C24806',
    headerTint:   '#FFFFFF',
    brandPrimary: '#C24806',
    brandDark:    '#9A3805',
    loadingBg:    '#C24806',
  },
  dark: {
    id:           'dark',
    headerBg:     '#0F0F0F',
    headerTint:   '#FFFFFF',
    brandPrimary: '#0F0F0F',
    brandDark:    '#000000',
    loadingBg:    '#0F0F0F',
  },
};

export const THEME_META: Record<BrandTheme, { name: string; description: string }> = {
  orange: {
    name:        'King Wing Orange',
    description: 'Classic brand experience',
  },
  dark: {
    name:        'King Wing Dark',
    description: 'Premium dark edition',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme:    BrandTheme;
  tokens:   ThemeTokens;
  setTheme: (t: BrandTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:    'orange',
  tokens:   THEMES.orange,
  setTheme: () => {},
});

export function useAppTheme() {
  return useContext(ThemeContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<BrandTheme>('orange');

  return (
    <ThemeContext.Provider value={{ theme, tokens: THEMES[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
