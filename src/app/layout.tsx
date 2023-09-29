import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { BASEURL } from '@/lib/api'

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main>
            <Header />
            <article className="min-h-screen">{children}</article>
            <Footer />
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
