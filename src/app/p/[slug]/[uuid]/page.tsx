import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProfileAvatar } from '@/components/ProfileAvatar'
import { BASEURL, getPublicOwnerUser, getQuestionDetail } from '@/lib/api'
import { Question } from '@/lib/types'
import { LinkAds } from '@/modules/PublicQuestionPage/LinkAds'
import { QuestionDetail } from '@/modules/PublicQuestionPage/QuestionDetail'

type PublicQuestionPageProps = {
  params: { slug: string; uuid: string }
}

export async function generateMetadata({
  params,
}: PublicQuestionPageProps): Promise<Metadata> {
  const slug = params.slug
  const uuid = params.uuid

  const ownerData = getPublicOwnerUser(slug as string)
  const questionData = getQuestionDetail(uuid as string)

  const [owner, question] = await Promise.all([ownerData, questionData])

  const q: Question = (question?.data || [])[0] || {}

  return {
    title: `Intip pertanyaan anonim untuk ${owner?.data?.name} | TanyaAja`,
    description: `Cuplikan pertanyaan anonim yang disampaikan kepada ${owner?.data?.name}`,
    metadataBase: new URL(BASEURL),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      siteName: 'TanyaAja.in',
      description: `Cuplikan pertanyaan anonim yang disampaikan kepada ${owner?.data?.name}`,
      url: `${BASEURL}/p/${owner?.data?.slug}`,
      title: `Intip pertanyaan anonim untuk ${owner?.data?.name}`,
      images: [
        {
          url: `${BASEURL}/api/og?type=question&question=${q?.question}`,
        },
      ],
    },
    twitter: {
      site: 'TanyaAja.in',
      description: `Cuplikan pertanyaan anonim yang disampaikan kepada ${owner?.data?.name}`,
      creator: '@Maz_Ipan',
      title: `Intip pertanyaan anonim untuk ${owner?.data?.name}`,
      images: [
        {
          url: `${BASEURL}/api/og?type=question&question=${q?.question}`,
        },
      ],
    },
  }
}

export default async function PublicQuestionPage({
  params: { slug, uuid },
}: PublicQuestionPageProps) {
  const ownerData = await getPublicOwnerUser(slug as string)
  const questionData = await getQuestionDetail(uuid as string)

  const [owner, question] = await Promise.all([ownerData, questionData])

  if (!owner?.data) {
    notFound()
  }

  return (
    <main className="flex flex-col gap-6 items-center py-16 px-4 md:px-8">
      {owner ? (
        <>
          <ProfileAvatar
            image={owner?.data?.image}
            name={owner?.data?.name}
            size="96"
          />

          <h1 className="text-3xl font-extrabold text-center">
            Intip pertanyaan untuk {owner?.data?.name}
          </h1>

          <QuestionDetail
            questions={(question.data || []).filter((q) => q.public)}
            slug={owner?.data?.slug}
          />

          <LinkAds />
        </>
      ) : null}
    </main>
  )
}
