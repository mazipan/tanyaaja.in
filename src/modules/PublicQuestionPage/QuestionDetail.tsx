"use client"

import { Card } from "@/components/ui/card"
import { patchHit } from "@/lib/api"
import { Question } from "@/lib/types"
import { useEffect } from "react"

export const QuestionDetail = ({ questions, slug }: { slug: string, questions: Question[] }) => {

  useEffect(() => {
    patchHit(slug)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full flex flex-col gap-2 justify-center items-center">
      {questions && questions.length > 0 ? (
        <>
          {questions.map(q => (
            <Card className="p-4 text-lg w-full min-h-[200px] md:w-[500px] lg:min-h-[400px] relative flex flex-col items-center justify-center" key={q.uuid}>
              {q.question}
            </Card>
          ))}
        </>
      ) : <p className="p-4 text-lg">Pertanyaan tidak ditemukan</p>}
    </div>
  )
}