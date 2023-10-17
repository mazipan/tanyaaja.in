'use client'
import { useMediaQuery } from 'usehooks-ts'

import { QuestionPreviewProps } from './helpers'
import { QuestionDialog } from './QuestionDialog'
import { QuestionSheet } from './QuestionSheet'

export const QuestionResponsive = ({
  question,
  user,
  owner,
  isOpen,
  onOpenChange,
}: QuestionPreviewProps) => {
  const isMd = useMediaQuery('(min-width: 768px)')

  return (
    <>
      {isMd ? (
        <QuestionDialog
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          user={user}
          owner={owner}
          question={question}
        />
      ) : (
        <QuestionSheet
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          user={user}
          owner={owner}
          question={question}
        />
      )}
    </>
  )
}
