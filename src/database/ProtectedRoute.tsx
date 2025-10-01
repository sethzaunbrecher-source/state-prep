import { Navigate, Outlet } from 'react-router'
import {useAuth} from '../contexts/AuthContext'

const ProtectedRoute = () => {
    
    const useContext =useAuth()
    
    return useContext.user ?<Outlet/>:<Navigate to="/login" replace />
}

export default ProtectedRoute
