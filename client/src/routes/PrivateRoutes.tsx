import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const PrivateRoutes = ({withNav=false, withSidebar=false}) => {
  const location = useLocation();
  const { token, loading } = useAuth();

  if (loading) {
    return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
  }

  if (!token) {
    return <Navigate to='/auth/login' replace state={{from: location}} />
  }

  return (
    <div className={`relative max-w-screen w-full `}> 
      {withNav&& <Navbar /> }
      <div className={`relative flex items-start w-full h-full ${withNav&&'pt-24'}`}>
        {withSidebar&&<Sidebar withNav/> }
        <div className={`grow`}>
          <Outlet /> 
        </div>
      </div>
    </div>
  )
}
export default PrivateRoutes