import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { revokeRefreshTokens, verifyIdToken } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function DELETE(request: Request) {
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')

  try {
    if (token) {
      const decodedToken = await verifyIdToken(token)

      if (decodedToken?.uid) {
        await revokeRefreshTokens(decodedToken.uid)
      }
    }
    return NextResponse.json({ message: 'Session destroyed' })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while destroying the session' },
      { status: 500 },
    )
  }
}
