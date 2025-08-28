"use client";

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { useEffect } from 'react';
import { validateEnvironmentVariablesOnStartup } from '@/lib/env-validation';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Validate environment variables on client-side startup
    if (typeof window !== 'undefined') {
      validateEnvironmentVariablesOnStartup();
    }
  }, []);

  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={false}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
} 