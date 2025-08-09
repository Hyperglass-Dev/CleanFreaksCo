// Development utilities to improve console output and debugging

export const suppressDevMessages = () => {
  if (process.env.NODE_ENV === 'development') {
    // Suppress Fast Refresh NaN messages 
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      if (
        message.includes('[Fast Refresh] done in NaNms') ||
        message.includes('Download the React DevTools') ||
        message.includes('react-dom-client.development.js')
      ) {
        return; // Suppress these messages
      }
      originalConsoleWarn.apply(console, args);
    };

    // Suppress specific Google Maps performance warnings that we've already optimized
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('Google Maps JavaScript API has been loaded directly')) {
        return; // We've already optimized the loading
      }
      originalConsoleLog.apply(console, args);
    };
  }
};

export const logAppInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '%c🧹 Clean Freaks Co Dashboard',
      'color: #800000; font-size: 16px; font-weight: bold;'
    );
    console.log(
      '%c✨ Development Mode | Built with Next.js & Firebase',
      'color: #E6E6FA; font-size: 12px;'
    );
  }
};
