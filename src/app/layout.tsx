import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { BaseDialog } from '@/components/dialog/BaseDialog'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { BASEURL } from '@/lib/api'
import QueryProvider from '@/queries/QueryProvider'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tanya secara anonim | TanyaAja',
  description:
    'Kumpulkan berbagai pertanyaan dari siapa saja secara anonim melaui aplikasi TanyaAja. Mudah, gratis dan terjamin rahasia.',
  metadataBase: new URL(BASEURL),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    description:
      'Kumpulkan berbagai pertanyaan dari siapa saja secara anonim melaui aplikasi TanyaAja. Mudah, gratis dan terjamin rahasia.',
    siteName: 'TanyaAja.in',
    title: 'Tanya secara anonim | TanyaAja',
    url: BASEURL,
    images: [
      {
        url: `${BASEURL}/api/og?type=default`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tanya secara anonim | TanyaAja',
    description:
      'Kumpulkan berbagai pertanyaan dari siapa saja secara anonim melaui aplikasi TanyaAja. Mudah, gratis dan terjamin rahasia.',
    creator: '@Maz_Ipan',
    site: 'TanyaAja.in',
    images: [
      {
        url: `${BASEURL}/api/og?type=default`,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main>
              <Header />
              <article className="min-h-screen">{children}</article>
              <Footer />
            </main>
            <BaseDialog />
            <Toaster />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
        <Script id="sw-registration">
          {`
            const registerServiceWorker = async () => {
            if ("serviceWorker" in navigator) {
              try {
                const registration = await navigator
                  .serviceWorker
                  .register("/service-worker.js", {
                    scope: "/",
                  });

                if (registration.installing) {
                  console.debug("🟠 Installing service worker...");
                } else if (registration.waiting) {
                  console.debug("🟢 Service worker installed!");
                } else if (registration.active) {
                  console.debug("🔵 Service worker active!");
                }
              } catch (error) {
                console.error('🔴 SW registration failed.', error);
              }
            }
          }
          registerServiceWorker();
        `}
        </Script>
      </body>
    </html>
  )
}
