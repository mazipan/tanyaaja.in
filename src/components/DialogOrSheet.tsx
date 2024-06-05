'use client'

import { useMediaQuery } from 'usehooks-ts'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export const DialogOrSheet = ({
  children,
  title,
  isOpen,
  onOpenChange,
  withAction = false,
  ActionButtons = null,
}: {
  title: string
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  children: React.ReactNode
  withAction?: boolean
  ActionButtons?: React.ReactNode
}) => {
  const isMd = useMediaQuery('(min-width: 768px)')

  return (
    <>
      {isMd ? (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            {children}

            {withAction && (
              <DialogFooter className="flex gap-2 w-full">
                {ActionButtons && ActionButtons}
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent side="top" className="max-h-screen overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>

            {children}

            {withAction && (
              <SheetFooter className="flex flex-col gap-2 mt-2">
                {ActionButtons && ActionButtons}
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}
