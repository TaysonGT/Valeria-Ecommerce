import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
// import { useAuth } from '../context/AuthContext';

const LoginRoute = () => {
    const location = useLocation();
    // const { token, checkAuth } = useAuth()
    // useEffect(() => {
    //     checkAuth()
    // }, [location])
    
    if(location.pathname == '/auth') return <Navigate to={'/auth/login'} replace /> 

    // if(!token){
        return <Outlet />
    // }else{
    //     return <Navigate to="/"  replace state={{from: location}} />
    // }
}

export default LoginRoute