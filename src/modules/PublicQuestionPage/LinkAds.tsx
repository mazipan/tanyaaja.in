import PulsatingButton from '@/components/ui/pulsating-button'
import Link from 'next/link'

export function LinkAds() {
  return (
    <div className="relative flex flex-col gap-6 mt-8">
      <p>Mau punya halaman seperti ini?</p>

      <Link href="/login">
        <PulsatingButton>Daftar Sekarang</PulsatingButton>
      </Link>
    </div>
  )
}
