import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { BASEURL } from '@/lib/api'
import { LoginButtonWithRedirect } from '@/modules/LoginPage/LoginButton'
import logoSvg from '~/public/logo/TanyaAja.svg'

export const metadata: Metadata = {
  title: 'Masuk atau Daftar TanyaAja',
  alternates: {
    canonical: `${BASEURL}/login`,
  },
  description:
    'Masuk atau Daftar akun TanyaAja. Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
  openGraph: {
    description:
      'Masuk atau Daftar akun TanyaAja. Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
    title: 'Masuk atau Daftar TanyaAja',
  },
  twitter: {
    title: 'Masuk atau Daftar TanyaAja',
    description:
      'Masuk atau Daftar akun TanyaAja. Kumpulkan berbagai pertanyaan dari siapa saja secara anonim',
  },
}

export default function Login() {
  return (
    <main className="flex flex-col gap-6 items-center px-4 py-24">
      <h1 className="text-3xl font-extrabold">Masuk atau Daftar</h1>
      <Card className="w-full md:w-[350px] min-h-[350px] flex flex-col justify-between items-center gap-6 py-4">
        <Link href="/" className="flex gap-2 items-center mt-4">
          <Image
            src={logoSvg}
            alt="Tanya Aja"
            width={50}
            height={41.9}
            className=""
          />
          <h2 className="font-extrabold text-2xl tracking-tight">TanyaAja</h2>
        </Link>

        <LoginButtonWithRedirect />

        <p className="text-xs text-center px-4">
          Dengan mengklik tombol di atas, berarti kamu setuju dengan{' '}
          <Link href="/ketentuan-layanan" className="underline">
            Ketentuan Layanan
          </Link>{' '}
          dan{' '}
          <Link href="/kebijakan-privasi" className="underline">
            Kebijakan Privasi
          </Link>{' '}
          kami
        </p>
      </Card>
    </main>
  )
}
