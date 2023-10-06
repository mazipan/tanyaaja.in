import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { ButtonAction } from './ButtonAction'
import { QuestionPreviewProps } from './helpers'
import { PreviewContent } from './PreviewContent'

export const QuestionSheet = ({
  question,
  user,
  isOpen,
  onOpenChange,
  onRefetch,
}: QuestionPreviewProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Mari jawab pertanyaan ini</SheetTitle>
        </SheetHeader>

        <PreviewContent question={question} />

        <SheetFooter className="flex flex-col gap-2 mt-2">
          <ButtonAction
            question={question}
            user={user}
            onOpenChange={onOpenChange}
            onRefetch={onRefetch}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
