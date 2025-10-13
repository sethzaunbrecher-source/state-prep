import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { supabase } from '../database/Supabase'
import { fetchQuestions } from '../utils/fetchQuestions'

const CompletedListCard = () => {

    const navigate = useNavigate()
    const resultId = useParams().id

    interface Result {
        correctQuestion: number[],
        created_at: string,
        currentQuestion: number,
        id: number,
        incorrectQuestions: number[],
        prevAnswers: string[],
        questions: number[],
        quizId: number,
        quizzes: { quizName: string }

    }
interface Question {
    id: number,
    created_at: string,
    questionText: string,
    correctAnswerId: string,
    quizId: number,
    answers: {
        id: number,
        qId: number,
        text: string,
        choiceId: string
    }[],
    quizzes: { quizName: string }
}
    const [fetchError, setFetchError] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [result, setResult] = useState<Result | null>(null)
    const [questions, setQuestions]=useState<Question[]|undefined>(undefined)

    //fetch results
    const fetchResult = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.
            from('completed_attempts')
            .select('*, quizzes(quizName)')
            .eq('id', resultId)


        if (error) {
            setFetchError("could not fetch result")
            setResult(null)
            console.error(error)
            setIsLoading(false)
        }

        if (data) {
            setResult(data[0])
            setFetchError(null)
            setIsLoading(false)

        }
    }

    //fetch questions
    const getQuestions = async()=>{
        setIsLoading(true)
        const fetchData = await fetchQuestions(result?.questions)
        setFetchError(fetchData.error)
        setQuestions(fetchData.data)
        setIsLoading(false)
        console.log(fetchData)
    }

    useEffect(() => {
        setIsLoading(true)
        fetchResult()
        //getQuestions()
        setIsLoading(false)
    }, [])

    useEffect(()=>{
        setIsLoading(true)
        getQuestions()
        setIsLoading(false)
    },[result])

    return (
        <div className="bg-gray-200 p-4">
            <button onClick={() => navigate('/')} className={`p-4 rounded-lg border border-gray-500 w-fit ${isLoading ? 'disabled' : ''}`}>Go Home</button>
            {/* <Link to="/"><div className='p-4 rounded-lg border border-gray-500 w-fit '>Go Home</div></Link> */}
            {fetchError && <div>{fetchError}</div>}
            <main className="items-center justify-center px-3 pt-5 md:pt-16 pb-4 bg-gray-200 min-h-screen">
                <div className="flex justify-center items-center">
                    <div className="w-full lg:w-3/4 bg-white p-5 rounded shadow-lg min-h-3/4">
                        <button className='p-4 rounded-lg border border-gray-500 w-fit cursor-pointer ' onClick={() => navigate(-1)}>Go Back</button>
                        <div className="w-full p-5 rounded  min-h-3/4 font-bold text-xl bg-white">
                            {result?.quizzes.quizName}
                            <div className="font-normal grid grid-cols-1 lg:grid-cols-5">
                                {result?.questions.map((question, index) => (

                                    <Link to={`/answered/${resultId}`}
                                        state={
                                            {
                                                currentQuestion: index,
                                                selectedAnswers: result.prevAnswers,
                                                questions: result.questions
                                            }}
                                            key={index}
                                            className="m-2"
                                    >
                                        <div className='flex flex-row  items-center mb-2 bg-gray-200 p-3 shadow-lg rounded cursor-pointer transition-colors border-b-2 border-transparent hover:border-blue-500  text-sm lg:text-lg'>
                                            <div className={`cursor-pointer w-10 h-10 rounded-full flex m-2 justify-center align-middle items-center ${result.incorrectQuestions.includes(question) ? 'bg-red-300' : 'bg-green-300'}`} >

                                                {index + 1}
                                            </div>
                                            {questions && questions[index].questionText.length >= 25?
                                            `${questions?.[index].questionText.slice(0,25)}...`:
                                            `${questions?.[index].questionText}`}
                                            
                                        </div>
                                    </Link>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    )
}

export default CompletedListCard
