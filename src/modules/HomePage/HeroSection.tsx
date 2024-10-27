import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import Meteors from '@/components/ui/meteors'
import { RainbowButton } from '@/components/ui/rainbow-button'
import WordPullUp from '@/components/ui/word-pull-up'
import imagehero from '~/public/images/13297294_5203332.svg'

export const HeroSection = () => {
  return (
    <section className="relative container flex flex-col md:flex-row">
      <div className="relative flex-1 flex flex-col gap-4 justify-center items-start p-8 overflow-hidden">
        <Meteors number={150} />

        <WordPullUp
          className="text-4xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem] text-left"
          words="Kumpulkan pertanyaan anonim dengan mudah."
        />

        <div className="flex gap-4 mt-8 flex-col">
          <Link href="/account">
            <RainbowButton className="rounded-lg">
              Mulai dengan cepat
            </RainbowButton>
          </Link>
          <Button variant="outline" size="lg" asChild>
            <Link href="/eksplor">Lihat dulu aja</Link>
          </Button>
        </div>
      </div>
      <div className="p-4 mx-auto">
        <Image
          src={imagehero}
          alt="Laki-laki dan perempuan yang sedang berdiskusi"
          className="rounded-3xl w-full max-w-[500px] h-auto md:h-[500px]"
        />
      </div>
    </section>
  )
}
