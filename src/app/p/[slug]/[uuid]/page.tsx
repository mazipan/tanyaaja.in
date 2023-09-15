import { ProfileAvatar } from "@/components/ProfileAvatar"
import { getOwnerUser, getQuestion } from "@/lib/api"
import { Card } from "@/components/ui/card"

type PublicPageProps = {
  params: { slug: string, uuid: string }
}

export default async function PublicPage({
  params: { slug, uuid },
}: PublicPageProps) {
  const ownerData = getOwnerUser(slug as string)
  const questionData = await getQuestion(uuid as string)

  const [owner, question] = await Promise.all([ownerData, questionData])

  return (
    <main className="flex flex-col gap-6 items-center py-16 px-4 md:px-8">
      {owner ? (
        <>
          <ProfileAvatar image={owner?.data?.image} name={owner?.data?.name} />
          <h1 className="text-3xl font-extrabold">Pertanyaan untuk {owner?.data?.name}</h1>
          <div className="w-full flex flex-col gap-2 justify-center items-center">
            {question && question.data && question.data.length > 0 ? (
              <>
                {question.data.map(q => (
                  <Card className="p-4 text-lg w-full min-h-[200px] md:w-[500px] lg:min-h-[400px] relative flex flex-col items-center justify-center" key={q.uuid}>
                    {q.question}
                  </Card>
                ))}
              </>
            ) : <p className="p-4 text-lg">Pertanyaan tidak ditemukan</p>}
          </div>
        </>
      ) : null}
    </main>
  )
}