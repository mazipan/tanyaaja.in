'use client'

import { useEffect } from 'react'

// @ts-ignore
import { useAuth } from '@/components/FirebaseAuth'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getFirebaseAuth, trackEvent } from '@/lib/firebase'
import AdvanceMode from '@/modules/AccountSettings/SettingOg/AdvanceMode'
import SimpleMode from '@/modules/AccountSettings/SettingOg/SimpleMode'
import { useCustomOgByUser, useOwner } from '@/queries/useQueries'

const auth = getFirebaseAuth()

export default function SettingOgImage() {
  const { isLogin, isLoading, user } = useAuth(auth)

  const { data: dataOwner, isLoading: isLoadingOwner } = useOwner(user!, {
    enabled: !isLoading && isLogin && !!user,
  })

  const { data: dataCustomOg, isLoading: isLoadingCustomOg } =
    useCustomOgByUser(user!, {
      enabled: !isLoading && isLogin && !!user,
    })

  useEffect(() => {
    trackEvent('view og-image setting page')
  }, [])

  return (
    <>
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Setelan OG Image</h2>
        <p className="text-muted-foreground">
          Atur OG Image yang Anda inginkan
        </p>
      </div>

      <Separator className="my-6" />
      <Tabs defaultValue="simple-mode" className="space-y-6">
        <div className="-mx-8 -mb-2 overflow-y-auto">
          <div className="px-8 pb-2 inline-block align-middle">
            <TabsList>
              <TabsTrigger value="simple-mode">Mode Sederhana</TabsTrigger>
              <TabsTrigger value="advance-mode">Mode Rumit</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="simple-mode">
          <div className="mb-6 space-y-0.5">
            <h3 className="text-xl font-bold tracking-tight">Mode Sederhana</h3>
            <p className="text-sm text-muted-foreground">
              Atur OG Image dengan lebih mudah untuk pengguna awam
            </p>
          </div>
          <SimpleMode
            isLoading={isLoadingOwner || isLoadingCustomOg}
            owner={dataOwner?.data}
            user={user}
            existingOg={dataCustomOg?.data}
          />
        </TabsContent>
        <TabsContent value="advance-mode">
          <div className="mb-6 space-y-0.5">
            <h3 className="text-xl font-bold tracking-tight">Mode Rumit</h3>
            <p className="text-sm text-muted-foreground">
              Atur OG Image semaumu untuk pengguna yang familiar dengan coding
            </p>
          </div>
          <AdvanceMode
            isLoading={isLoadingOwner || isLoadingCustomOg}
            owner={dataOwner?.data}
            user={user}
            existingOg={dataCustomOg?.data}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}
