import { User } from "firebase/auth"
import { Question, UpdateUserArgs, UserProfile } from "./types"

export const BASEURL = `${process.env.NEXT_PUBLIC_BASE_URL}`

export const getExistingUser = async (user: User): Promise<{ data: UserProfile }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${BASEURL}/api/private/user/by-uuid/${user.uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    next: {
      tags: ['user-by-uuid', user.uid]
    }
  })

  return rawRes.json()
}

export const getPublicOwnerUser = async (slug: string): Promise<{ data: UserProfile }> => {
  const rawRes = await fetch(`${BASEURL}/api/user/by-slug/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      tags: ['user-by-slug', slug]
    }
  })

  return rawRes.json()
}

export const checkTheSlugOwner = async (user: User, slug: string) => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${BASEURL}/api/private/user/slug-checker/${slug}`, {
    method: 'POST',
    body: JSON.stringify({
      uid: user.uid,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })

  return rawRes.json()
}

export const postAddUser = async (user: User) => {
  const token = await user.getIdToken()

  await fetch(`${BASEURL}/api/private/user/add`, {
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

export const patchUpdateUser = async (user: User, param: Pick<UpdateUserArgs, 'name' | 'slug' | 'image' | 'public'>) => {
  const token = await user.getIdToken()

  await fetch(`${BASEURL}/api/private/user/update`, {
    method: 'PATCH',
    body: JSON.stringify({
      uid: user.uid,
      name: param.name,
      slug: param.slug,
      image: param.image,
      public: param.public ?? false,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
}

export const patchHit = async (slug: string) => {
  await fetch(`${BASEURL}/api/tracker/hit/${slug}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const postSendQuestion = async (slug: string, question: string) => {
  await fetch(`${BASEURL}/api/question/submit`, {
    method: 'POST',
    body: JSON.stringify({
      slug: slug,
      question: question,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getAllQuestions = async (user: User): Promise<{ data: Question[] }> => {
  const token = await user.getIdToken()

  const rawRes = await fetch(`${BASEURL}/api/private/question/by-uid/${user.uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    next: {
      tags: ['q-by-uid', user.uid]
    }
  })

  return rawRes.json()
}

export const patchQuestionAsDone = async (uuid: string, user: User) => {
  const token = await user.getIdToken()

  await fetch(`${BASEURL}/api/private/question/mark-done/${uuid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
}

export const patchQuestionAsPublicOrPrivate = async (uuid: string, access: 'PUBLIC' | 'PRIVATE', user: User) => {
  const token = await user.getIdToken()

  await fetch(`${BASEURL}/api/private/question/toggle-access/${uuid}`, {
    method: 'PATCH',
    body: JSON.stringify({
      access: access,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
}

export const getQuestionDetail = async (uuid: string): Promise<{ data: Question[] }> => {
  const rawRes = await fetch(`${BASEURL}/api/question/detail/${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    next: {
      tags: ['q-by-uuid', uuid]
    }
  })

  return rawRes.json()
}

export const destroyActiveSession = async (user: User) => {
  const token = await user.getIdToken()

  await fetch(`${BASEURL}/api/private/user/session-destroy`, {
    method: 'DELETE',
    body: JSON.stringify({
      uid: user.uid,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
}


export const getAllPublicUsers = async (): Promise<{ data: UserProfile[] }> => {
  const rawRes = await fetch(`${BASEURL}/api/user/public-list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    next: {
      tags: ['public-users']
    }
  })

  return rawRes.json()
}