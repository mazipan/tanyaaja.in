'use client'

import Image from 'next/image'

import { Separator } from '@/components/ui/separator'
import image404 from '~/public/images/404.png'

export default function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <main className="w-full container py-8">
      <div className="w-full space-y-0.5">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Separator className="my-6" />

      <div className="w-full flex flex-col gap-4 items-center justify-center">
        <Image
          src={image404}
          alt="Kucing menjatuhkan vas bunga"
          width={500}
          height={500}
        />
      </div>
    </main>
  )
}
