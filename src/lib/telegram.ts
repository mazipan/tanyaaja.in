import { BASEURL } from './api'
import { getNotifChannelByUid, simplifyResponseObject } from './notion'
import { NotifChannel, UserProfile } from './types'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || ''
const BASE_URL_TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

export interface Chat {
  id: number
  first_name: string
  last_name: string
  username: string
  type: string
}

export interface Message {
  message_id: number
  text: string
  chat: Chat
  date: number
}

export interface UpdateItem {
  update_id: number
  message: Message
}

export interface getUpdatesResponse {
  ok: boolean
  result: UpdateItem[]
}

export const getUpdates = async (username: string) => {
  if (TELEGRAM_BOT_USERNAME && TELEGRAM_BOT_TOKEN) {
    // eslint-disable-next-line no-console
    const reponseRaw = await fetch(`${BASE_URL_TELEGRAM_API}/getUpdates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (reponseRaw.ok) {
      const response: getUpdatesResponse =
        (await reponseRaw.json()) as getUpdatesResponse
      if (response?.ok && response?.result && Array.isArray(response?.result)) {
        const matchMessage = (response?.result || []).find((message) => {
          const isStartCommand = message?.message?.text === '/start'
          const isFromUsername = message?.message?.chat?.username === username
          return isStartCommand && isFromUsername
        })
        if (matchMessage) {
          return matchMessage
        }
      }
    }
  }

  return null
}

export const getChatIdByUid = async (uid: string): Promise<string> => {
  if (TELEGRAM_BOT_USERNAME && TELEGRAM_BOT_TOKEN) {
    const dataInNotion = await getNotifChannelByUid(uid)
    const results = dataInNotion?.results || []
    if (results.length > 0) {
      // @ts-ignore
      const properties = results[0].properties
      const simpleDataResponse =
        simplifyResponseObject<NotifChannel>(properties)
      return simpleDataResponse?.telegram_chat_id
    }
  }

  return ''
}

export const sendMessageToBot = async (
  userProfile: UserProfile,
  message: string,
) => {
  if (TELEGRAM_BOT_USERNAME && TELEGRAM_BOT_TOKEN) {
    const chatID = await getChatIdByUid(userProfile?.uid)

    const requestBody = {
      chat_id: chatID,
      parse_mode: 'MarkdownV2',
      text: `
              *📥 New Question For You*

              *Question*: ${message}

              Kunjungi: ${BASEURL}/account`,
    }

    if (chatID) {
      // eslint-disable-next-line no-console
      fetch(`${BASE_URL_TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          res.json().then((data) => {
            // eslint-disable-next-line no-console
            console.log('Sending message to telegram', data)
          })
        })
        .catch(() => {
          console.error('Failed when sending message to telegram')
        })
    }
  } else {
    // eslint-disable-next-line no-console
    console.debug('Skip sending message to telegram')
  }
}
