import logoSvg from '../../public/logo/svg/logo-no-background.svg'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeSwitcher } from './ThemeSwitcher'

export function Header() {
  return (
    <header className='flex justify-between items-center p-4 border-b'>
      <Link href="/">
        <Image
          src={logoSvg}
          alt="Tanya Aja"
          width={200}
          height={50}
          className='bg-black py-2 px-4 rounded-lg'
        />
      </Link>
      <ThemeSwitcher />
    </header>
  )
}