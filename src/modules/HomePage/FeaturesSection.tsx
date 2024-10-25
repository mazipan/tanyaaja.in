import {
  Box,
  Hand,
  Link as LinkIcon,
  ScrollText,
  Unlock,
  Zap,
} from 'lucide-react'

import { BorderBeam } from '@/components/ui/border-beam'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MagicCard } from '@/components/ui/magic-card'
import SparklesText from '@/components/ui/sparkles-text'

export const FeatureSection = () => {
  return (
    <section className="container mx-auto mt-24 mb-16 flex flex-col justify-center items-center gap-4">
      <SparklesText
        text="Fitur"
        className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center"
      />
      <p className="text-center text-md md:text-lg lg:text-xl text-muted-foreground">
        Berbagai fitur yang bisa didapatkan dari platform TanyaAja
      </p>
      <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-8">
        <Card className="relative">
          <BorderBeam />
          <CardHeader>
            <Zap className="w-14 h-14 mb-4 text-yellow-300" />
            <CardTitle>Gratis Tanpa Iklan</CardTitle>
            <CardDescription>
              Bisa digunakan secara gratis tanpa gangguan iklan
            </CardDescription>
          </CardHeader>
        </Card>
        <MagicCard className="relative">
          <CardHeader>
            <LinkIcon className="w-14 h-14 mb-4" />
            <CardTitle>Mudah Dibagikan</CardTitle>
            <CardDescription>
              Kamu bisa membagikan laman publik dan pertanyaan kepada siapa saja
              yang diinginkan dengan cepat
            </CardDescription>
          </CardHeader>
        </MagicCard>
        <Card className="relative">
          <BorderBeam />
          <CardHeader>
            <Hand className="w-14 h-14 mb-4 text-green-500" />
            <CardTitle>Kontrol Penuh</CardTitle>
            <CardDescription>
              Kamu bisa menentukan apakah sebuah pertanyaan bisa dilihat orang
              lain atau tidak, bisa memilih untuk tidak dilihat di laman
              eksplor, bisa menghapus akun seutuhnya
            </CardDescription>
          </CardHeader>
        </Card>
        <MagicCard className="relative">
          <CardHeader>
            <ScrollText className="w-14 h-14 mb-4" />
            <CardTitle>Baca dan Buang</CardTitle>
            <CardDescription>
              Tidak perlu lama-lama menyimpan pertanyaan, setelah dibaca kami
              akan menghapus data pertanyaan kamu seutuhnya
            </CardDescription>
          </CardHeader>
        </MagicCard>
        <Card className="relative">
          <BorderBeam />
          <CardHeader>
            <Unlock className="w-14 h-14 mb-4 text-red-500" />
            <CardTitle>Otentikasi Mudah</CardTitle>
            <CardDescription>
              Tidak perlu membuat dan mengingat password baru, cukup login
              dengan akun Google
            </CardDescription>
          </CardHeader>
        </Card>
        <MagicCard className="relative">
          <CardHeader>
            <Box className="w-14 h-14 mb-4" />
            <CardTitle>Kode Sumber Terbuka</CardTitle>
            <CardDescription>
              Penasaran bagaimana cara kerjanya? Langsung saja cek apa yang
              dilakukan di balik layar dengan melihat langsung kode sumbernya
            </CardDescription>
          </CardHeader>
        </MagicCard>
      </div>
    </section>
  )
}
