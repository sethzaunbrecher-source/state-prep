import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router'
import './App.css'
import { Welcome } from './components/welcome'
import LoginCard from './components/Login'
import ProtectedRoute from './database/ProtectedRoute'
import QuestionCard from './components/QuestionCard'
import ProgressQuestionCard from './components/ProgressQuestionCard'
import SavedProgress from './components/SavedProgress'
import CompletedListCard from './components/CompletedListCard'
import AnsweredCard from './components/AnsweredCard'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<ProtectedRoute />}>
          <Route index element={<Welcome />} />
          <Route path='questions/:id/:limit/:savedId' element={<QuestionCard/>}/>
          <Route path='savedprogress/:id' element={<SavedProgress/>}/>
          <Route path='progressdetail/:id' element={<ProgressQuestionCard/>}/>
          <Route path='completed/:id' element={<CompletedListCard/>}/>
          <Route path='answered/:id' element={<AnsweredCard/>}/>
        </Route>
        <Route path='login' element={<LoginCard />} />
      </Route>
    ),
    {basename:'/state-prep/'}
  )


  return (
    <RouterProvider router={router} />
  )
}

export default App
