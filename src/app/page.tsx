'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  ArrowRight,
  Box,
  Code2,
  Hand,
  Link as LinkIcon,
  ScrollText,
  Search,
  Unlock,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getUserCount } from '@/lib/api'
import imagehero from '~/public/images/pexels-rdne-stock-project-5756742.jpg'
import logoImage from '~/public/logo/TanyaAja.svg'

export default function Home() {
  // Stores registered users count
  const [userCount, setUserCount] = useState('0')

  useEffect(() => {
    async function fetchUserCount() {
      const countFromCache = localStorage.getItem('registeredUsersCount')
      if (countFromCache) {
        // Use cached count
        setUserCount(countFromCache)
      } else {
        // Call api to get fresh count
        const users = await getUserCount()
        const count = users['data'].toString()
        localStorage.setItem('registeredUsersCount', count)
        setUserCount(count)
      }
    }
    fetchUserCount()
  }, [userCount])

  return (
    <main className="">
      <section className="container flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col gap-4 justify-center items-start p-8">
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
            Kumpulkan pertanyaan secara anonim dari siapa saja dengan mudah
          </p>
          <p className="text-md md:text-lg lg:text-xl text-muted-foreground">
            Total Pengguna Terdaftar: {userCount}
          </p>

          <div className="w-full flex gap-2 mt-8 flex-col xl:flex-row">
            <Button className="flex gap-2 items-center" size="lg" asChild>
              <Link href="/account">
                Mulai dengan cepat
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="flex gap-2 items-center"
              size="lg"
              asChild
            >
              <Link href="/eksplor">
                Eksplor dulu
                <Search className="w-6 h-6" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="p-4">
          <Image
            src={imagehero}
            alt="Laki-laki sedang mengacungkan tangan"
            className="rounded-3xl"
          />
        </div>
      </section>
      <section className="container mx-auto mt-24 mb-16 flex flex-col justify-center items-center gap-4">
        <h2 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center">
          Fitur
        </h2>
        <p className="text-center text-md md:text-lg lg:text-xl text-muted-foreground">
          Berbagai fitur yang bisa didapatkan dari platform TanyaAja
        </p>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-8">
          <Card>
            <CardHeader>
              <Zap className="w-14 h-14 mb-4" />
              <CardTitle>Gratis Tanpa Iklan</CardTitle>
              <CardDescription>
                Bisa digunakan secara gratis tanpa gangguan iklan
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <LinkIcon className="w-14 h-14 mb-4" />
              <CardTitle>Mudah Dibagikan</CardTitle>
              <CardDescription>
                Kamu bisa membagikan laman publik dan pertanyaan kepada siapa
                saja yang diinginkan dengan cepat
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Hand className="w-14 h-14 mb-4" />
              <CardTitle>Kontrol Penuh</CardTitle>
              <CardDescription>
                Kamu bisa menentukan apakah sebuah pertanyaan bisa dilihat orang
                lain atau tidak, bisa memilih untuk tidak dilihat di laman
                eksplor, bisa menghapus akun seutuhnya
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ScrollText className="w-14 h-14 mb-4" />
              <CardTitle>Baca dan Buang</CardTitle>
              <CardDescription>
                Tidak perlu lama-lama menyimpan pertanyaan, setelah dibaca kami
                akan menghapus data pertanyaan kamu seutuhnya
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Unlock className="w-14 h-14 mb-4" />
              <CardTitle>Otentikasi Mudah</CardTitle>
              <CardDescription>
                Tidak perlu membuat dan mengingat password baru, cukup login
                dengan akun Google
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Box className="w-14 h-14 mb-4" />
              <CardTitle>Kode Sumber Terbuka</CardTitle>
              <CardDescription>
                Penasaran bagaimana cara kerjanya? Langsung saja cek apa yang
                dilakukan di balik layar dengan melihat langsung kode sumbernya
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
      <section className="container mx-auto max-w-[58rem] my-24 flex flex-col justify-center items-center gap-4">
        <h2 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center">
          Kode Sumber Terbuka
        </h2>
        <p className="max-w-[85%] text-center text-md md:text-lg lg:text-xl text-muted-foreground">
          TanyaAja adalah aplikasi dengan kode sumber terbuka yang didukung pula
          dengan banyak pustaka kode sumber terbuka.
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
    </main>
  )
}
