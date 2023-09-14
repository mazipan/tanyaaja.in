import { User } from "firebase/auth"
import { UpdateUserArgs } from "./types"

export const getExistingUser = async (user: User) => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`/api/user/by-uuid/${user.uid}`, {
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

  await fetch('/api/user/add', {
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

  await fetch('/api/user/update', {
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
  await fetch('/api/question/submit', {
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