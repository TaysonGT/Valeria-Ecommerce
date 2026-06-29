import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const PublicRoute = ({withNav=false}) => {
  return (
    <div className='relative max-w-screen flex flex-col'> 
      {withNav&& <Navbar /> }
      <div className={`${withNav&&'pt-16 md:pt-20'}`}>
        <Outlet /> 
      </div>
    </div>
  )
}
export default PublicRoute