'use client';

import { useEffect } from 'react';
import { suppressDevMessages, logAppInfo } from '@/lib/dev-utils';

export function DevEnhancer() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Apply console enhancements
      suppressDevMessages();
      logAppInfo();
      
      // Add helpful global utilities for development
      if (typeof window !== 'undefined') {
        (window as any).clearConsole = () => console.clear();
        (window as any).debugMode = true;
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
}
