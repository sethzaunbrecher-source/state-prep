import React, { useState } from 'react'
import {  useNavigate } from 'react-router'
import { supabase } from '../database/Supabase';

const LoginCard = () => {

    const navigate = useNavigate();

    // async function signUpWithEmail(email: string, password: string) {
    //     const { data, error } = await supabase.auth.signUp({
    //         email: email,
    //         password: password
    //     })
    //     if (data) {
    //         console.log(data)
    //     }
    // }

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [user, setUser] = useState<any | null>(null)
    const [isPassword, setIsPassword]=useState<boolean>(true)

    async function loginWithEmail(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) {
            console.error(error)
            setErrorMessage(error.message)
            return
        }
        if (data) {
            setErrorMessage(null)
            setUser(data)
            return data
        }
    }

    const handleIconToggle=()=>{
        setIsPassword(!isPassword)
    }
    const userIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>

    const eyeIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>

    const noEyeIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const email: string = formData.get("email") as string;
        const password: string = formData.get("password") as string;

        const loggedInUser = await loginWithEmail(email, password)
        if (loggedInUser) {
            navigate("/")
        }

    }


    return (
        <div className="bg-gray-200 p-4">
            <div className="flex justify-center items-center h-screen">
                <main className="shadow min-w-1/4 w-full lg:w-1/4 rounded-2xl items-center justify-center lg:px-3 pt-5 md:pt-16 pb-16 bg-white ">
                    <h2 className="flex font-bold text-2xl">{userIcon} Login </h2>
                    <hr />
                    {errorMessage && <div className='w-full p-3 rounded-xl bg-red-200 mt-3 text-red-700 text-sm'>{errorMessage}</div>}
                    {user && <div>{user.user.email}</div>}
                    <form className="px-3 pt-5 pb-4 flex flex-col gap-4" onSubmit={handleSubmit}>
                        <input type="email" name="email" placeholder='Email Address' required className=" p-2 mt-8 rounded-xl border" />
                        <div className='relative'>
                            <input type={isPassword ? "password": "text"} name="password" placeholder='Password' required className=" p-2 rounded-xl border w-full" />
                            <div onClick={handleIconToggle} className="absolute cursor-pointer text-gray-400 right-3 top-1/2 transform -translate-y-1/2">{isPassword ? eyeIcon : noEyeIcon}</div>
                        </div>
                        <button className='cursor-pointer bg-blue-400 rounded-xl text-white py-2 hover:border hover:border-blue-400 hover:text-blue-400 hover:bg-transparent hover:transition'>Login</button>


                    </form>
                </main>
            </div>
        </div >
    )
}

export default LoginCard
