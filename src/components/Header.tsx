"use client"

import logoSvg from '../../public/logo/TanyaAja.svg'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useAuth } from './FirebaseAuth'

import { getFirebaseAuth } from '@/lib/firebase'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { signOut } from 'firebase/auth'
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const auth = getFirebaseAuth();

export function Header() {
  const router = useRouter()
  const { toast } = useToast()
  const { isLogin, user, isLoading } = useAuth(auth)

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast({
          description: `Berhasil logout!`,
        });

        setTimeout(() => {
          router.push('/login')
        }, 500)
      })
      .catch((error) => {
        toast({
          title: 'Gagal logout',
          description: `${error.message}`,
          variant: "destructive"
        });
      });
  }


  return (
    <header className='flex justify-between items-center p-4 border-b'>
      <Link href="/" className='flex gap-2 items-center'>
        <Image
          src={logoSvg}
          alt="Tanya Aja"
          width={50}
          height={41.9}
          className=''
        />
        <h2 className="font-extrabold text-2xl tracking-tight">TanyaAja</h2>
      </Link>
      <div className='flex items-center gap-2'>
        {!isLoading ? (
          <>
            {isLogin && user && user.displayName && user.photoURL? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                    <AvatarFallback>
                      {user?.displayName?.split(" ").map((n: string) => n[0]).join("").substring(2, 0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className='flex flex-col'>
                      <span>{user?.displayName}</span>
                      <span className='font-light text-sm text-secondary-foreground'>{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='cursor-pointer py-3' asChild>
                    <Link href="/account">
                      Daftar Pertanyaan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='cursor-pointer py-3' asChild>
                    <Link href="/account/settings">
                      Setelan Akun
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className='cursor-pointer py-3'>
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
        ) : null}

        <ThemeSwitcher />
      </div>
    </header>
  )
}