import { ImageResponse } from 'next/og'

import { CustomQuestionOgSimple } from '@/components/OgImage/CustomQuestionOgSimple'
import { CustomUserOgSimple } from '@/components/OgImage/CustomUserOgSimple'
import { DefaultOg } from '@/components/OgImage/DefaultOg'
import { QuestionOg } from '@/components/OgImage/QuestionOg'
import { UserOg } from '@/components/OgImage/UserOg'
import { getPublicCustomOg } from '@/lib/api'
import { truncateText } from '@/lib/utils'

// App router includes @vercel/og.
// No need to install it.
export const dynamic = 'force-dynamic'

const BASE_OPTIONS = { width: 800, height: 400 }

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const type = searchParams.get('type')
  const slug = searchParams.get('slug')
  const name = searchParams.get('name')
  const question = truncateText(searchParams.get('question') ?? '', 700)
  const decodedQuestion = decodeURIComponent(question)
  const forceSimpleMode = searchParams.get('forceSimpleMode')

  const theme = searchParams.get('theme')
  const text = searchParams.get('text')

  const customOg = await getPublicCustomOg(slug as string)

  if (type === 'user' && slug && slug !== 'undefined') {
    return new ImageResponse(
      <UserOg slug={slug || ''} name={name || ''} />,
      BASE_OPTIONS,
    )
    // biome-ignore lint/style/noUselessElse: sebuah alasan
  } else if (
    // Custom OG for profile page `/p/[slug]`
    type === 'custom-user' &&
    slug &&
    slug !== 'undefined'
  ) {
    if (customOg.data?.code_public && !forceSimpleMode) {
      // Advanced mode
      return new ImageResponse(
        JSON.parse(customOg.data.code_public),
        BASE_OPTIONS,
      )
    }

    // Fallback to simple mode
    return new ImageResponse(
      <CustomUserOgSimple
        slug={slug || ''}
        theme={theme || ''}
        text={text || ''}
      />,
      BASE_OPTIONS,
    )
    // biome-ignore lint/style/noUselessElse: sebuah alasan
  } else if (type === 'question' && question && question !== 'undefined') {
    return new ImageResponse(
      <QuestionOg question={decodedQuestion || ''} />,
      BASE_OPTIONS,
    )
    // biome-ignore lint/style/noUselessElse: sebuah alasan
  } else if (
    // Custom OG for questions page `/p/[slug]/[uuid]`
    type === 'custom-question' &&
    question &&
    question !== 'undefined'
  ) {
    if (customOg.data?.code_question && !forceSimpleMode) {
      // Advanced mode
      return new ImageResponse(
        JSON.parse(
          customOg.data.code_question.replaceAll('[question]', decodedQuestion),
        ),
        BASE_OPTIONS,
      )
    }

    // Fallback to simple mode
    return new ImageResponse(
      <CustomQuestionOgSimple
        question={decodedQuestion || ''}
        theme={theme || ''}
        text={text || ''}
      />,
      BASE_OPTIONS,
    )
  }

  return new ImageResponse(<DefaultOg />, BASE_OPTIONS)
}
