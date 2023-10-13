import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function LinkAds() {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <small>Ingin punya halaman seperti ini?</small>
      <Button
        className="flex gap-2 items-center animate-bounce"
        size="lg"
        asChild
        variant="secondary"
      >
        <Link href="/login">
          Buat di sini
          <ArrowRight className="w-6 h-6" />
        </Link>
      </Button>
    </div>
  )
}
