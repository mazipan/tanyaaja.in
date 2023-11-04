'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { signOut } from 'firebase/auth'
import {
  BellIcon,
  Camera,
  Loader2,
  LogOut,
  MessageCircle,
  MoveUpRight,
  Wrench,
} from 'lucide-react'

import { destroyActiveSession } from '@/lib/api'
import { getFirebaseAuth } from '@/lib/firebase'
import { DEFAULT_AVATAR } from '@/lib/utils'
import { useOwner } from '@/queries/useQueries'
import logoSvg from '~/public/logo/TanyaAja.svg'

import { useAuth } from './FirebaseAuth'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useToast } from './ui/use-toast'

const auth = getFirebaseAuth()

export function Header() {
  const router = useRouter()
  const { toast } = useToast()
  const { isLogin, user, isLoading } = useAuth(auth)
  const { data: dataOwner, isLoading: isLoadingOwner } = useOwner(user!, {
    enabled: !isLoading && isLogin && !!user,
  })

  const handleLogout = async () => {
    if (user) {
      try {
        await destroyActiveSession(user)
      } catch {}
    }

    signOut(auth)
      .then(() => {
        toast({
          description: `Berhasil logout!`,
        })

        setTimeout(() => {
          router.push('/login')
        }, 500)
      })
      .catch((error) => {
        toast({
          title: 'Gagal logout',
          description: `${error.message}`,
          variant: 'destructive',
        })
      })
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border">
                    {!isLoadingOwner && dataOwner && dataOwner.data && (
                      <>
                        <AvatarImage
                          src={
                            dataOwner?.data?.image ||
                            user?.photoURL ||
                            DEFAULT_AVATAR
                          }
                          alt={user?.displayName}
                          className="bg-white"
                        />

                        <AvatarFallback>
                          {user?.displayName
                            ?.split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .substring(2, 0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.displayName}</span>
                      <span className="font-light text-sm text-secondary-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {!isLoadingOwner && dataOwner && (
                    <DropdownMenuItem className="cursor-pointer py-3" asChild>
                      <Link
                        href={`/p/${dataOwner?.data?.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MoveUpRight className="h-4 w-4 mr-2" />
                        Laman Publik
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer py-3" asChild>
                    <Link href="/account">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Daftar Pertanyaan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer py-3" asChild>
                    <Link href="/account/settings">
                      <Wrench className="h-4 w-4 mr-2" />
                      Setelan Akun
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer py-3" asChild>
                    <Link href="/account/settings/og-image">
                      <Camera className="h-4 w-4 mr-2" />
                      Setelan OG Image
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer py-3" asChild>
                    <Link href="/account/settings/notification">
                      <BellIcon className="h-4 w-4 mr-2" />
                      Setelan Notifikasi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer py-3"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
