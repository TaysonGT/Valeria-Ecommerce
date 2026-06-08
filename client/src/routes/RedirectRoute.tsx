import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RedirectRoute = ({target='/'}) => {
    const location = useLocation();

    return <Navigate to={target} replace state={location.state} />
}
export default RedirectRoute