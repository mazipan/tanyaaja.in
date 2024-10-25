import DotPattern from '@/components/ui/dot-pattern'
import ShimmerButton from '@/components/ui/shimmer-button'
import TypingAnimation from '@/components/ui/typing-animation'
import { cn } from '@/lib/utils'

export const OpenSourceSection = () => {
  return (
    <section className="relative container mx-auto max-w-[58rem] py-16 flex flex-col justify-center items-center gap-4">
      <TypingAnimation
        text="Kode sumber terbuka"
        className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center"
      />
      <p className="max-w-[85%] text-center text-md md:text-lg lg:text-xl text-muted-foreground mb-8">
        TanyaAja adalah aplikasi dengan kode sumber terbuka, kodenya bisa kamu
        lihat dengan gratis untuk kepentingan pembelajaran
      </p>

      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]',
        )}
      />

      <a
        href="https://github.com/mazipan/tanyaaja"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ShimmerButton className="shadow-2xl">
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            Cek repository
          </span>
        </ShimmerButton>
      </a>
    </section>
  )
}
