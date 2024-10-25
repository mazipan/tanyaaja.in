import GradualSpacing from '@/components/ui/gradual-spacing'
import ShimmerButton from '@/components/ui/shimmer-button'

export const OpenSourceSection = () => {
  return (
    <section className="container mx-auto max-w-[58rem] my-24 flex flex-col justify-center items-center gap-4">
      <GradualSpacing
        text="Kode sumber terbuka"
        className="font-display font-extrabold text-4xl -tracking-widest sm:text-5xl md:text-6xl lg:text-7xl md:leading-[5rem] text-center"
      />
      <p className="max-w-[85%] text-center text-md md:text-lg lg:text-xl text-muted-foreground mb-8">
        TanyaAja adalah aplikasi dengan kode sumber terbuka, kodenya bisa kamu
        lihat dengan gratis untuk kepentingan pembelajaran
      </p>

      <a
        href="https://github.com/mazipan/tanyaaja"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ShimmerButton className="shadow-2xl">
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            Lihat kode sumber
          </span>
        </ShimmerButton>
      </a>
    </section>
  )
}
