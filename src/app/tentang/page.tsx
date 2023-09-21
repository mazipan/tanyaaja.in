/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'

import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Infomasi Mengenai TanyaAja',
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

      <div className="w-full flex flex-col gap-4">
        <p className="mb-4">
          <b>TanyaAja</b> merupakan platform untuk kalian bisa gunakan untuk
          mengumpulkan pertanyaan dari teman atau siapapun secara anonim. Tidak
          ada satupun atribut yang bisa menunjukkan siapa yang mengajukan
          pertanyaan tersebut, sehingga privasi dari orang yang bertanya lebih
          terjamin. <b>TanyaAja</b> tidak menyediakan tempat untuk menjawab
          pertanyaan-pertanyaan yang disampaikan, karenanya biasanya kalian bisa
          membagikan ke sosial media dan menjawab pertanyaan tersebut di sana.
        </p>

        <p className="mb-4">
          <b>TanyaAja</b> merupakan projek dengan kode sumber terbuka dan bisa
          dipelajari di{' '}
          <a
            href="https://github.com/mazipan/tanyaaja"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            github.com/mazipan/tanyaaja
          </a>
          , kalian bebas mempelajari atau bahkan mendeploy untuk kepentingan
          kalian sendiri, namun tidak disarankan bila untuk kepentingan
          komersial.
        </p>

        <Card className="mb-4 p-4 flex justify-between items-center">
          <a
            href="https://github.com/mazipan/tanyaaja"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            <h3 className="text-xl font-bold tracking-tight">
              mazipan/TanyaAja
            </h3>
          </a>
          <img
            src="https://img.shields.io/github/stars/mazipan/tanyaaja?style=social"
            alt="Github Star"
            loading="lazy"
          />
        </Card>

        <p className="mb-4">
          Untuk terus mendukung <b>TanyaAja</b>, kalian bisa mengirimkan dana
          untuk membeli kopi melalui{' '}
          <a
            href="https://mazipan.space/support"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            laman donasi
          </a>
        </p>

        <p className="mb-4">
          Pertanyaan tentang platform <b>TanyaAja</b>, dapat ditujukan ke
          tanyaajaapp@gmail.com
        </p>

        <p className="mb-4">
          <small>
            <i>Terakhir diperbarui pada 18 September 2023</i>
          </small>
        </p>
      </div>
    </main>
  )
}
