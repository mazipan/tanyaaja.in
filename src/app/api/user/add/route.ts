import { addUser, getUserByUid } from '@/lib/notion'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const res = await request.json()

  try {
    const userInNotion = await getUserByUid(res.uid)
    if (userInNotion.results.length === 0) {
      await addUser(res)
      return NextResponse.json({ message: 'New user added' })
    }

    return NextResponse.json({ message: 'User is already exist' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ message: 'Error while adding user' }, { status: 500 })
  }
}