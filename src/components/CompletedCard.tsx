import moment from 'moment';
import React from 'react'
import { Link } from 'react-router';

 interface myProps {
    id: number,
    created_at: string,
    currentQuestion: number,
    questions: [number],
    prevAnswer: [string],
    quizId: number,
    quizName:string,
    correctQuestion:[number],
    incorrectQuestion:[number]
  }

const CompletedCard: React.FC<myProps> = ({ id, created_at, questions,correctQuestion }): React.ReactNode => {
  
    const dateObject = new Date(created_at)
    const fromDate= moment(dateObject).fromNow()
  return (
    <Link to={{pathname:`/completed/${id}`}}>
        <div className='flex flex-row justify-between mb-2 bg-gray-200 p-3 shadow-lg rounded cursor-pointer transition-colors border-b-2 border-transparent hover:border-blue-500 w-full'>
        <div>Completed {fromDate}</div>
        {/* <div>{correctQuestion.length} / {questions.length} correct</div> */}
        <div className={`flex justify-center items-center w-12 h-12 rounded-full text-white font-bold ${correctQuestion.length/questions.length>=.75?'bg-green-400':'bg-red-400'}`}>{Math.round(correctQuestion.length/questions.length*100)}%</div>
      </div>
      </Link>
  )
}

export default CompletedCard