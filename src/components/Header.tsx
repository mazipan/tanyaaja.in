'use client'

import { getFirebaseAuth } from '@/lib/firebase'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logoSvg from '~/public/logo/TanyaAja.svg'

import { useAuth } from './FirebaseAuth'
import { ThemeSwitcher } from './ThemeSwitcher'
import {} from './ui/avatar'
import { Button } from './ui/button'
import {} from './ui/dropdown-menu'

const auth = getFirebaseAuth()

export function Header() {
  const pathname = usePathname()
  const { isLogin, user, isLoading } = useAuth(auth)

  if (pathname.startsWith('/account')) {
    return null
  }

  return (
    <header className="container flex justify-between items-center p-4 border-b">
      <Link href="/" className="flex gap-2 items-center">
        <Image
          src={logoSvg}
          alt="Tanya Aja"
          width={50}
          height={41.9}
          className=""
        />
        <h2 className="font-extrabold text-2xl tracking-tight">TanyaAja</h2>
      </Link>
      <div className="flex items-center gap-2">
        {!isLoading ? (
          <>
            {isLogin && user && user.displayName ? (
              <Button asChild>
                <Link href="/account">Ke Laman Akun</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </>
        ) : (
          <Loader2 className="animate-spin" />
        )}

        <ThemeSwitcher />
      </div>
    </header>
  )
}
