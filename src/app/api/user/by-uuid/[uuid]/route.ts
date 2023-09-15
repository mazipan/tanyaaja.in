import { getUserByUid, simplifyResponseObject } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  const uid = params.uuid || ''
  try {
    const userInNotion = await getUserByUid(uid)

    if (userInNotion.results.length === 0) {
      return NextResponse.json({ message: `User ${uid} is not exist`, data: null }, { status: 400 })
    }

    const result = userInNotion.results[0]
    // @ts-ignore
    const properties = result.properties

    const simpleDataResponse = simplifyResponseObject(properties)

    return NextResponse.json({ message: `Found user ${uid}`, data: simpleDataResponse, },)
  } catch (error) {
    return NextResponse.json({ message: 'Error while get user by uuid' }, { status: 500 })
  }
}