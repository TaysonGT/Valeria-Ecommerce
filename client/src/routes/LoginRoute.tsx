import { Navigate, useLocation, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

const LoginRoute = () => {
    const location = useLocation();
    const { token, loading } = useAuth()
    const from = (location.state as any)?.from?.pathname || '/'

    if(location.pathname === '/auth') return <Navigate to={'/auth/login'} replace state={location.state} />

    if (loading) {
      return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
    }

    if (token) {
      return <Navigate to={from} replace />
    }

    return <Outlet />
}

export default LoginRoute