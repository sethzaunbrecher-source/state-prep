import Quiz from "./Quiz";
import { supabase } from "../database/Supabase";
import { useEffect, useState } from "react";
import {useAuth} from '../contexts/AuthContext'
import SliderSwitch from "../assets/SliderSwitch";


export function Welcome() {

  const showIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>

  const hideIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>

  const sessionData = useAuth()

  interface Quiz {
    id: number,
    quizName: string,
    created_at: string
  }

  const [fetchError, setFetchError] = useState<any>(null)
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null)
  const [isRandomHidden, setIsRandomhidden] = useState<boolean>(false)
  const [isQuizHidden, setIsQuizHidden] = useState<boolean>(false)
  const [isNational, setIsNational]=useState<boolean>(true)

 const fetchQuizzes = async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select()
        .eq("isNational",isNational)

      if (error) {
        setFetchError("could not fetch quizzes")
        setQuizzes(null)
        console.error(error)
      }

      if (data) {
        const sortedData = data.sort((a,b)=>a.id - b.id)
        setQuizzes(sortedData)
        setFetchError(null)
      }
    }
  useEffect(() => {
    fetchQuizzes()
  }, [])

  useEffect(()=>{
    fetchQuizzes()
  },[isNational])

  const handleSignOut = () => {
    sessionData.signOut()
  }

  const handleToggle=()=>{
    setIsNational(!isNational)
  }

  return (
    <div className="bg-gray-200 p-4">
      <button className='p-4 rounded-lg border border-gray-500 w-fit ' onClick={handleSignOut}>Sign Out</button>
      <div className="flex justify-center items-center min-h-screen">
        <main className="shadow w-full lg:max-w-3/4 rounded-2xl items-center justify-center px-3 pt-5 md:pt-16 pb-16 bg-white">
          <div className="flex flex-col items-center justify-center px-3 pt-16 pb-4">
            {fetchError && <div> {fetchError}</div>}
            <SliderSwitch isNational={isNational} handleToggle={handleToggle}/>
            <div onClick={() => setIsRandomhidden(!isRandomHidden)} className="p-2 text-center font-bold mb-2 text-xl rounded flex justify-center cursor-pointer">
              <span className='font-bold text-xl'>{isRandomHidden ? showIcon : hideIcon} </span>Random Questions
            </div>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-2 w-full transition-[height] duration-500 ease-in-out overflow-hidden ${isRandomHidden ? 'h-0' : 'h-auto'}`}>
              <Quiz name="Flashcards" id={-2} isNational={isNational}/>
              <Quiz name="Random Quiz" id={-1} isNational={isNational}/>
            </div>
            
            <div onClick={() => setIsQuizHidden(!isQuizHidden)} className="p-2 text-center font-bold mb-2 text-xl rounded flex justify-center cursor-pointer">
              <span className='font-bold text-xl'>{isQuizHidden ? showIcon : hideIcon} </span>Quizzes
            </div>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-2 w-full transition-[height] duration-500 ease-in-out overflow-hidden ${isQuizHidden ? 'h-0' : 'h-auto'}`}>
              {quizzes?.
                filter(q => q.id >= 0)
                .map((quiz) => (
                  <Quiz key={quiz.id} name={quiz.quizName} id={quiz.id} isNational={isNational} />
                )
                )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}