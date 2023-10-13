'use client'

import Image from 'next/image'

import image404 from '~/public/images/404.png'

export default function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <main className="w-full py-8 flex flex-col items-center gap-6">
      <div className="w-full space-y-0.5 max-w-3xl">
        <h3 className="text-2xl font-bold tracking-tight text-center">
          {title}
        </h3>
        <p className="text-muted-foreground text-center">{description}</p>
      </div>

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
