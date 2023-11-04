'use client'

import { useEffect } from 'react'

// @ts-ignore
import { useAuth } from '@/components/FirebaseAuth'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getFirebaseAuth, trackEvent } from '@/lib/firebase'
import SettingTelegram from '@/modules/AccountSettings/SettingNotif/SettingTelegram'
import { useNotifChannelByUser, useOwner } from '@/queries/useQueries'

const auth = getFirebaseAuth()

export default function SettingOgImage() {
  const { isLogin, isLoading, user } = useAuth(auth)

  const { data: dataOwner, isLoading: isLoadingOwner } = useOwner(user!, {
    enabled: !isLoading && isLogin && !!user,
  })

  const { data: dataNotifChannel, isLoading: isLoadingNotifChannel } =
    useNotifChannelByUser(user!, {
      enabled: !isLoading && isLogin && !!user,
    })

  useEffect(() => {
    trackEvent('view notif-channel setting page')
  }, [])

  return (
    <>
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          Setelan Notifikasi
        </h2>
        <p className="text-muted-foreground">
          Setel notifikasi channel yang tersedia agar selalu terbarui
        </p>
      </div>

      <Separator className="my-6" />
      <Tabs defaultValue="telegram" className="space-y-6">
        <div className="-mx-8 -mb-2 overflow-y-auto">
          <div className="px-8 pb-2 inline-block align-middle">
            <TabsList>
              <TabsTrigger value="telegram">Telegram</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="telegram">
          <div className="mb-6 space-y-0.5">
            <h3 className="text-xl font-bold tracking-tight">
              Notifikasi ke Telegram
            </h3>
            <p className="text-sm text-muted-foreground">
              Atur notifikasi ke Telegram
            </p>
          </div>
          <SettingTelegram
            isLoading={isLoadingOwner || isLoadingNotifChannel}
            owner={dataOwner?.data}
            user={user}
            existing={dataNotifChannel?.data}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}
