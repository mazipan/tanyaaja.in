import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-auth-edge'

export async function middleware(request: NextRequest) {
  try {
    const headersInstance = headers()
    const token = headersInstance.get('Authorization')

    if (!token) {
      throw new Error('', { cause: 'TOKEN_NOT_FOUND' })
    }

    const decodedToken = await verifyIdToken(token, true)

    // Add new request headers
    // Ref: https://vercel.com/templates/next.js/edge-functions-modify-request-header
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('user-id', decodedToken.uid)

    return NextResponse.next({
      request: { headers: requestHeaders },
    })
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error(error)

    const type = error?.code || error?.cause
    let message: string
    let status: number

    switch (type) {
      case 'TOKEN_NOT_FOUND':
        message = 'Can not found the session.'
        status = 403
        break

      case 'TOKEN_EXPIRED':
        message = 'Session has expired. Please log in again to continue.'
        status = 401
        break

      case 'INVALID_SIGNATURE':
        message = 'Invalid token signature.'
        status = 401
        break

      default:
        message = 'An internal server error occurred. Please try again later.'
        status = 500
        break
    }

    return NextResponse.json({ message }, { status })
  }
}

export const config = {
  // @TODO: the middleware should be applied to All private routes
  matcher: '/api/private/user/delete',
}
