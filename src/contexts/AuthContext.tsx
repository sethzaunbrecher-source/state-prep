import {createContext, useContext, useState, useEffect} from 'react'
import { supabase } from '../database/Supabase'
import type { AuthTokenResponsePassword } from '@supabase/supabase-js'



interface T {}
type Credentials={
    email:string,
    password:string
}

interface AuthContextType{
    session:any|null,
    user: any|null
    signIn:(credentials:Credentials)=>Promise<AuthTokenResponsePassword>
    signOut:()=>Promise<any>
}
const AuthContext=createContext<AuthContextType|null>(null)

export function AuthProvider({children}:any){

    const [session, setSession]=useState<T|null>(null)
    const [user, setUser]=useState<T|null>(null)
    const [loading, setLoading]=useState(true)

    useEffect(()=>{
        const getInitialSession = async()=>{
            const{data:{session}}=await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user || null)
            setLoading(false)
        }
        getInitialSession()

      const {data:{subscription}}=supabase.auth.onAuthStateChange(
        (_event, session)=>{
            setSession(session)
            setUser(session?.user||null)
            setLoading(false)
        }
      )
      return()=>subscription.unsubscribe()

    },[])

    const value = {
        session,
        user,
        signIn: (credentials:Credentials)=>supabase.auth.signInWithPassword(credentials),
        signOut:()=>supabase.auth.signOut()      
    }

    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

    
}

export const useAuth=()=>{
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context
}

export default useAuth
