import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { CalendarDays } from 'lucide-react'

import { CopyButton } from '@/components/CopyButton'
import PublicAccessToggler from '@/components/PublicAccessToggler'
import { RedirectButton } from '@/components/RedirectButton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BASEURL } from '@/lib/api'
import {
  IResponseGetQuestionPagination,
  Question,
  UserProfile,
} from '@/lib/types'

interface QuestionPanelProps {
  question: Question | null
  owner: UserProfile | null | undefined
  onClick: (q: Question) => void
  index: number
}

export const QuestionPanel = ({
  question,
  onClick,
  index,
  owner,
}: QuestionPanelProps) => {
  const queryClient = useQueryClient()

  const handleUpdateQuestionPrivacy = (question: Question) => {
    // Find the question and update state
    queryClient.setQueryData<
      InfiniteData<IResponseGetQuestionPagination> | undefined
    >(['/questions', owner?.uid], (oldData) => {
      const defaultData:
        | InfiniteData<IResponseGetQuestionPagination>
        | undefined = { pages: [], pageParams: [] }
      if (!oldData) return defaultData

      const updatedListQuestion = oldData.pages.map((oldQuestionItem) => {
        const updatedChildQuestion = oldQuestionItem.data.map(
          (questionItem) => {
            return questionItem.uuid === question.uuid
              ? { ...questionItem, public: !questionItem.public }
              : questionItem
          },
        )
        return { ...oldQuestionItem, data: updatedChildQuestion }
      })

      return {
        pages: updatedListQuestion,
        pageParams: oldData.pageParams,
      }
    })
  }

  return (
    <Card className="relative min-h-[200px] flex flex-col">
      {question ? (
        <>
          <CardHeader>
            <div className="flex justify-between gap-2 flex-wrap">
              <CardTitle className="text-2xl self-center leading-none">
                Pertanyaan #{index}
              </CardTitle>

              <PublicAccessToggler
                question={question}
                onSuccess={handleUpdateQuestionPrivacy}
              />
            </div>

            <CardDescription className="flex gap-1 items-center">
              <CalendarDays className="w-4 h-4" />
              {new Date(question.submitted_date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            <p className="">
              {question.question.length > 100
                ? `${question.question.substring(0, 300)}...`
                : question.question}
            </p>
          </CardContent>

          <CardFooter className="justify-end gap-2 flex-wrap">
            {question?.public ? (
              <>
                <RedirectButton
                  url={`${BASEURL}/p/${owner?.slug}/${question?.uuid}`}
                  external
                />
                <CopyButton
                  text={`${BASEURL}/p/${owner?.slug}/${question?.uuid}`}
                  withLabel
                />
              </>
            ) : null}

            <Button
              type="button"
              onClick={() => {
                onClick(question)
              }}
            >
              Selengkapnya
            </Button>
          </CardFooter>
        </>
      ) : null}
    </Card>
  )
}
