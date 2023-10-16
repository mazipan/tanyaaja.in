'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Info } from 'lucide-react'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

const ONE_WEEK = 604_800_000
const STORAGE_KEY = 'last-reminder'

export const AccountVisibilityReminder = ({ show }: { show: boolean }) => {
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    const lastReminder = localStorage.getItem(STORAGE_KEY)
    const now = new Date().getTime()

    if (!lastReminder) {
      setIsShown(show)

      return
    }

    const lastReminderTime = Number.parseInt(lastReminder, 10)
    if (now - ONE_WEEK >= lastReminderTime) {
      setIsShown(show)
    }
  }, [show])

  const handleReminderClose = () => {
    const now = new Date().getTime()

    localStorage.setItem(STORAGE_KEY, now.toString())

    setIsShown(false)
  }

  return (
    <ToastProvider duration={Infinity}>
      <Toast open={isShown} onOpenChange={handleReminderClose}>
        <div className="flex items-start gap-4">
          <Info className="w-12 h-auto" />

          <div className="flex flex-col gap-2">
            <ToastTitle className="leading-tight">Akun tidak publik</ToastTitle>
            <ToastDescription>
              Ubah akun Anda menjadi publik pada halaman{' '}
              <Link href="/account/settings" className="underline">
                pengaturan akun
              </Link>{' '}
              agar dapat dilihat oleh pengguna lain pada halaman eksplor.
            </ToastDescription>
          </div>
        </div>

        <ToastClose onClick={handleReminderClose} />
      </Toast>

      <ToastViewport />
    </ToastProvider>
  )
}
