import { Metadata } from 'next'

import { Separator } from '@/components/ui/separator'
import { BASEURL } from '@/lib/api'
import ContentPublicUserList from '@/modules/EskplorPage/ContentPublicUserList'

export const metadata: Metadata = {
  title: 'Eksplor Pengguna di TanyaAja',
  alternates: {
    canonical: `${BASEURL}/eksplor`,
  },
  description: 'Eksplor Pengguna di TanyaAja dan mulai bertanya dengan anonim',
  openGraph: {
    description:
      'Eksplor Pengguna di TanyaAja dan mulai bertanya dengan anonim',
    title: 'Eksplor Pengguna di TanyaAja',
  },
  twitter: {
    title: 'Eksplor Pengguna di TanyaAja',
    description:
      'Eksplor Pengguna di TanyaAja dan mulai bertanya dengan anonim',
  },
}

export default function EksplorPage() {
  return (
    <main className="w-full container py-8">
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Eksplor pengguna</h2>
        <p className="text-muted-foreground">
          Kamu bisa mencari dan mulai bertanya pada pengguna yang sudah
          memberikan ijin untuk ditampilkan di laman ini
        </p>
      </div>

      <Separator className="my-6" />

      <ContentPublicUserList />
    </main>
  )
}
