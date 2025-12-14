import React, { ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from './QueryClientProvider';
import { AbilityProvider } from './AbilityProvider';
import { AuthProvider } from './AuthProvider';
import { ConfirmationProvider } from './ConfirmationProvider';
import { ThemeProvider } from './ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) =>
  <QueryClientProvider>
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AbilityProvider>
            <TooltipProvider>
              <ConfirmationProvider>
                {children}
              </ConfirmationProvider>
            </TooltipProvider>
          </AbilityProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  </QueryClientProvider>;
