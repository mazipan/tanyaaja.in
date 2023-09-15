export interface UserProfile {
  uid: string
  image: string
  name: string
  slug: string
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
  status: string
}

export interface UpdateUserArgs {
  pageId: string
  uid: string
  name: string
  slug: string
}

export interface SubmitQuestionArgs {
  uid: string
  question: string
  status: string
}
