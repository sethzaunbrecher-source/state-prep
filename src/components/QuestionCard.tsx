import { useEffect, useState, } from 'react'
import { Link, useLocation, useNavigate, useParams, } from 'react-router'
import { supabase } from '../database/Supabase'
import { handleUpdateProgress } from '../utils/updateProgress'


interface Questions {
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
    quizzes: {
        id:number,
        created_at:string,
        quizName: string,
        isNational: boolean
    }
}

interface Answer {
    id: number,
    qId: number,
    text: string,
    choiceId: string
}


const QuestionCard = ({ }) => {

    const navigate = useNavigate()
    const location = useLocation()
    const isNational: boolean = location.state.isNational

    const quizId = Number(useParams().id)
    const limit = Number(useParams().limit)
    const savedId = Number(useParams().savedId)

    const fetchQuestions = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from("questions")
            .select('*,answers(*),quizzes("quizName")')
            .eq("quizId", quizId)

        if (error) {
            setFetchError("could not fetch questions")
            setQuestions([])
            console.error(error)
            setIsLoading(false)
        }

        if (data) {
            setQuestions(data)
            setCurrentQuestion(0)
            setFetchError(null)
            setIsLoading(false)
        }

    }

    const fetchRandomQuestions = async (limit: number, isNational: boolean) => {
        console.log(isNational)
        console.log(location.state)
        setIsLoading(true)
        const { data, error } = await supabase
            .from("random_questions")
            .select('*,answers(*),quizzes("*")')
            .eq("quizzes.isNational", isNational)
            .limit(limit)

        if (error) {
            setFetchError("could not fetch questions")
            setQuestions([])
            console.error(error)
            setIsLoading(false)
        }

        if (data) {
            console.log(data)
            setQuestions(data)
            setCurrentQuestion(0)
            setFetchError(null)
            setIsLoading(false)
        }

    }

    const [currentQuestion, setCurrentQuestion] = useState<number>(-1)
    const [isAnswered, setIsAnswered] = useState<boolean>(false)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [score, setScore] = useState<number>(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [correct, setCorrect] = useState<number[]>([])
    const [incorrect, setIncorrect] = useState<number[]>([])
    const [fetchError, setFetchError] = useState<any>(null)
    const [questions, setQuestions] = useState<Questions[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [widthPercentage, setWidthPercentage] = useState<string>('0%')
    const [shuffledArray, setShuffledArray] = useState<Answer[]>([])
    const [questionIdArray, setQuestionIdArray] = useState<number[]>([])

    const handleAnswer = (choiceId: string, correctAnswer: string): void => {
        setIsAnswered(true);
        setSelectedAnswer(choiceId)
        //add answer to array
        setAnswers([...answers, choiceId])
        //check if correct
        if (choiceId === correctAnswer) {
            setScore(score + 1)
            setCorrect([...correct, questions[currentQuestion].id])
        } else {
            setIncorrect([...incorrect, questions[currentQuestion].id]);
        }
    }


    const handleNext = (): void => {
        if (questions && currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion => currentQuestion + 1)
            const myNumber: number = ((currentQuestion / questions.length) * 100)
            const newPercentage: string = myNumber.toFixed(0)
            const myPercentage: string = newPercentage + "%"
            setWidthPercentage(myPercentage)
            setIsAnswered(false)
            setIsLoading(true)
            if (quizId != -2) {
                handleUpdateProgress(currentQuestion + 1, questionIdArray, answers, quizId, correct, incorrect, savedId)
            }
            setIsLoading(false)
        } else {
            if (quizId != -2) {
                alert(`You scored ${score}/${questions?.length}`)
                handleSaveProgress()
            } else {
                fetchRandomQuestions(10, isNational)
                setIsAnswered(false)
            }
        }
    }

    const shuffleAnswers = (array: Answer[]): Answer[] => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const questionIds = () => {
        const extractedIds = questions.map(question => question.id)
        return extractedIds
    }

    const handleDeleteProgress = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('saved_attempts')
            .delete()
            .eq('id', savedId)
            .select()


        if (error) {
            console.error('Error deleting data:', error.message);
            setFetchError(error.message)
            setIsLoading(false)
        }
        if (data) {
            setFetchError(null)
            setIsLoading(false)
            return navigate("/")

        }
    }

    const handleSaveProgress = async () => {
        setIsLoading(true)
        const questionArray: Number[] = questionIds()

        const { data, error } = await supabase
            .from('completed_attempts')
            .insert([
                {
                    currentQuestion: currentQuestion,
                    questions: questionArray,
                    prevAnswers: answers,
                    quizId: quizId,
                    correctQuestions: correct,
                    incorrectQuestions: incorrect
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

            //delete saved attempt
            handleDeleteProgress()

        }
    }

    useEffect(() => {
        if (quizId < 0) {
            fetchRandomQuestions(limit, isNational)
        } else {
            fetchQuestions()
        }
    }, [])

    useEffect(() => {
        if (questions.length) {

            const newAnswers = shuffleAnswers(questions[currentQuestion].answers)
            setShuffledArray(newAnswers)
        }
        if (currentQuestion > 0 && quizId != -2) {
            setIsLoading(true)
            handleUpdateProgress(currentQuestion + 1, questionIdArray, answers, quizId, correct, incorrect, savedId)
            setIsLoading(false)
        }

    },
        [currentQuestion, questions])

    useEffect(() => {
        const idArray = questionIds()
        setQuestionIdArray(idArray)
    }, [questions])
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
                                shuffledArray.map((choice) => (
                                    <button type="button" onClick={() => handleAnswer(choice.choiceId, questions[currentQuestion].correctAnswerId)} key={choice.choiceId} disabled={isAnswered}
                                        className={`block w-full p-2 mt-2 rounded border cursor-pointer
                         ${isAnswered ?
                                                choice.choiceId === questions[currentQuestion].correctAnswerId ?
                                                    "bg-green-300"
                                                    : selectedAnswer === choice.choiceId ?
                                                        "bg-red-300" : "" : ""}`}>
                                        {choice.text}
                                    </button>
                                ))
                            }

                            <button type="button" onClick={handleNext} disabled={!isAnswered} className={`block w-full p-2 mt-2 rounded border ${!isAnswered ? "bg-gray-300 text-black" : "bg-blue-400 text-white cursor-pointer"}`}>Next Question</button>
                            {quizId != -2 &&
                                <>
                                    <div className=" mt-3 w-full rounded-full h-2.5 bg-gray-300">
                                        <div className="rounded-full h-2.5 bg-blue-400" style={{ width: `${widthPercentage}` }}></div>
                                    </div>
                                    <p className='my-4'>{currentQuestion + 1} / {questions.length}</p>
                                </>
                            }

                        </div>
                    </div>
                </main>
            </div>

    )
}

export default QuestionCard
