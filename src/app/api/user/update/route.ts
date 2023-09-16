import { getUserByUid, updateUser } from '@/lib/notion'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  const res = await request.json()
  try {
    const userInNotion = await getUserByUid(res.uid)
    if (userInNotion.results.length === 0) {
      return NextResponse.json({ message: 'User is not exist' }, { status: 400 })
    } else {
      const foundPage = userInNotion.results[0]
      await updateUser({
        name: res.name,
        slug: res.slug,
        uid: res.uid,
        pageId: foundPage.id,
        image: res.image
      })

      revalidatePath(`/p/${res.slug}`)
      revalidateTag(res.slug)

      return NextResponse.json({ message: 'User updated' })
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error while updating the user' }, { status: 500 })
  }

}