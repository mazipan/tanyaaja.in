import { Metadata } from 'next'

import { Separator } from '@/components/ui/separator'
import { BASEURL } from '@/lib/api'
import { PrivacyContent } from '@/modules/KebijakanPage/PrivacyContent'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | TanyaAja',
  alternates: {
    canonical: `${BASEURL}/kebijakan-privasi`,
  },
  description:
    'Kebijakan privasi pengguna di aplikasi TanyaAja. Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
  openGraph: {
    description:
      'Kebijakan privasi pengguna di aplikasi TanyaAja. Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
    title: 'Kebijakan Privasi | TanyaAja',
  },
  twitter: {
    title: 'Kebijakan Privasi | TanyaAja',
    description:
      'Kebijakan privasi pengguna di aplikasi TanyaAja. Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
  },
}

export default async function PrivasiPage() {
  return (
    <main className="w-full container py-8">
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Kebijakan Privasi</h2>
        <p className="text-muted-foreground">
          Kebijakan privasi pengguna di aplikasi TanyaAja
        </p>
      </div>

      <Separator className="my-6" />

      <PrivacyContent />
    </main>
  )
}
