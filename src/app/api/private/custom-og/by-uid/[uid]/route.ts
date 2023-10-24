import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifyIdToken } from '@/lib/firebase-admin'
import { getCustomOgByUid, simplifyResponseObject } from '@/lib/notion'
import { CustomOg } from '@/lib/types'

export async function GET(request: Request) {
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')
  try {
    if (token) {
      const decodedToken = await verifyIdToken(token)

      const dataInNotion = await getCustomOgByUid(decodedToken.uid)
      const results = dataInNotion?.results || []
      // @ts-ignore
      const simpleResults: CustomOg[] = []

      results.forEach((result) => {
        // @ts-ignore
        const properties = result.properties

        const simpleDataResponse = simplifyResponseObject<CustomOg>(properties)

        simpleResults.push(simpleDataResponse)
      })

      return NextResponse.json({
        message: `Found custom og for user ${decodedToken.uid}`,
        data: simpleResults,
      })
    }

    return NextResponse.json(
      { message: `Can not found the session`, data: null },
      { status: 403 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get custom og by uid' },
      { status: 500 },
    )
  }
}
