import { ProfileAvatar } from "@/components/ProfileAvatar"
import { getOwnerUser, getQuestion } from "@/lib/api"
import { LinkAds } from "@/modules/PublicQuestionPage/LinkAds"
import { QuestionDetail } from "@/modules/PublicQuestionPage/QuestionDetail"

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
          <ProfileAvatar
            image={owner?.data?.image}
            name={owner?.data?.name}
            size="96"
          />

          <h1 className="text-3xl font-extrabold">
            Pertanyaan untuk {owner?.data?.name}
          </h1>

          <QuestionDetail
            questions={question.data || []}
            slug={owner?.data?.slug} />

          <LinkAds />
        </>
      ) : null}
    </main>
  )
}