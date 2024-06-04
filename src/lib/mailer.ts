import Mailjet from 'node-mailjet'

import { Question } from './types'

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
})

export async function sendEmail({
  subject,
  bodyText,
  bodyHtml,
}: {
  subject: string
  bodyText: string
  bodyHtml: string
}) {
  try {
    const promiseRequest = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'tanyasajaapp+bot@gmail.com',
            Name: 'TanyaAja Bot',
          },
          To: [
            {
              Email: 'tanyasajaapp@gmail.com',
              Name: 'TanyaAja App',
            },
          ],
          Subject: subject,
          TextPart: bodyText,
          HTMLPart: bodyHtml,
        },
      ],
    })
    await promiseRequest
  } catch (err) {
    // @ts-ignore
    console.error('Failed send email: ', err?.message || '', err?.statusCode)
  }
}

export async function sendEmailReportQuestion({
  user,
  question,
}: {
  user: string
  question: Question
}) {
  await sendEmail({
    subject: 'Report Question',
    bodyText: `Hi, TanyaAja.

    User ${user} report question ${question.uuid}.

    >> ${question.question}

    Thanks.`,
    bodyHtml: `Hi, TanyaAja.

    User ${user} report question ${question.uuid}.

    >> ${question.question}

    Thanks.`,
  })
}
