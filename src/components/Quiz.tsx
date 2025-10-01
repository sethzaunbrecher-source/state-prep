import React from 'react'
import { Link } from 'react-router';

interface myProps {
  name: string,
  id:number|string
  // onClick:React.MouseEventHandler<HTMLDivElement>
}

const Quiz: React.FC<myProps> = ({ name, id }): React.ReactNode => {
  
  return (
    <Link to={{pathname:`/savedprogress/${id}`,  //<Link to={{pathname:`/questions/${id}/${limit}`,
    search:`${name}`}}>
      
      <div className='flex flex-row justify-between mb-2 bg-gray-200 p-3 shadow-lg rounded cursor-pointer transition-colors border-b-2 border-transparent hover:border-blue-500 w-full'>
        {name}
      </div>
      </Link>
  )
}

export default Quiz
