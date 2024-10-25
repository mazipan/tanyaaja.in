import AvatarCircles from '@/components/ui/avatar-circles'
import BlurIn from '@/components/ui/blur-in'
import HyperText from '@/components/ui/hyper-text'

export const StatistikSection = ({
  data,
}: {
  data: { usersCount: number; questionsCount: number }
}) => {
  return (
    <section className="container mx-auto max-w-[58rem] my-24 flex flex-col justify-center items-center gap-4">
      <BlurIn
        word="Statistik"
        className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center"
      />
      <p className="text-center text-md md:text-lg lg:text-xl text-muted-foreground">
        Statistik jumlah pengguna TanyaAja.in dan pertanyaan yang telah
        disampaikan
      </p>
      <h3 className="font-mono font-light text-xl md:text-2xl lg:text-3xl text-center mt-12">
        PENGGUNA TERDAFTAR
      </h3>
      <HyperText
        className="font-extrabold max-w-[85%] text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
        text={new Intl.NumberFormat('id-ID', {}).format(data?.usersCount | 0)}
      />
      <AvatarCircles
        numPeople={data?.usersCount | 0}
        avatarUrls={[
          // MZP
          'https://avatars.githubusercontent.com/u/7221389?v=4',
          // Noor
          'https://lh3.googleusercontent.com/a/ACg8ocICjgpJoJ8u_KAZ-ZPMCrwO_nvycRksRqCh_OFshXYu8vw=s96-c',
          // Yhy
          'https://lh3.googleusercontent.com/a/ACg8ocLX4auCplcF66my2LFGmbyQthNrE11jzd65hRHvSGP3VCo=s96-c',
          // Ez
          'https://lh3.googleusercontent.com/a/ACg8ocJ4J6qYehJLWKEfsFRRWivotSAp6-3UWidnRMwFqijlmVk=s96-c',
          // Pet
          'https://lh3.googleusercontent.com/a/ACg8ocKzxAoSDNILiV7JQZvum--38CPNzdGLrytcKGppell_ll1x=s96-c',
          // Thoni
          'https://lh3.googleusercontent.com/a/ACg8ocKz0yetq02GO9A6VFMWjyxrDoS81NPGhMm6POlbArymUUFm=s96-c',
        ]}
      />
      <h3 className="mt-12 font-mono font-light text-xl md:text-2xl lg:text-3xl text-center">
        JUMLAH PERTANYAAN
      </h3>
      <HyperText
        className="font-extrabold max-w-[85%] text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
        text={new Intl.NumberFormat('id-ID', {}).format(
          data?.questionsCount | 0,
        )}
      />
    </section>
  )
}
