import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const PrivateRoutes = ({withNav=false}) => {
  

  // useEffect(() => {
  //   checkAuth()
  // }, [location])

  return (
    // token? 
    <div className='relative max-w-screen flex flex-col h-screen overflow-x-hidden'> 
      {withNav&& <Navbar /> }
      <div className='grow'>
        <Outlet /> 
      </div>
    </div> 
    // : <Navigate to='/auth/login' replace state={{from: location}} />
  )
}
export default PrivateRoutes