import { User } from "firebase/auth"
import { Question, UpdateUserArgs } from "./types"

export const getExistingUser = async (user: User) => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/by-uuid/${user.uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })

  return rawRes.json()
}

export const getOwnerUser = async (slug: string) => {
  const rawRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/by-slug/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  return rawRes.json()
}

export const postAddUser = async (user: User) => {
  const token = await user.getIdToken()

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/add`, {
    method: 'POST',
    body: JSON.stringify({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
}

export const patchUpdateUser = async (user: User, param: Pick<UpdateUserArgs, 'name' | 'slug'>) => {
  const token = await user.getIdToken()

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update`, {
    method: 'PATCH',
    body: JSON.stringify({
      uid: user.uid,
      name: param.name,
      slug: param.slug,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
}

export const postSendQuestion = async (ownerUid: string, question: string) => {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/question/submit`, {
    method: 'POST',
    body: JSON.stringify({
      uid: ownerUid,
      question: question,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getAllQuestions = async (user: User): Promise<{ data: Question[] }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/question/by-uid/${user.uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })

  return rawRes.json()
}


export const patchQuestionAsDone = async (uuid: string, user: User) => {
  const token = await user.getIdToken()

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/question/mark-done/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
}

export const getQuestion = async (uuid: string): Promise<{ data: Question[] }> => {
  const rawRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/question/detail/${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return rawRes.json()
}