import { getPublicUserList, simplifyResponseObject } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request
) {
  try {
    const publicUsers = await getPublicUserList()

    if (publicUsers.results.length === 0) {
      return NextResponse.json({ message: `Can not found public users`, data: null }, { status: 400 })
    }

    const results = publicUsers?.results || []
    // @ts-ignore
    const simpleResults = []
    results.forEach(result => {
      // @ts-ignore
      const properties = result.properties

      const simpleDataResponse = simplifyResponseObject(properties)

      // Need to strip the uid data
      simpleResults.push({
        // @ts-ignore
        image: simpleDataResponse?.image,
        // @ts-ignore
        name: simpleDataResponse?.name,
        // @ts-ignore
        email: simpleDataResponse?.email,
        // @ts-ignore
        count: simpleDataResponse?.count,
        // @ts-ignore
        slug: simpleDataResponse?.slug,
      })
    });

    // @ts-ignore
    return NextResponse.json({ message: `Found public users`, data: simpleResults, },)
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json({ message: 'Error while get public users' }, { status: 500 })
  }
}