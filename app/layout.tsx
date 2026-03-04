import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import AdminShortcut from '@/components/AdminShortcut';
import VisitorTracker from '@/components/VisitorTracker';
import { ThemeProvider } from '@/components/ThemeProvider';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { ToastProvider } from '@/components/providers/ToastProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Sanjarbek Otabekov | Dasturchi',
  description: 'Sanjarbek Otabekov - Zamonaviy va professional dasturchi portfoliosi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
            <AdminShortcut />
            <VisitorTracker />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
