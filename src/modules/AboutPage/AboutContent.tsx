'use client'

import { useEffect } from 'react'

import { Card } from '@/components/ui/card'
import { trackEvent } from '@/lib/firebase'

export const AboutContent = () => {
  useEffect(() => {
    trackEvent('view about page')
  }, [])

  return (
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
        kalian sendiri, namun tidak disarankan bila untuk kepentingan komersial.
      </p>

      <Card className="mb-4 p-4 flex justify-between items-center">
        <a
          href="https://github.com/mazipan/tanyaaja"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          <h3 className="text-xl font-bold tracking-tight">mazipan/TanyaAja</h3>
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
  )
}
