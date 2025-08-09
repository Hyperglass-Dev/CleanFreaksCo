
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppWrapper } from '@/components/AppWrapper';
import { Toaster } from '@/components/ui/toaster';
import { DevEnhancer } from '@/components/dev-enhancer';

export const metadata: Metadata = {
  title: 'Clean Freaks Co',
  description: 'Professional cleaning services management',
  manifest: '/manifest.json',
  icons: {
    icon: '/brandings/cleanfreaksco.png',
    apple: '/brandings/cleanfreaksco.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E6E6FA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
        
        {/* Google Maps performance optimization */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.gstatic.com" />
        
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Clean Freaks Co" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="font-body">
        <DevEnhancer />
        <AuthProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
