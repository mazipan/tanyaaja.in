'use client'

import { useAuth } from '@/components/FirebaseAuth'
import { Separator } from '@/components/ui/separator'
import { getFirebaseAuth, trackEvent } from '@/lib/firebase'
import { AccountVisibilityReminder } from '@/modules/AccountSettings/AccountVisibilityReminder'
import { StatisticPanel } from '@/modules/AccountSettings/StatisticPanel'
import { useOwner } from '@/queries/useQueries'
import { useEffect } from 'react'

const auth = getFirebaseAuth()

export default function Account() {
  const { isLogin, isLoading, user } = useAuth(auth)

  const { data: dataOwner, isLoading: isLoadingOwner } = useOwner(user!, {
    enabled: !isLoading && isLogin && !!user,
  })

  useEffect(() => {
    trackEvent('view account page')
  }, [])

  return (
    <>
      <div className="w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Statistik sederhana mengenai akun kamu di TanyaAja.in.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="w-full flex flex-col gap-6">
        <StatisticPanel owner={dataOwner?.data} />
      </div>

      {!isLoadingOwner && (
        <AccountVisibilityReminder
          show={dataOwner ? !dataOwner.data.public : false}
        />
      )}
    </>
  )
}
