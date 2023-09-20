import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { addUser, getUserByUid } from '@/lib/notion'
import { createSession } from '@/lib/notion'
import { addDays } from '@/lib/utils'

export async function POST(request: Request) {
  const res = await request.json()
  const headersInstance = headers()
  const token = headersInstance.get('Authorization')

  try {
    const userInNotion = await getUserByUid(res.uid)

    if (token) {
      await createSession({
        token,
        uid: res?.uid,
        expire: addDays(new Date().toISOString(), 30).toISOString(),
      })
    }

    if (userInNotion.results.length === 0) {
      await addUser(res)
      return NextResponse.json({ message: 'New user added' })
    }

    return NextResponse.json(
      { message: 'User is already exist' },
      { status: 400 },
    )
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while adding user' },
      { status: 500 },
    )
  }
}
