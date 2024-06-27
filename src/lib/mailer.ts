import Mailjet from 'node-mailjet'

import type { Question } from './types'

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
  reason,
}: {
  user: string
  reason: string
  question: Question
}) {
  await sendEmail({
    subject: '⚠️ Report Question',
    bodyText: `Hi, TanyaAja.

    User ${user} report question ${question.uuid}.

    >> Pertanyaan: ${question.question}
    >> Alasan: ${reason}

    Thanks.`,
    bodyHtml: `<h2>Hi, <b>TanyaAja</b>.</h2>
    <br/><br/>
    User <b>${user}</b> report question <b>${question.uuid}</b>.
    <br/><br/>
    >> Pertanyaan: <i>${question.question}</i>
    <br/>
    >> Alasan: <b>${reason}</b>
    <br/><br/>
    Thanks.`,
  })
}

export async function sendEmailReportUser({
  user,
  reason,
}: {
  user: string
  reason: string
}) {
  await sendEmail({
    subject: '⚠️ Report User',
    bodyText: `Hi, TanyaAja.

    User ${user} has been reported.

    >> Alasan: ${reason}

    Thanks.`,
    bodyHtml: `<h2>Hi, <b>TanyaAja</b>.</h2>
    <br/><br/>
    User <b>${user}</b> has been reported.
    <br/><br/>
    >> Alasan: <b>${reason}</b>
    <br/><br/>
    Thanks.`,
  })
}
