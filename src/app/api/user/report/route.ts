import { type NextRequest, NextResponse } from 'next/server'

import { sendEmailReportUser } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const res = await request.json()
    const reason = res.reason || ''
    const user = res.user || ''

    await sendEmailReportUser({
      user: user,
      reason,
    })

    return NextResponse.json({
      message: `Success report user ${user}`,
    })
  } catch (error) {
    console.error(request.url, error)
    return NextResponse.json(
      { message: 'Error while report user' },
      { status: 500 },
    )
  }
}
