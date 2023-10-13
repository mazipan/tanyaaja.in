'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <main className="w-full container py-8">
          <div className="w-full space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              Terjadi kesalahan
            </h2>
            <p className="text-muted-foreground">
              Terjadi kesalahan saat mencoba memuat halaman yang diinginkan
            </p>
          </div>
          <Separator className="my-6" />

          <div className="w-full flex flex-col gap-4 items-center justify-center">
            <Button type="button" onClick={() => reset()}>
              Coba lagi
            </Button>
            <Button
              className="flex gap-2 items-center"
              asChild
              variant="secondary"
            >
              <Link href="/login">
                Kembali ke beranda
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>
          </div>
        </main>
      </body>
    </html>
  )
}
