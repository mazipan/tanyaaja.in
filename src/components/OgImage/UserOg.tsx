import { BASEURL } from '@/lib/api'

import { LogoSvg } from './LogoSvg'

export function UserOg({ slug }: { slug: string }) {
  return (
    <div tw="flex p-8 flex-col w-full h-full items-center justify-between bg-white">
      <div tw="flex text-blue-500 font-bold text-2xl">
        {BASEURL.replace('https://www.', '')}/p/{slug}
      </div>
      <div tw="flex flex-col justify-center items-center font-extrabold text-6xl tracking-tight w-full">
        <div tw="flex">
          <span>Tanyakan </span>
          <span tw="text-blue-500 ml-2 mr-2">apa aja</span>
        </div>
        <div tw="flex">
          <span>ke saya dengan </span>
          <span tw="text-blue-500 ml-2">anonim</span>
        </div>
      </div>
      <div tw="flex mb-2 items-center justify-center mt-10 w-full">
        <LogoSvg />
      </div>
    </div>
  )
}
