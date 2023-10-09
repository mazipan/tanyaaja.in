'use client'

import { Question, UserProfile } from '@/lib/types'
import { CARD_SCALES, cn, GRADIENTS } from '@/lib/utils'

export const QuestionImage = ({
  question,
  activeGradient,
  selectedScale,
}: {
  question: Question | null
  owner: UserProfile | null | undefined
  activeGradient: string
  selectedScale: string
}) => {
  return (
    <div className="relative">
      <div
        id="question-card"
        className={cn(
          '-z-10 p-8 flex flex-col justify-center items-center text-center absolute -top-[2000px] -left-[2000px] rounded-lg min-h-[300px]',
          activeGradient !== ''
            ? GRADIENTS.find((g) => g.id === activeGradient)?.class
            : '',
          CARD_SCALES.find((scale) => scale.id === selectedScale)?.class,
        )}
      >
        {question?.question}
      </div>
    </div>
  )
}
