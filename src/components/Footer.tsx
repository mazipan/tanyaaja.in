'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname.startsWith('/account')) {
    return null
  }

  return (
    <footer className="p-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 container mb-8">
        <div>
          <h4 className="text-lg font-bold mb-2">Lebih Banyak</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/tentang"
                className="underline text-muted-foreground text-sm"
              >
                Tentang TanyaAja
              </Link>
            </li>
            <li>
              <Link
                href="/eksplor"
                className="underline text-muted-foreground text-sm"
              >
                Eksplor Pengguna
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-2">Kebijakan</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/ketentuan-layanan"
                className="underline text-muted-foreground text-sm"
              >
                Ketentuan Layanan
              </Link>
            </li>
            <li>
              <Link
                href="/kebijakan-privasi"
                className="underline text-muted-foreground text-sm"
              >
                Kebijakan Privasi
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-2">Sumber Daya</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="https://status.tanyaaja.in/"
                className="underline text-muted-foreground text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Status Server
              </a>
            </li>
            <li>
              <a
                href="https://github.com/mazipan/tanyaaja"
                className="underline text-muted-foreground text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kode Sumber
              </a>
            </li>
            <li>
              <a
                href="https://github.com/mazipan/tanyaaja/issues/new"
                className="underline text-muted-foreground text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Laporkan Isu
              </a>
            </li>
            <li>
              <a
                href="https://mazipan.space/support"
                className="underline text-muted-foreground text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dukung TanyaAja
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-2">Karya Lain</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="https://ksana.in"
                className="underline text-muted-foreground text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ksana.in
              </a>
            </li>
            <li>
              <a
                href="https://www.baca-quran.id/"
                className="underline text-muted-foreground text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Baca-Quran.id
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="text-center">
          <p>
            <small>© Sejak 2023, TanyaAja.in</small>
          </p>
          <p>
            <small>
              <span>With ☕️, by </span>
              <a
                href="https://mazipan.space/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-muted-foreground text-sm"
              >
                {' '}
                Irfan Maulana
              </a>
            </small>
          </p>
        </div>
      </div>
    </footer>
  )
}
