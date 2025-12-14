import React, { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) =>
  <NextThemesProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>;
