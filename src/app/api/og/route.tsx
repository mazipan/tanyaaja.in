import { ImageResponse } from 'next/server'

import { CustomQuestionOgSimple } from '@/components/OgImage/CustomQuestionOgSimple'
import { CustomUserOgSimple } from '@/components/OgImage/CustomUserOgSimple'
import { DefaultOg } from '@/components/OgImage/DefaultOg'
import { QuestionOg } from '@/components/OgImage/QuestionOg'
import { UserOg } from '@/components/OgImage/UserOg'

// App router includes @vercel/og.
// No need to install it.
export const runtime = 'edge'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const type = searchParams.get('type')
  const slug = searchParams.get('slug')
  const name = searchParams.get('name')
  const question = searchParams.get('question')

  const theme = searchParams.get('theme')
  const text = searchParams.get('text')

  if (type === 'user' && slug && slug !== 'undefined') {
    return new ImageResponse(<UserOg slug={slug || ''} name={name || ''} />, {
      width: 800,
      height: 600,
    })
  } else if (
    type === 'custom-user' &&
    slug &&
    slug !== 'undefined' &&
    text &&
    text !== 'undefined' &&
    theme &&
    theme !== 'undefined'
  ) {
    return new ImageResponse(
      (
        <CustomUserOgSimple
          slug={slug || ''}
          theme={theme || ''}
          text={text || ''}
        />
      ),
      {
        width: 800,
        height: 600,
      },
    )
  } else if (type === 'question' && question && question !== 'undefined') {
    return new ImageResponse(<QuestionOg question={question || ''} />, {
      width: 800,
      height: 600,
    })
  } else if (
    type === 'custom-question' &&
    question &&
    question !== 'undefined' &&
    theme &&
    theme !== 'undefined'
  ) {
    return new ImageResponse(
      (
        <CustomQuestionOgSimple
          question={question || ''}
          theme={theme || ''}
          text={text || ''}
        />
      ),
      {
        width: 800,
        height: 600,
      },
    )
  }

  return new ImageResponse(<DefaultOg />, {
    width: 800,
    height: 600,
  })
}
