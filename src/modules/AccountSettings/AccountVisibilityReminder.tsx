'use client'

import { useEffect, useState } from 'react'

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
  const [isShown, setIsShown] = useState(show)

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
      <Toast open={isShown} onOpenChange={() => setIsShown(false)}>
        <div className="flex flex-col gap-4">
          <ToastTitle>Akun tidak publik</ToastTitle>
          <ToastDescription>
            Akun Anda tidak dapat dicari oleh pengguna anonim pada halaman
            eksplor sampai Anda mengubah akun menjadi publik.
          </ToastDescription>
        </div>

        <ToastClose onClick={handleReminderClose} />
      </Toast>

      <ToastViewport />
    </ToastProvider>
  )
}
