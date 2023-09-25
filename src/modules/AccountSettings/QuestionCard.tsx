import {
  CalendarIcon,
  LockClosedIcon,
  LockOpen2Icon,
} from '@radix-ui/react-icons'

import { CopyButton } from '@/components/CopyButton'
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
import { Question, UserProfile } from '@/lib/types'
interface QuestionPanelProps {
  question: Question | null
  owner: UserProfile | null
  onClick: (q: Question) => void
  index: number
}

export const QuestionPanel = ({
  question,
  onClick,
  index,
  owner,
}: QuestionPanelProps) => {
  return (
    <Card className="relative min-h-[200px] flex flex-col">
      {question ? (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Pertanyaan #{index}</CardTitle>
            <CardDescription className="flex gap-1 items-center">
              {question.public ? <LockOpen2Icon /> : <LockClosedIcon />}
              <span className="text-sm">
                {question.public
                  ? 'Bisa diakses publik'
                  : 'Tidak bisa diakses public'}
              </span>
            </CardDescription>
            <CardDescription className="flex gap-1 items-center">
              <CalendarIcon />
              {new Date(question.submitted_date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="">
              {question.question.length > 100
                ? `${question.question.substring(0, 300)}...`
                : question.question}
            </p>
          </CardContent>

          <CardFooter className="justify-end gap-2 flex-wrap">
            <RedirectButton
              url={`${BASEURL}/p/${owner?.slug}/${question?.uuid}`}
              external
            />
            <CopyButton
              text={`${BASEURL}/p/${owner?.slug}/${question?.uuid}`}
              withLabel
            />

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
