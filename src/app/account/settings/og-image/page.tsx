'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// @ts-ignore
import { useAuth } from '@/components/FirebaseAuth'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getExistingCustomOg, getExistingUser } from '@/lib/api'
import { getFirebaseAuth, trackEvent } from '@/lib/firebase'
import { CustomOg, UserProfile } from '@/lib/types'
import AdvanceMode from '@/modules/AccountSettings/SettingOg/AdvanceMode'
import SimpleMode from '@/modules/AccountSettings/SettingOg/SimpleMode'

const auth = getFirebaseAuth()

export default function SettingOgImage() {
  const router = useRouter()
  const { isLogin, isLoading, user } = useAuth(auth)
  const [owner, setOwner] = useState<UserProfile | null>(null)
  const [existingOg, setExistingOg] = useState<CustomOg[] | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUserFromDb = async () => {
    if (user) {
      const res = await getExistingUser(user)

      if (res && res.data) {
        setOwner(res.data)
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchExistingOgFromDb = async () => {
    if (user) {
      const res = await getExistingCustomOg(user)

      if (res && res.data) {
        setExistingOg(res.data)
      }
    }
  }

  // Redirect back to /login --> if the session is not found
  useEffect(() => {
    if (!isLoading) {
      if (!isLogin) {
        router.push('/login')
      } else if (user) {
        fetchUserFromDb()
        fetchExistingOgFromDb()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, user, isLoading, router])

  useEffect(() => {
    trackEvent('view og-image setting page')
  }, [])

  return (
    <main className="w-full container py-8">
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Setelan OG Image</h2>
        <p className="text-muted-foreground">
          Atur OG Image yang Anda inginkan
        </p>
      </div>

      <Separator className="my-6" />
      <Tabs defaultValue="simple-mode">
        <TabsList className="mb-2">
          <TabsTrigger value="simple-mode">Mode Sederhana</TabsTrigger>
          <TabsTrigger value="advance-mode">Mode Rumit</TabsTrigger>
        </TabsList>
        <TabsContent value="simple-mode">
          <div className="w-full space-y-0.5">
            <h3 className="text-xl font-bold tracking-tight">Mode Sederhana</h3>
            <p className="text-sm text-muted-foreground">
              Atur OG Image dengan lebih mudah untuk pengguna awam
            </p>
          </div>
          <SimpleMode owner={owner} user={user} existingOg={existingOg} />
        </TabsContent>
        <TabsContent value="advance-mode">
          <div className="w-full space-y-0.5">
            <h3 className="text-xl font-bold tracking-tight">Mode Rumit</h3>
            <p className="text-sm text-muted-foreground">
              Atur OG Image semaumu untuk pengguna yang familiar dengan coding
            </p>
          </div>
          <AdvanceMode owner={owner} user={user} existingOg={existingOg} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
