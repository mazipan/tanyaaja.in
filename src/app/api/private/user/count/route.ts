import { NextRequest, NextResponse } from 'next/server'

import { getRegisteredUsers } from '@/lib/notion'

export async function GET(request: NextRequest) {
  try {
    const usersInNotion = await getRegisteredUsers()

    return NextResponse.json({
      message: `Found registered users count`,
      data: usersInNotion.results.length,
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while get registered users count' },
      { status: 500 },
    )
  }
}
