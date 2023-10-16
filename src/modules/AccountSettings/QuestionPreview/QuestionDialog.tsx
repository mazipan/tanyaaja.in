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
  owner,
}: QuestionPreviewProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mari jawab pertanyaan ini</DialogTitle>
        </DialogHeader>

        <PreviewContent question={question} owner={owner} />

        <DialogFooter className="flex gap-2 w-full">
          <ButtonAction
            question={question}
            user={user}
            onOpenChange={onOpenChange}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
