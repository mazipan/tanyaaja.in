import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProfileAvatar } from '@/components/ProfileAvatar'
import { BASEURL, getPublicOwnerUser } from '@/lib/api'
import { LinkAds } from '@/modules/PublicQuestionPage/LinkAds'
import { QuestionForm } from '@/modules/PublicQuestionPage/QuestionForm'

type PublicPageProps = {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: PublicPageProps): Promise<Metadata> {
  const slug = params.slug
  const ownerData = await getPublicOwnerUser(slug as string)

  return {
    title: `Tanyakan apa aja ke ${ownerData?.data?.name} dengan anonim | TanyaAja`,
    description: `Tanyakan apa saja ke ${ownerData?.data?.name} dengan anonim`,
    metadataBase: new URL(BASEURL),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      siteName: 'TanyaAja.in',
      description: `Tanyakan apa saja ke ${ownerData?.data?.name} dengan anonim`,
      url: `${BASEURL}/p/${ownerData?.data?.slug}`,
      title: `Tanyakan apa aja ke ${ownerData?.data?.name} dengan anonim`,
      images: [
        {
          url: `${BASEURL}/api/og?type=user&user=${ownerData?.data?.name}&slug=${ownerData?.data?.slug}`,
        },
      ],
    },
    twitter: {
      site: 'TanyaAja.in',
      description: `Tanyakan apa saja ke ${ownerData?.data?.name} dengan anonim`,
      creator: '@Maz_Ipan',
      title: `Tanyakan apa aja ke ${ownerData?.data?.name} dengan anonim`,
      images: [
        {
          url: `${BASEURL}/api/og?type=user&user=${ownerData?.data?.name}&slug=${ownerData?.data?.slug}`,
        },
      ],
    },
  }
}

export default async function PublicPage({
  params: { slug },
}: PublicPageProps) {
  const ownerData = getPublicOwnerUser(slug as string)

  const [owner] = await Promise.all([ownerData])

  if (!owner?.data) {
    notFound()
  }

  return (
    <main className="flex flex-col gap-6 items-center py-16 px-4 md:px-8">
      {owner ? (
        <>
          <ProfileAvatar
            size="96"
            image={owner?.data?.image}
            name={owner?.data?.name}
          />

          <h1 className="text-3xl font-extrabold text-center">
            Tanya ke {owner?.data?.name}
          </h1>

          {owner && owner?.data ? <QuestionForm owner={owner?.data} /> : null}

          <LinkAds />
        </>
      ) : null}
    </main>
  )
}
