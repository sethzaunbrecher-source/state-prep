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
    corectQuestion:[number],
    incorrectQuestion:[number],
    
  }

const ProgressCard: React.FC<myProps> = ({ id, created_at, currentQuestion,questions }): React.ReactNode => {
  
    const dateObject = new Date(created_at)
    const fromDate= moment(dateObject).fromNow()
  return (
    <Link to={
      {pathname:`/progressdetail/${id}`}
      }>
        <div className='flex flex-row justify-between mb-2 bg-gray-200 p-3 shadow-lg rounded cursor-pointer transition-colors border-b-2 border-transparent hover:border-blue-500 w-full'>
        <div>Started {fromDate}</div>
        <div>{currentQuestion} / {questions.length} answered</div>
        <div>{Math.round(currentQuestion/questions.length*100)}% complete</div>
      </div>
      </Link>
  )
}

export default ProgressCard