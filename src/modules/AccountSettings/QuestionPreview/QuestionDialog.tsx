import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { ButtonAction } from './ButtonAction'
import { QuestionPreviewProps } from './helpers'
import { PreviewContent } from './PreviewContent'

export const QuestionDialog = ({
  question,
  user,
  isOpen,
  onOpenChange,
  onRefetch,
}: QuestionPreviewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mari jawab pertanyaan ini</DialogTitle>
        </DialogHeader>

        <PreviewContent question={question} />

        <DialogFooter className="flex gap-2 w-full">
          <ButtonAction
            question={question}
            user={user}
            onOpenChange={onOpenChange}
            onRefetch={onRefetch}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
