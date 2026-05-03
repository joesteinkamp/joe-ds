import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'joe-ds',
  description: 'A modern design system built on Base UI, Tailwind v4, and DESIGN.md tokens.',
};

export default function RootLayout({ children }: { children: ReactNode }): React.ReactNode {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
