import  { useEffect, useState, } from 'react'
import { Link, useLocation, useNavigate,  } from 'react-router'
import { supabase } from '../database/Supabase'
import { sortQuestions } from '../utils/sortQuestions'


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

const AnsweredCard = () => {

    const navigate = useNavigate()
    const location = useLocation()

    //Fetch state from Link
    const questionsIds: number[] = location.state.questions
    const answers: string[] = location.state.selectedAnswers
    const currentQuestionIndex: number = location.state.currentQuestion

   
    const fetchQuestions = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from("questions")
            .select('*,answers(*),quizzes("quizName")')
            .in("id", questionsIds)

        if (error) {
            setFetchError("could not fetch question")
            setQuestions(undefined)
            console.error(error)
            setIsLoading(false)
        }

        if (data) {
            //setQuestions(data)

            const sortedData = sortQuestions(questionsIds, data)
            setQuestions(sortedData)
            setFetchError(null)
            setIsLoading(false)
        }

    }

    const handleQuestionChange = (action: string) => {

        let qLen: number = 0
        if (questions?.length) {
            qLen = questions.length
        }

        if (action === 'next' && currentQuestion + 1 < qLen) {
            setCurrentQuestion(currentQuestion + 1)
        } else
            if (action === 'prev' && currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1)
            }
    }

    const [isAnswered, setIsAnswered] = useState<boolean>(true)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [fetchError, setFetchError] = useState<any>(null)
    const [questions, setQuestions] = useState<Question[] | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [currentQuestion, setCurrentQuestion] = useState<number>(currentQuestionIndex | 0)

    useEffect(() => {
        setIsAnswered(true)
        fetchQuestions()
        setSelectedAnswer(answers[currentQuestion])
        //sortQuestions(questionsIds,questions)
    }, [])

    useEffect(() => {
        setSelectedAnswer(answers[currentQuestion])
    }, [currentQuestion])

    return (


        isLoading ? (<div>Getting your questions ready...</div>)

            :
            <div className="bg-gray-200 p-4">
                <Link to="/"><div className='p-4 rounded-lg border border-gray-500 w-fit '>Go Home</div></Link>
                {fetchError && <div>{fetchError}</div>}
                <main className="items-center justify-center px-3 pt-5 md:pt-16 pb-4 bg-gray-200 h-screen">
                    <div className="flex justify-center items-center">
                        <div className="w-full max-w-lg bg-white p-5 rounded shadow-lg min-h-3/4">
                            <button className='p-4 rounded-lg border border-gray-500 w-fit cursor-pointer ' onClick={() => navigate(-1)}>Go Back</button>
                            <div className="p-2 text-center font-bold mb-2 text-xl rounded shadow-lg">{questions && questions[currentQuestion].quizzes.quizName}</div>
                            {/* Question Text */}
                            <div>{questions && questions[currentQuestion].questionText} </div>
                            {/* Map over every question choice */}
                            {
                                questions?.[currentQuestion].answers.map((choice) => (

                                    <button type="button" disabled
                                        className={`block w-full p-2 mt-2 rounded border cursor-pointer
                         ${isAnswered ?
                                                choice.choiceId === questions[currentQuestion].correctAnswerId ?
                                                    "bg-green-300"
                                                    : selectedAnswer === choice.choiceId ?
                                                        "bg-red-300" : "" : ""}`}>
                                        {choice.text}{choice.choiceId}
                                    </button>
                                ))
                            }
                            <div className='flex w-full '>
                                <button disabled={currentQuestion == 0} onClick={() => handleQuestionChange('prev')} className='block w-full bg-blue-300 p-2 mt-2 rounded border cursor-pointer mr-1 disabled:bg-gray-200'>Previous</button>
                                <button disabled={currentQuestion + 1 === questions?.length} onClick={() => handleQuestionChange('next')} className='block w-full bg-blue-300 p-2 mt-2 rounded border cursor-pointer ml-1 disabled:bg-gray-200'>Next</button>
                            </div>

                            {/* <button type="button" onClick={handleNext} disabled={!isAnswered} className={`block w-full p-2 mt-2 rounded border ${!isAnswered ? "bg-gray-300 text-black" : "bg-blue-400 text-white cursor-pointer"}`}>Next Question</button> */}

                        </div>
                    </div>
                </main>
            </div>

    )
}

export default AnsweredCard
