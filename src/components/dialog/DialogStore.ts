/** @see https://github.com/theodorusclarence/aether-design-system/blob/main/src/store/useDialogStore.tsx */
import { produce } from 'immer'
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
    set((prev) =>
      produce(prev, (state) => {
        state.open = true
        state.options = { ...state.options, ...overrideOptions }
      }),
    )
    return new Promise<void>((resolve, reject) => {
      set((prev) =>
        produce(prev, (state) => {
          state.awaitingPromise = { resolve, reject }
        }),
      )
    })
  },
  handleClose: () => {
    set((prev) =>
      produce(prev, (state) => {
        state.options.catchOnCancel && state.awaitingPromise?.reject?.()
        state.open = false
      }),
    )
  },
  handleSubmit: () => {
    set((prev) =>
      produce(prev, (state) => {
        state.awaitingPromise?.resolve?.()
        state.open = false
      }),
    )
  },
}))

export const useDialog = () => useDialogStore((state) => state.dialog)
