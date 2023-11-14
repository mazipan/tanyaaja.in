export const StatistikSection = ({
  data,
}: {
  data: { usersCount: number; questionsCount: number }
}) => {
  return (
    <section className="container mx-auto max-w-[58rem] my-24 flex flex-col justify-center items-center gap-4">
      <h2 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center">
        Statistik
      </h2>
      <h3 className="font-light text-xl md:text-2xl lg:text-3xl text-center mt-4">
        Pengguna Terdaftar
      </h3>
      <div className="font-extrabold max-w-[85%] text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        {new Intl.NumberFormat('id-ID', {}).format(data?.usersCount | 0)}
      </div>
      <h3 className="font-light text-xl md:text-2xl lg:text-3xl text-center">
        Pertanyaan Terdaftar
      </h3>
      <div className="font-extrabold max-w-[85%] text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        {new Intl.NumberFormat('id-ID', {}).format(data?.questionsCount | 0)}
      </div>
    </section>
  )
}
