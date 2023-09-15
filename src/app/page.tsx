"use client"

import Image from "next/image"
import imagehero from "../../public/images/pexels-rdne-stock-project-5756742.jpg"
import logoImage from "../../public/logo/TanyaAja.svg"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col gap-2 justify-center items-start p-8">
        <Image
          src={logoImage}
          alt="Simbol tanda tanya"
          width={100}
          height={83.8} />
        <h1 className="font-extrabold text-7xl tracking-tight">TanyaAja</h1>
        <p className="font-bold text-xl  text-muted-foreground">Kumpulkan pertanyaan secara anonim dari siapa saja dengan mudah</p>
        <Button className="w-full lg:w-1/2 mt-8 flex gap-2 items-center" size="lg" asChild>
          <Link href="/login">
            Mulai dengan cepat
            <ArrowRightIcon className="w-6 h-6"/>
          </Link>
        </Button>
      </div>
      <div className="p-4">
        <Image src={imagehero} alt="Laki-laki sedang mengacungkan tangan" className="rounded-3xl" />
      </div>
    </main>
  )
}
