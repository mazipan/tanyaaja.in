import { getUserByUid } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const uid = params.uuid || ''
  const userInNotion = await getUserByUid(uid)

  if (userInNotion.results.length === 0) {
    return NextResponse.json({ message: `User ${uid} is not exist`, data: null }, { status: 400 })
  }

  const result = userInNotion.results[0]
  // @ts-ignore
  const properties = result.properties

  const simpleDataResponse = {}
  for (const [key, value] of Object.entries(properties)) {
    // @ts-ignore
    const type = value.type
    // @ts-ignore
    simpleDataResponse[key] = value[type][0].text.content
  }

  return NextResponse.json({ message: `Found user ${uid}`, data: simpleDataResponse, },)
}