import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from "@/components/ui/toaster"
import { BASEURL } from '@/lib/api';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tanya secara anonim | TanyaAja',
  description: 'Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
  openGraph: {
    description: 'Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
    siteName: 'TanyaAja.in',
    title: 'Tanya secara anonim | TanyaAja',
    url: BASEURL,
    images: [{
      url: `${BASEURL}/api/og`
    }]
  },
  twitter: {
    title: 'Tanya secara anonim | TanyaAja',
    description: 'Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
    creator: '@Maz_Ipan',
    site: 'TanyaAja.in',
    images: [{
      url: `${BASEURL}/api/og`
    }]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main>
            <Header />
            <article className='min-h-screen'>
              {children}
            </article>
            <Footer />
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
