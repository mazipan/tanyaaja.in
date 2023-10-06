'use client'
import { useState } from 'react'
import {
  CalendarIcon,
  DownloadIcon,
  LockClosedIcon,
  LockOpen2Icon,
} from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Question, UserProfile } from '@/lib/types'
import { cn, downloadQuestion } from '@/lib/utils'

import { ClassMap } from './helpers'
import { CARD_SCALES } from './helpers'
import { GRADIENTS } from './helpers'
import { QuestionImage } from './QuestionImage'

export const PreviewContent = ({
  question,
  owner,
}: {
  question: Question | null
  owner: UserProfile
}) => {
  const [activeGradient, setActiveGradient] = useState<string>('hyper')
  const [selectedScale, setSelectedScale] = useState<string>('fluid')

  const handleClickGradient = (newGradient: ClassMap) => {
    setActiveGradient(newGradient?.id || '')
  }

  const handleChangeScale = (newScale: string) => {
    setSelectedScale(newScale)
  }

  return (
    <div className="flex flex-col gap-2">
      {question ? (
        <div className="mb-4 mt-2 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-1 items-center">
              <CalendarIcon />
              <small>
                {new Date(question?.submitted_date).toLocaleDateString(
                  'id-ID',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                )}
              </small>
            </div>

            <div className="flex gap-1 items-center">
              {question.public ? <LockOpen2Icon /> : <LockClosedIcon />}
              <small>
                {question.public
                  ? 'Bisa diakses publik'
                  : 'Tidak bisa diakses public'}
              </small>
            </div>
          </div>
        </div>
      ) : null}

      {question ? (
        <>
          <div className="flex gap-2 flex-wrap justify-between flex-col md:flex-row">
            <div className="flex gap-2 flex-wrap">
              {GRADIENTS.map((gradient: ClassMap) => (
                <div
                  key={gradient.id}
                  className={cn(
                    'h-8 w-8 border rounded-full cursor-pointer',
                    gradient.class,
                    activeGradient === gradient.id
                      ? 'border-2 border-gray-900 dark:border-gray-100'
                      : '',
                  )}
                  onClick={() => {
                    handleClickGradient(gradient)
                  }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between md:justify-end gap-2 items-center">
              <Select
                onValueChange={handleChangeScale}
                defaultValue={selectedScale}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CARD_SCALES.map((scale) => (
                      <SelectItem value={scale.id} key={scale.id}>
                        {scale.id}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  downloadQuestion(question.uuid)
                }}
              >
                Download Gambar
                <DownloadIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className={cn('relative')}>
            <Card
              className={cn(
                'p-4 flex justify-center items-center text-center min-h-[300px]',
                activeGradient !== ''
                  ? GRADIENTS.find((g) => g.id === activeGradient)?.class
                  : '',
              )}
            >
              {question?.question}
            </Card>
            <QuestionImage
              owner={owner}
              question={question}
              selectedScale={selectedScale}
              activeGradient={activeGradient}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
