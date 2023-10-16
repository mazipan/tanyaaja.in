'use client'

import { useDialogStore } from '@/components/dialog/DialogStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function BaseDialog() {
  const open = useDialogStore((state) => state.open)
  const handleClose = useDialogStore((state) => state.handleClose)
  const handleSubmit = useDialogStore((state) => state.handleSubmit)

  const {
    title,
    description,
    submitButton,
    cancelButton,
    onCancel,
    onConfirm,
  } = useDialogStore((state) => state.options)

  const handleClickCancel = async () => {
    if (typeof onCancel === 'function') {
      await onCancel?.()
    }
    handleClose()
  }

  const handleClickSubmit = async () => {
    if (typeof onConfirm === 'function') {
      await onConfirm?.()
    }
    handleSubmit()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleClickCancel} variant={cancelButton?.variant}>
            {cancelButton?.label}
          </Button>
          <Button onClick={handleClickSubmit} variant={submitButton?.variant}>
            {submitButton?.label}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
