import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ProfileAvatar } from '@/components/ProfileAvatar'
import {
  BASEURL,
  getPublicCustomOg,
  getPublicOwnerUser,
  getQuestionDetail,
} from '@/lib/api'
import type { Question } from '@/lib/types'
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

  const owner = await getPublicOwnerUser(slug as string)
  const question = await getQuestionDetail(uuid as string)
  const customOg = await getPublicCustomOg(slug as string)
  const ownerSlug = owner?.data?.slug
  const ownerName = owner?.data?.name

  const q: Question = (question?.data || [])[0] || {}

  const title = `Pertanyaan anonim untuk ${ownerName} di TanyaAja.in`
  const description = `Cuplikan dari pertanyaan anonim yang disampaikan kepada ${ownerName}`
  const url = `${BASEURL}/p/${ownerSlug}/${q?.uuid}`

  let ogImage = ''

  const encodedQuestion = encodeURIComponent(q?.question)

  if (customOg?.data) {
    if (customOg.data.code_question) {
      // -- mode advanced
      ogImage = `${BASEURL}/api/og?type=custom-question&question=${encodedQuestion}&slug=${ownerSlug}`
    } else if (customOg.data.simple_text) {
      // -- mode simple
      ogImage = `${BASEURL}/api/og?type=custom-question&question=${encodedQuestion}&slug=${ownerSlug}&name=${ownerName}&theme=${customOg?.data?.theme}&text=${customOg?.data?.simple_text}`
    }
  }

  if (!ogImage) {
    ogImage = `${BASEURL}/api/og?type=question&slug=${ownerSlug}&name=${ownerName}&question=${encodedQuestion}`
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(BASEURL),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      siteName: 'TanyaAja.in',
      description,
      title,
      url: url,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: 'TanyaAja.in',
      description,
      title,
      creator: '@Maz_Ipan',
      images: [
        {
          url: ogImage,
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
            Pertanyaan anonim untuk {owner?.data?.name}
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
