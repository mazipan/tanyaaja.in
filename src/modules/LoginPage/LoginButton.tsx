'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import slugify from '@sindresorhus/slugify'
import { useQueryClient } from '@tanstack/react-query'
import { signInWithPopup } from 'firebase/auth'

import { useAuth } from '@/components/FirebaseAuth'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { postAddUser } from '@/lib/api'
import {
  getFirebaseAuth,
  getGoogleAuthProvider,
  trackEvent,
} from '@/lib/firebase'
import { DEFAULT_AVATAR } from '@/lib/utils'

const GoogleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className="mr-2 h-4 w-4"
    >
      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
        <path
          fill="#4285F4"
          d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
        />
        <path
          fill="#34A853"
          d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
        />
        <path
          fill="#FBBC05"
          d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
        />
        <path
          fill="#EA4335"
          d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
        />
      </g>
    </svg>
  )
}

const auth = getFirebaseAuth()

export const LoginButtonWithRedirect = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { isLogin, isLoading, user } = useAuth(auth)
  const queryClient = useQueryClient()

  const handleLogin = () => {
    trackEvent('click login button')
    signInWithPopup(auth, getGoogleAuthProvider())
      .then(async (result) => {
        const user = result.user
        queryClient.setQueryData(['/owner', user.uid], {
          data: {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL || DEFAULT_AVATAR,
            slug: slugify(user.email?.split('@')[0] || ''),
            count: 0,
          },
        })
        toast({
          title: 'Success Login',
          description: `Berhasil login. Selamat datang ${user.displayName}!`,
        })

        postAddUser(user).then((result) => {
          if (result.isNewUser) {
            queryClient.refetchQueries({ queryKey: ['/owner', user.uid] })
          }
        })
      })
      .catch((error) => {
        toast({
          title: 'Gagal Login',
          description: `Gagal login: ${error.message}`,
          variant: 'destructive',
        })
      })
  }

  // Redirect back to /account --> if the session is already there
  useEffect(() => {
    if (!isLoading) {
      if (isLogin) {
        router.push('/account')
      }
    }
  }, [isLogin, isLoading, router, user])

  useEffect(() => {
    trackEvent('view login page')
  }, [])

  return (
    <Button onClick={handleLogin} type="button">
      <GoogleIcon />
      Lanjutkan dengan Akun Google
    </Button>
  )
}
