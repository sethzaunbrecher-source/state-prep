import React from 'react'
import { useNavigate } from 'react-router';

interface myProps {
  name: string,
  id: number | string,
  isNational: boolean
  // onClick:React.MouseEventHandler<HTMLDivElement>
}

const Quiz: React.FC<myProps> = ({ name, id, isNational }): React.ReactNode => {

  const navigate = useNavigate();

  let mypath: string = `/savedprogress/${id}`
  if (id == -2) {
    mypath = '/questions/-2/10/0'
  }

  return (
    <button onClick={() => {
      navigate({
        pathname: mypath,
        search: `${name}`
      },
        { state: { isNational: isNational } }
      )
    }
    }>

      <div className='flex flex-row justify-between mb-2 bg-gray-200 p-3 shadow-lg rounded cursor-pointer transition-colors border-b-2 border-transparent hover:border-blue-500 w-full'>
        {name}
      </div>
    </button>
  )
}

export default Quiz
