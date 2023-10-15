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

  const { title, description, submitButton, cancelButton } = useDialogStore(
    (state) => state.options,
  )

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleClose} variant={cancelButton?.variant}>
            {cancelButton?.label}
          </Button>
          <Button onClick={handleSubmit} variant={submitButton?.variant}>
            {submitButton?.label}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
