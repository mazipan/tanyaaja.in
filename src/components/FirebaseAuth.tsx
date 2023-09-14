"use client"

import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

export const useAuth = (auth: Auth) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const listener = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          setUser(currentUser)
          setIsLoading(false)
        } else {
          setUser(null)
          setIsLoading(false)
        }
      },
      () => {
        setIsLoading(false)
      }
    );

    return () => {
      listener();
    };
  }, [auth]);


  return {
    user,
    isLogin: !!user,
    isLoading
  };
}

export interface IAuthContext {
  isLogin: boolean
  isLoading: boolean
  user: User | null
}

const AuthContext = createContext<IAuthContext>({
  isLogin: false,
  isLoading: true,
  user: null
})

export const AuthProvider = ({ children, auth }: PropsWithChildren<{ auth: Auth }>) => {
  const { isLogin, isLoading, user } = useAuth(auth)
  return (
    <AuthContext.Provider
      value={{ user, isLogin, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
