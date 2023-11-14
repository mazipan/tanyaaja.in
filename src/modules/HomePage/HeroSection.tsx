import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import imagehero from '~/public/images/ai-asking-question.jpeg'
import logoImage from '~/public/logo/TanyaAja.svg'

export const HeroSection = () => {
  return (
    <section className="container flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col gap-4 justify-center items-start p-8">
        <Image
          src={logoImage}
          alt="Simbol tanda tanya"
          width={100}
          height={83.8}
        />
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          TanyaAja
        </h1>
        <p className="text-md md:text-lg lg:text-xl text-muted-foreground">
          Kumpulkan pertanyaan secara anonim dari siapa saja dengan mudah
        </p>

        <div className="w-full flex gap-2 mt-8 flex-col xl:flex-row">
          <Button className="flex gap-2 items-center" size="lg" asChild>
            <Link href="/account">
              Mulai dengan cepat
              <ArrowRight className="w-6 h-6" />
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex gap-2 items-center"
            size="lg"
            asChild
          >
            <Link href="/eksplor">
              Eksplor dulu
              <Search className="w-6 h-6" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="p-4 mx-auto">
        <Image
          src={imagehero}
          alt="Laki-laki dan perempuan yang sedang berdiskusi"
          className="rounded-3xl w-full max-w-[500px]"
        />
      </div>
    </section>
  )
}
