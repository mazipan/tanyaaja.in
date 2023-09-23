import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { destroySession, getSession } from '@/lib/notion'

export async function DELETE(request: Request) {
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')

  try {
    if (token) {
      const session = await getSession(token)
      if (session.results.length > 0) {
        const foundPage = session.results[0]
        if (foundPage) {
          destroySession(foundPage?.id)
        }
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
