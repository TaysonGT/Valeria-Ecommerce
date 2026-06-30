import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const PublicRoute = ({withNav=false}) => {
  return (
    <div className='relative max-w-screen flex flex-col min-h-screen'> 
      {withNav&& <Navbar /> }
      <div className={` grow h-full flex flex-col ${withNav&&'pt-16 lg:pt-20'}`}>
        <Outlet /> 
      </div>
    </div>
  )
}
export default PublicRoute