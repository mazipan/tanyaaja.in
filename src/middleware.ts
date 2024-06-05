import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(_: NextRequest, __: NextResponse) {
  const headerInstance = headers()
  const apiKey = headerInstance.get('X-API-KEY')
  if (apiKey !== process.env.NEXT_API_KEY) {
    return NextResponse.json(
      { message: 'Can not found the API KEY' },
      { status: 401 },
    )
  }
}

export const config = {
  matcher: '/api/private/question/:path*',
}
