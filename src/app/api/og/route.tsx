import { ImageResponse } from 'next/og'

import { CustomQuestionOgSimple } from '@/components/OgImage/CustomQuestionOgSimple'
import { CustomUserOgSimple } from '@/components/OgImage/CustomUserOgSimple'
import { DefaultOg } from '@/components/OgImage/DefaultOg'
import { QuestionOg } from '@/components/OgImage/QuestionOg'
import { UserOg } from '@/components/OgImage/UserOg'
import { getPublicCustomOg } from '@/lib/api'

// App router includes @vercel/og.
// No need to install it.
export const runtime = 'edge'

const BASE_OPTIONS = { width: 800, height: 600 }

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const type = searchParams.get('type')
  const slug = searchParams.get('slug')
  const name = searchParams.get('name')
  const question = searchParams.get('question')
  const forceSimpleMode = searchParams.get('forceSimpleMode')

  const theme = searchParams.get('theme')
  const text = searchParams.get('text')

  const customOg = await getPublicCustomOg(slug as string)

  if (type === 'user' && slug && slug !== 'undefined') {
    return new ImageResponse(
      <UserOg slug={slug || ''} name={name || ''} />,
      BASE_OPTIONS,
    )
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
      (
        <CustomUserOgSimple
          slug={slug || ''}
          theme={theme || ''}
          text={text || ''}
        />
      ),
      BASE_OPTIONS,
    )
  } else if (type === 'question' && question && question !== 'undefined') {
    return new ImageResponse(
      <QuestionOg question={question || ''} />,
      BASE_OPTIONS,
    )
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
          customOg.data.code_question.replaceAll('[question]', question),
        ),
        BASE_OPTIONS,
      )
    }

    // Fallback to simple mode
    return new ImageResponse(
      (
        <CustomQuestionOgSimple
          question={question || ''}
          theme={theme || ''}
          text={text || ''}
        />
      ),
      BASE_OPTIONS,
    )
  }

  return new ImageResponse(<DefaultOg />, BASE_OPTIONS)
}
