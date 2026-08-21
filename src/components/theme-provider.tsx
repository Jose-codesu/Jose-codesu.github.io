'use client';

import { ThemeProvider as NextThemes } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes
      attribute="class"
      defaultTheme="system"
      enableSystem
      // The theme is applied by a blocking inline script before paint, so there
      // is no flash. Disabling transitions on switch prevents every color on the
      // page from animating at once, which reads as lag rather than polish.
      disableTransitionOnChange
    >
      {children}
    </NextThemes>
  );
}
