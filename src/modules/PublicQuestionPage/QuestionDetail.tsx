"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { patchHit } from "@/lib/api"
import { Question } from "@/lib/types"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useEffect } from "react"

import image404 from "../../../public/images/404.png"
import Image from "next/image"

export const QuestionDetail = ({ questions, slug }: { slug: string, questions: Question[] }) => {

  useEffect(() => {
    if (slug) {
      patchHit(slug)
    }
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
      ) :
        <div className="w-full flex gap-4 items-center justify-centerflex flex-col">
          <Image src={image404} alt="Kucing menjatuhkan vas bunga" width={200} height={200} />

          <p className="p-4 text-lg text-center">Pertanyaan tidak ditemukan atau tidak diperbolehkan untuk diakses publik</p>


          <Button type="submit" asChild>
            <Link href={`/p/${slug}`}>
              <PaperPlaneIcon className="mr-2 h-4 w-4" />
              Buat pertanyaan baru
            </Link>
          </Button>
        </div>
      }
    </div>
  )
}