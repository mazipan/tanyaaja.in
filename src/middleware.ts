import { type NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  // eslint-disable-next-line no-console
  console.log('>>> Middleware...', request.url)
  const requestHeaders = new Headers(request.headers)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const acceptHeader = requestHeaders.get('accept') || '*/*'
  const isWebp =
    (acceptHeader?.indexOf('image/webp') >= 0 || acceptHeader === '*/*') ??
    false
  response.headers.set('x-webp', isWebp ? '1' : '0')

  const { isBot } = userAgent(request)
  response.headers.set('x-bot', isBot ? '1' : '0')

  return response
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|favicon|logo|service-worker.js|sitemap-index.xml|sitemaps.xml|manifest.webmanifest).*)',
  ],
}
