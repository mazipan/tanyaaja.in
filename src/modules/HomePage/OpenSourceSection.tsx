import { Code2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const OpenSourceSection = () => {
  return (
    <section className="container mx-auto max-w-[58rem] my-24 flex flex-col justify-center items-center gap-4">
      <h2 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center">
        Kode Sumber Terbuka
      </h2>
      <p className="max-w-[85%] text-center text-md md:text-lg lg:text-xl text-muted-foreground">
        TanyaAja adalah aplikasi dengan kode sumber terbuka, kodenya bisa kamu
        lihat dengan gratis untuk kepentingan pembelajaran
      </p>
      <Button
        variant="outline"
        className="flex gap-2 items-center"
        size="lg"
        asChild
      >
        <a
          href="https://github.com/mazipan/tanyaaja"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Code2 className="w-6 h-6" />
          Lihat kode sumber
        </a>
      </Button>
    </section>
  )
}
