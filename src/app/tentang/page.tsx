/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'

import { Separator } from '@/components/ui/separator'
import { BASEURL } from '@/lib/api'
import { AboutContent } from '@/modules/AboutPage/AboutContent'

export const metadata: Metadata = {
  title: 'Infomasi Mengenai TanyaAja',
  alternates: {
    canonical: `${BASEURL}/tentang`,
  },
  description:
    'Informasi dasar mengenai aplikasi TanyaAja. Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
  openGraph: {
    description:
      'Informasi dasar mengenai aplikasi TanyaAja. Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
    title: 'Infomasi Mengenai TanyaAja',
  },
  twitter: {
    title: 'Infomasi Mengenai TanyaAja',
    description:
      'Informasi dasar mengenai aplikasi TanyaAja. Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
  },
}

export default async function AboutPage() {
  return (
    <main className="w-full container py-8">
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Tentang TanyaAja</h2>
        <p className="text-muted-foreground">
          Informasi dasar mengenai platform TanyaAja
        </p>
      </div>

      <Separator className="my-6" />

      <AboutContent />
    </main>
  )
}
