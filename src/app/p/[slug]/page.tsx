import { ProfileAvatar } from "@/components/ProfileAvatar"
import { QuestionForm } from "@/modules/PublicQuestionPage/QuestionForm"
import { BASEURL, getOwnerUser } from "@/lib/api"
import { Metadata } from "next"
import { LinkAds } from "@/modules/PublicQuestionPage/LinkAds"

type PublicPageProps = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: PublicPageProps
): Promise<Metadata> {
  const slug = params.slug
  const ownerData = await getOwnerUser(slug as string)

  return {
    title: `Tanyakan ke ${ownerData?.data?.name} dengan anonim | TanyaAja`,
    description: `Tanyakan apa saja ke ${ownerData?.data?.name} dengan anonim`,
    openGraph: {
      siteName: 'TanyaAja.in',
      description: `Tanyakan apa saja ke ${ownerData?.data?.name} dengan anonim`,
      url: `${BASEURL}/p/${ownerData?.data?.slug}`,
      title: `Tanyakan ke ${ownerData?.data?.name} dengan anonim`,
      images: [{
        url: `${BASEURL}/api/og?user=${ownerData?.data?.name}`
      }]
    },
    twitter: {
      site: 'TanyaAja.in',
      description: `Tanyakan apa saja ke ${ownerData?.data?.name} dengan anonim`,
      creator: '@Maz_Ipan',
      title: `Tanyakan ke ${ownerData?.data?.name} dengan anonim`,
      images: [{
        url: `${BASEURL}/api/og?user=${ownerData?.data?.name}`
      }]
    }
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
          <ProfileAvatar
            size="96"
            image={owner?.data?.image}
            name={owner?.data?.name} />

          <h1 className="text-3xl font-extrabold">Tanya ke {owner?.data?.name}</h1>

          {owner ? (
            <QuestionForm owner={owner?.data} />
          ) : null}

          <LinkAds />
        </>
      ) : null}
    </main>
  )
}