import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, } from 'react-router'
import { supabase } from '../database/Supabase'
import ProgressCard from './ProgressCard'
import CompletedCard from './CompletedCard'
import useAuth from '../contexts/AuthContext'


const SavedProgress = ({}) => {

  const quizId = useParams().id

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fetchError, setFetchError] = useState<null | String>(null)
  const [savedAttempts, setSavedAttempts] = useState<SavedAttempts[]>([])
  const [completedAttempts, setCompletedAttempts] = useState<SavedAttempts[]>([])
  const [isProgressHidden, setIsProgresshidden] = useState<boolean>(false)
  const [isCompleteHidden, setIsCompleteHidden] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<number>(0)

  const showIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>

  const hideIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>



  interface SavedAttempts {
    id: number,
    created_at: string,
    currentQuestion: number,
    questions: [number],
    prevAnswer: [string],
    correctQuestions: [number],
    incorrectQuestions: [number],
    quizId: number,
    quizzes: {
      id: number,
      quizName: string,
      created_at: string
    }
  }

  const sessionData=useAuth()


  const navigate = useNavigate()
  const location=useLocation()
  const isNational=location.state.isNational

  const handleNewQuiz = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('saved_attempts')
      .insert([
        {
          currentQuestion: 0,
          questions: [],
          prevAnswers: [],
          quizId: quizId,
          isNational:isNational,
          user_id:sessionData.session.user.id
        }
      ])
      .select()

    if (error) {
      console.error('Error inserting data:', error.message);
      setFetchError(error.message)
      setIsLoading(false)
    }
    if (data) {
      setFetchError(null)
      setIsLoading(false)

      return navigate({
        pathname: `/questions/${quizId}/${selectedValue}/${data[0].id}`},
        {state:{isNational:isNational}
      })

    }
  }
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(parseInt(e.target.value))
  }
  const fetchInProgress = async () => {
    setIsLoading(true)

    const { data, error } = await supabase
      .from('saved_attempts')
      .select('*,quizzes(*)')
      .eq('quizId', quizId)
      .eq('isNational', isNational)
      .eq('user_id', sessionData.session.user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching data:', error.message);
      setFetchError(error.message)
      setIsLoading(false)
    }
    if (data) {
      setFetchError(null)
      setSavedAttempts(data)
      setIsLoading(false)

    }
  }

  const fetchCompleted = async () => {
    setIsLoading(true)

    const { data, error } = await supabase
      .from('completed_attempts')
      .select('*,quizzes(*)')
      .eq('quizId', quizId)
      .eq('isNational', isNational)
      .eq('user_id',sessionData.session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching data:', error.message);
      setFetchError(error.message)
      setIsLoading(false)
    }
    if (data) {
      setFetchError(null)
      setCompletedAttempts(data)
      setIsLoading(false)

    }
  }

  useEffect(() => {
    fetchInProgress()
    fetchCompleted()
  }, [])

  return (

       isLoading ? (<div>Getting your questions ready...</div>)

            :
    <div className="bg-gray-200 p-4">
      <Link to="/"><div className='p-4 rounded-lg border border-gray-500 w-fit '>Go Home</div></Link>
      <div className="flex justify-center items-center min-h-screen">
        {fetchError && <div>{fetchError}</div>}
        <main className="shadow w-full lg:max-w-3/4 rounded-2xl items-center justify-center px-3 pt-5 md:pt-16 pb-16 bg-white">
          {quizId && parseInt(quizId) < 0 &&
            <div className='flex flex-col justify-center align-middle items-center'>
              <label className='block mb-2 text-lg font-normal text-gray-900 dark:text-white' htmlFor='questionDropdown'>Number of Questions: </label>
              <select
                id='questionDropdown'
                value={selectedValue}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                onChange={handleSelectChange}>

                <option value={0}>--Select an Option--</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={160}>160</option>

              </select>
            </div>
          }
          <div className="flex justify-around">
            <button disabled={quizId && parseInt(quizId)<0 && selectedValue==0?true:false} onClick={handleNewQuiz} className="text-center items-center justify-center mx-1 block w-full lg:w-1/2  text-white p-2 mt-2 rounded-xl border disabled:bg-gray-300 disabled:cursor-default bg-green-500 cursor-pointer">Start New Quiz</button>
          </div>
          <div onClick={() => setIsProgresshidden(!isProgressHidden)} className="p-2 text-center font-bold mb-2 text-xl rounded flex justify-center cursor-pointer">
            <span className='font-bold text-xl'>{isProgressHidden ? showIcon : hideIcon} </span>In Progress
          </div>
          {!isProgressHidden &&
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {savedAttempts.map((attempt) => (
                <ProgressCard
                  key={attempt.id}
                  created_at={attempt.created_at}
                  currentQuestion={attempt.currentQuestion}
                  questions={attempt.questions}
                  id={attempt.id}
                  prevAnswer={attempt.prevAnswer}
                  quizId={attempt.quizId}
                  quizName={attempt.quizzes.quizName}
                  corectQuestion={attempt.correctQuestions}
                  incorrectQuestion={attempt.incorrectQuestions}

                />
              ))}
            </div>
          }

          <div onClick={() => setIsCompleteHidden(!isCompleteHidden)} className="p-2 text-center font-bold mb-2 text-xl rounded flex justify-center cursor-pointer">
            <span className='font-bold text-xl'>{isCompleteHidden ? showIcon : hideIcon} </span>Completed
          </div>
          {!isCompleteHidden &&
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {completedAttempts.map((attempt) => (
                <CompletedCard
                  key={attempt.id}
                  created_at={attempt.created_at}
                  currentQuestion={attempt.currentQuestion}
                  questions={attempt.questions}
                  id={attempt.id}
                  prevAnswer={attempt.prevAnswer}
                  quizId={attempt.quizId}
                  quizName={attempt.quizzes.quizName}
                  correctQuestion={attempt.correctQuestions}
                  incorrectQuestion={attempt.incorrectQuestions}
                />
              ))}
            </div>
          }
        </main>
      </div>
    </div>
  )
}

export default SavedProgress
