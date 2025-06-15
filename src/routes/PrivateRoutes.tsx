import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const PrivateRoutes = () => {
  const location = useLocation()

  // useEffect(() => {
  //   checkAuth()
  // }, [location])

  return (
    // token? 
    <div className='relative'> 
      <Navbar /> 
      <Outlet /> 
    </div> 
    // : <Navigate to='/auth/login' replace state={{from: location}} />
  )
}
export default PrivateRoutes