export interface UserProfile {
  uid: string
  image: string
  name: string
  slug: string
  count: number
  public: boolean
  x_username?: string
}

export interface AddUserArgs {
  uid: string
  name: string
  email: string
  image: string
}

export interface CreateSessionArgs {
  uid: string
  token: string
}

export interface Question {
  uuid: string
  uid: string
  question: string
  status: 'Done' | 'Not started'
  submitted_date: string
  public: boolean
}

export interface CustomOg {
  uid: string
  slug: string
  mode: 'simple' | 'advance'
  theme: 'hyper' | 'oceanic' | 'pumkin' | 'candy'
  simple_text: string
  code_public: string
  code_question: string
  created_time: string
}

export interface NotifChannel {
  uid: string
  slug: string
  telegram_username: string
  telegram_chat_id: string
  created_time: string
}

export interface UpdateUserArgs {
  pageId: string
  uid: string
  name: string
  slug: string
  image: string
  public: boolean
  x_username?: string
}

export interface UpdateUserCounterArgs {
  pageId: string
  count: number
}

export interface SubmitQuestionArgs {
  uid: string
  question: string
}

export type ClassMap = {
  id: string
  class: string
  cssNative?: string
}

export interface CreateCustomOgArgs {
  uid: string
  slug: string
  mode: 'simple' | 'advance'
  theme: string
  simpleText: string
  codePublic: string
  codeQuestion: string
}

export interface CreateNotifChannelArgs {
  uid: string
  slug: string
  telegram_username: string
  telegram_chat_id: string
}

export interface IResponseGetQuestionPagination {
  data: Question[]
  hasMore: boolean
  next: string
}

export interface IRequestPublicUserList {
  name: string
  limit: number
  offset: string | undefined
}

export interface IResponseGetPublicUserList {
  data: UserProfile[]
  hasMore: boolean
  next: string
}

export interface ICalculatePageItemCount<T> {
  data: T[]
  hasMore: boolean
  next: string
}
