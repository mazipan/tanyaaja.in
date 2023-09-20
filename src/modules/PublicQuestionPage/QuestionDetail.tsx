'use client'

import { Fragment, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PaperPlaneIcon } from '@radix-ui/react-icons'

import { ShareButton } from '@/components/ShareButton'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BASEURL, patchHit } from '@/lib/api'
import { Question } from '@/lib/types'
import image404 from '~/public/images/404.png'

export const QuestionDetail = ({
  questions,
  slug,
}: {
  slug: string
  questions: Question[]
}) => {
  const isNotEmptyQuestion = questions && questions.length > 0
  const question: Question | null = isNotEmptyQuestion ? questions[0] : null

  useEffect(() => {
    if (slug) {
      patchHit(slug)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      {isNotEmptyQuestion && question ? (
        <Fragment>
          <Card className="p-4 text-2xl w-full min-h-[200px] md:w-[500px] lg:min-h-[400px] relative flex flex-col items-center justify-center">
            {question?.question}
          </Card>

          {slug ? (
            <ShareButton
              text={`Tanyakan apa aja ke saya`}
              title={`Kamu bisa tanyakan apa aja ke saya dengan anonim`}
              url={`${BASEURL}/p/${slug}/${question?.uuid}`}
            />
          ) : null}
        </Fragment>
      ) : (
        <div className="w-full flex gap-4 items-center justify-centerflex flex-col">
          <Image
            src={image404}
            alt="Kucing menjatuhkan vas bunga"
            width={200}
            height={200}
          />

          <p className="p-4 text-lg text-center">
            Pertanyaan tidak ditemukan atau tidak diperbolehkan untuk diakses
            publik
          </p>

          <Button asChild>
            <Link href={`/p/${slug}`}>
              <PaperPlaneIcon className="mr-2 h-4 w-4" />
              Buat pertanyaan baru
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
