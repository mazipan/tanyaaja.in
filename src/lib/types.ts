export interface UserProfile {
  uid: string
  image: string
  name: string
  slug: string
  count: string
}

export interface AddUserArgs {
  uid: string
  name: string
  email: string
  image: string
}

export interface Question {
  uuid: string
  uid: string
  question: string
  status: 'Done' | 'Not started'
  submitted_date: string
}

export interface UpdateUserArgs {
  pageId: string
  uid: string
  name: string
  slug: string
  image: string
}

export interface UpdateUserCounterArgs {
  pageId: string
  count: string
}

export interface SubmitQuestionArgs {
  uid: string
  question: string
  status: string
}
