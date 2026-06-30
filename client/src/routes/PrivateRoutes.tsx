import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { RiMenuFill } from 'react-icons/ri';

const PrivateRoutes = ({withNav=false, dashboard=false}) => {
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
        {dashboard?
          <>
          <Sidebar withNav={withNav}/> 
          <div className={`grow bg-[#f3f3f3] min-w-0`}>
            <div className='flex gap-6 items-center p-4 md:p-6 z-10 sticky top-0 bg-[#0b0c4f] text-white font-[Outfit] shadow-sm border-b border-[#080930] shadow-black/10'>
              <RiMenuFill
              className='text-xl sm:text-2xl lg:hidden'
                onClick={()=>{
                  if (location.pathname.startsWith('/dashboard')) {
                    window.dispatchEvent(new Event('toggle-dashboard-sidebar'))
                    return;
                  }
                }}
              />
              <h1 className='text-2xl sm:text-3xl lg:text-4xl'>Dashboard</h1>
            </div>
            <Outlet />
          </div>
          </>
          :
          <Outlet /> 
        }
      </div>
    </div>
  )
}
export default PrivateRoutes