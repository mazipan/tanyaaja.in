import { getQuestionsByUid, getUserByUid, simplifyResponseObject } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  const uid = params.uid || ''
  try {

    const userInNotion = await getUserByUid(uid)

    if (userInNotion.results.length === 0) {
      return NextResponse.json({ message: `Can not found any questions for user ${uid}`, data: null }, { status: 400 })
    }

    const questionsInNotion = await getQuestionsByUid(uid)
    const results = questionsInNotion?.results || []
    // @ts-ignore
    const simpleResults = []

    results.forEach(result => {
      // @ts-ignore
      const properties = result.properties

      const simpleDataResponse = simplifyResponseObject(properties)

      simpleResults.push(simpleDataResponse)
    });


    // @ts-ignore
    return NextResponse.json({ message: `Found questions for user ${uid}`, data: simpleResults, },)
  } catch (error) {
    return NextResponse.json({ message: 'Error while get question by uid' }, { status: 500 })
  }
}