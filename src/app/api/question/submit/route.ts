import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

import { BAD_WORDS_SET } from '@/lib/constants'
import {
  getUserBySlug,
  simplifyResponseObject,
  submitQuestion,
} from '@/lib/notion'
import { sendMessageToBot } from '@/lib/telegram'
import { UserProfile } from '@/lib/types'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Create a new ratelimiter, that allows 5 requests per 5 seconds
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, '5 s'),
})

async function sendQuestion(
  slug: string,
  q: string,
  limit: number,
  remaining: number,
) {
  const userInNotion = await getUserBySlug(slug)

  if (userInNotion.results.length === 0) {
    return NextResponse.json(
      { message: 'Owner of this page can not be found', data: null },
      {
        status: 400,
        headers: {
          'X-RateLimit-Limit': `${limit}`,
          'X-RateLimit-Remaining': `${remaining}`,
        },
      },
    )
  }

  const result = userInNotion.results[0]
  // @ts-ignore
  const properties = result.properties

  const simpleDataResponse = simplifyResponseObject<UserProfile>(properties)

  await submitQuestion({
    uid: simpleDataResponse?.uid,
    question: q,
  })

  try {
    await sendMessageToBot(simpleDataResponse, q)
  } catch {
    // do nothing
  }

  return NextResponse.json(
    { message: 'New question submitted', data: null },
    {
      status: 200,
      headers: {
        'X-RateLimit-Limit': `${limit}`,
        'X-RateLimit-Remaining': `${remaining}`,
      },
    },
  )
}

export async function POST(request: NextRequest) {
  const res = await request.json()

  const isQuestionContainsBadWord =
    res.question
      .split(' ')
      .filter((word: string) => BAD_WORDS_SET.has(word.toLowerCase())).length >
    0

  if (isQuestionContainsBadWord) {
    return NextResponse.json(
      {
        message: 'The question contains a bad word',
        data: 'CONTAINS_BAD_WORD',
      },
      { status: 400 },
    )
  }

  try {
    const headersInstance = headers()
    if (process.env.NODE_ENV !== 'development') {
      const token = res.token
      if (!token) {
        return NextResponse.json(
          { message: 'The request have been blocked by captcha', data: null },
          { status: 403 },
        )
      } else {
        const formData = new URLSearchParams()
        formData.append('secret', process.env.RECAPTCHA_SECRET_KEY || '')
        formData.append('response', token)

        const xRealIp = headersInstance.get('x-real-ip')
        const xForwardedFor = headersInstance.get('x-forwarded-for')

        let remoteip = ''
        if (request.ip) {
          remoteip = request.ip
        } else if (xRealIp) {
          remoteip = xRealIp
        } else if (xForwardedFor) {
          remoteip = `${xForwardedFor || ''}`.split(',')[0]
        }

        formData.append('remoteip', remoteip)

        const ratelimitResult = await ratelimit.limit(remoteip)
        if (!ratelimitResult.success) {
          return NextResponse.json(
            {
              message: 'The request has been rate limited',
              data: ratelimitResult,
            },
            {
              status: 200,
              headers: {
                'X-RateLimit-Limit': `${ratelimitResult.limit}`,
                'X-RateLimit-Remaining': `${ratelimitResult.remaining}`,
              },
            },
          )
        }

        const reCaptchaRes = await fetch(
          `https://www.google.com/recaptcha/api/siteverify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
          },
        ).then((fetchResponse) => {
          return fetchResponse.json()
        })

        if (reCaptchaRes?.score > 0.5) {
          return await sendQuestion(
            res.slug,
            res.question,
            ratelimitResult.limit,
            ratelimitResult.remaining,
          )
        }

        return NextResponse.json(
          {
            message:
              'Failed while submitting new question, it is being blocked by captcha.',
            data: reCaptchaRes?.score || 0,
          },
          {
            status: 400,
            headers: {
              'X-RateLimit-Limit': `${ratelimitResult.limit}`,
              'X-RateLimit-Remaining': `${ratelimitResult.remaining}`,
            },
          },
        )
      }
    } else {
      return await sendQuestion(res.slug, res.question, 1000, 1000)
    }
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while submitting new question', data: null },
      { status: 500 },
    )
  }
}
