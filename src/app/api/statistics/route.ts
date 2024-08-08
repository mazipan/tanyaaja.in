import { NextResponse } from 'next/server'

import { getStatistics, simplifyResponseObject } from '@/lib/notion'
import { Statistic } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const resStats = await getStatistics()
    if (resStats.length > 0) {
      return NextResponse.json({
        message: `Public statistics`,
        data: {
          usersCount: resStats.find((i) => i.type === 'users')?.counter || 0,
          questionsCount:
            resStats.find((i) => i.type === 'questions')?.counter || 0,
        },
      })
    }

    return NextResponse.json({
      message: `Public statistics`,
      data: {
        usersCount: 0,
        questionsCount: 0,
      },
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json({
      message: `Public statistics`,
      data: {
        usersCount: 0,
        questionsCount: 0,
      },
    })
  }
}
