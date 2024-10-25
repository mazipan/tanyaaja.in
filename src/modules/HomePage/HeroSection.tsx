import Image from 'next/image'
import Link from 'next/link'

import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import DotPattern from '@/components/ui/dot-pattern'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { cn } from '@/lib/utils'
import imagehero from '~/public/images/ai-asking-question.jpeg'
import logoImage from '~/public/logo/TanyaAja.svg'

export const HeroSection = () => {
  return (
    <section className="relative container flex flex-col md:flex-row">
      <div className="relative flex-1 flex flex-col gap-4 justify-center items-start p-8">
        <DotPattern
          className={cn(
            '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]',
          )}
        />
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
          Kumpulkan pertanyaan secara anonim dari siapa saja dengan mudah.
        </p>

        <div className="flex gap-8 mt-8 flex-col">
          <Link href="/account">
            <RainbowButton className="flex gap-2 items-center rounded-lg">
              Mulai dengan cepat
            </RainbowButton>
          </Link>
          <Button
            variant="outline"
            className="flex gap-2 items-center"
            size="lg"
            asChild
          >
            <Link href="/eksplor">
              Lihat pengguna terdaftar
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
