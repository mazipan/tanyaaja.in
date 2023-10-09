import { BASEURL } from '@/lib/api'

import { LogoSvg } from './LogoSvg'

export function UserOg({ slug, name }: { slug: string; name: string }) {
  return (
    <div
      tw="flex p-8 flex-col w-full h-full items-center justify-center rounded-3xl"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgb(249, 168, 212), rgb(216, 180, 254), rgb(129, 140, 248))',
      }}
    >
      <div tw="flex font-bold text-2xl mb-4">
        {BASEURL.replace('https://www.', '')}/p/{slug}
      </div>
      <div tw="flex flex-col justify-center text-center items-center w-full">
        <p tw="font-extrabold text-6xl tracking-tight">
          Sampaikan pertanyaan anonim ke saya
        </p>
        <p tw="text-2xl">({name})</p>
      </div>
      <div tw="flex mb-2 items-center justify-center mt-4 w-full">
        <LogoSvg />
      </div>
    </div>
  )
}
