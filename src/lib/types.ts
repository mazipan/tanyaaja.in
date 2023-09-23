export interface UserProfile {
  uid: string
  image: string
  name: string
  slug: string
  count: number
  public: boolean
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

export interface UpdateUserArgs {
  pageId: string
  uid: string
  name: string
  slug: string
  image: string
  public: boolean
}

export interface UpdateUserCounterArgs {
  pageId: string
  count: number
}

export interface SubmitQuestionArgs {
  uid: string
  question: string
}
