import { BASEURL } from '@/lib/api'

export function DefaultOg() {
  return (
    <div
      tw="flex p-8 flex-col w-full h-full items-center justify-center rounded-3xl"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgb(249, 168, 212), rgb(216, 180, 254), rgb(129, 140, 248))',
      }}
    >
      <div tw="flex flex-col justify-center items-center font-extrabold text-5xl tracking-tight w-full text-center">
        <p>Kumpulkan pertanyaan anonim dengan lebih mudah</p>
      </div>
      <div tw="flex mb-2 items-center justify-center mt-4 w-full font-bold text-2xl">
        {BASEURL.replace('https://www.', '')}
      </div>
    </div>
  )
}
