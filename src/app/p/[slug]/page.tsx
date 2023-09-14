import { ProfileAvatar } from "@/components/ProfileAvatar"
import { QuestionForm } from "@/modules/PublicQuestionPage/QuestionForm"
import { getOwnerUser } from "@/lib/api"
import { Metadata } from "next"

type PublicPageProps = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: PublicPageProps
): Promise<Metadata> {
  const slug = params.slug
  const ownerData = await getOwnerUser(slug as string)

  return {
    title: `Tanya apa saja ke ${ownerData?.data?.name} secara anonim`
  }
}

export default async function PublicPage({
  params: { slug },
}: PublicPageProps) {
  const ownerData = getOwnerUser(slug as string)

  const [owner] = await Promise.all([ownerData])

  return (
    <main className="flex flex-col gap-6 items-center py-16 px-4 md:px-8">
      {owner ? (
        <>
          <ProfileAvatar image={owner?.data?.image} name={owner?.data?.name} />
          <h1 className="text-3xl font-extrabold">Tanya ke {owner?.data?.name}</h1>
          <QuestionForm owner={owner?.data} />
        </>
      ) : null}
    </main>
  )
}