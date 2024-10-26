'use client'

import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'

import { useAuth } from '@/components/FirebaseAuth'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getFirebaseAuth } from '@/lib/firebase'

const auth = getFirebaseAuth()

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isLogin, isLoading } = useAuth(auth)

  // Redirect back to /login --> if the session is not found
  if (!isLoading && !isLogin) {
    router.push('/login')
  }
  // if there no login and user alredy login then render the main content
  if (!isLoading && isLogin) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full container py-8">
          <SidebarTrigger />
          {children}

          <Separator className="mt-8" />

          <footer className="container py-20 md:py-8">
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
          </footer>
        </main>
      </SidebarProvider>
    )
  }
  // if the condition above didnt fullfill then we expect still loading
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full container h-[50vh] my-auto flex justify-center items-center py-8">
        <Loader2 className="animate-spin" size={40} />
      </main>
    </SidebarProvider>
  )
}
