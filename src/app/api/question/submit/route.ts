import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import {
  getUserBySlug,
  simplifyResponseObject,
  submitQuestion,
} from '@/lib/notion'

async function sendQuestion(slug: string, q: string) {
  const userInNotion = await getUserBySlug(slug)

  if (userInNotion.results.length === 0) {
    return NextResponse.json(
      { message: 'Owner of this page can not be found' },
      { status: 400 },
    )
  }

  const result = userInNotion.results[0]
  // @ts-ignore
  const properties = result.properties

  const simpleDataResponse = simplifyResponseObject(properties)

  await submitQuestion({
    // @ts-ignore
    uid: simpleDataResponse?.uid,
    question: q,
  })

  return NextResponse.json({ message: 'New question submitted' })
}

export async function POST(request: NextRequest) {
  const res = await request.json()

  try {
    const headersInstance = headers()
    if (process.env.NODE_ENV !== 'development') {
      const token = res.token
      if (!token) {
        return NextResponse.json(
          { message: 'Can not submit question' },
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
          return await sendQuestion(res.slug, res.question)
        }

        return NextResponse.json(
          { message: 'Failed while submitting new question' },
          { status: 400 },
        )
      }
    } else {
      return await sendQuestion(res.slug, res.question)
    }
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while submitting new question' },
      { status: 500 },
    )
  }
}
