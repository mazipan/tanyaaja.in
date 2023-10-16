/** @see https://github.com/theodorusclarence/aether-design-system/blob/main/src/store/useDialogStore.tsx */
import { create } from 'zustand'

import { ButtonProps } from '@/components/ui/button'

type DialogOptions = {
  /** Title for dialog */
  title: string
  /** Description for dialog, could be a JSX Element */
  description?: React.ReactNode
  cancelButton?: {
    label: string
    variant?: ButtonProps['variant']
  }
  submitButton?: {
    label: string
    variant?: ButtonProps['variant']
  }
  /**
   * Allows to catch dialog function promise
   *
   * @example
   * ```tsx
   * dialog({
   *   catchOnCancel: true,
   * }).catch(() => {
   *   console.log('User closed the dialog')
   * })
   * ```
   */
  catchOnCancel?: boolean
  onCancel?: () => Promise<void>
  onConfirm?: () => Promise<void>
}

type DialogStoreState = {
  open: boolean
  awaitingPromise: {
    resolve?: () => void
    reject?: () => void
  }
  options: DialogOptions
}

type DialogStoreAction = {
  dialog: (overrideOptions?: Partial<DialogOptions>) => Promise<void>
  handleClose: () => void
  handleSubmit: () => void
}
type DialogStore = DialogStoreState & DialogStoreAction

export const useDialogStore = create<DialogStore>((set) => ({
  open: false,
  awaitingPromise: {},
  options: {
    title: 'Dialog Title',
    description: '',
    cancelButton: {
      label: 'Batal',
      variant: 'default',
    },
    submitButton: {
      label: 'Ya',
      variant: 'default',
    },
  },

  dialog: (overrideOptions) => {
    set((prev) => ({
      ...prev,
      open: true,
      options: { ...prev.options, ...overrideOptions },
    }))

    return new Promise<void>((resolve, reject) => {
      set((prev) => ({
        ...prev,
        awaitingPromise: { resolve, reject },
      }))
    })
  },

  handleClose: () => {
    set((prev) => {
      if (prev.options.catchOnCancel) {
        prev.awaitingPromise?.reject?.()
      }
      return {
        ...prev,
        open: false,
      }
    })
  },

  handleSubmit: () => {
    set((prev) => {
      prev.awaitingPromise?.resolve?.()
      return {
        ...prev,
        open: false,
      }
    })
  },
}))

export const useDialog = () => useDialogStore((state) => state.dialog)
