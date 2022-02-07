import toast, { Toaster } from 'react-hot-toast';
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

type AuthContextProviderProps = {
  children: ReactNode
}
export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          toast.error('Faltando informações da conta do Google.')
          throw new Error('Missing information from Google Account.')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
      return () => {
        unsubscribe();
      }
    })
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)
    
    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.')
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }
  return (
    <>
      <Toaster toastOptions={{
        error: {
          style: {
            background: '#3f2c2c',
            color: '#ff3a3a',
          }
        }
      }} />
      <AuthContext.Provider value={{ user, signInWithGoogle }}>{props.children}</AuthContext.Provider>
    </>
  )
}