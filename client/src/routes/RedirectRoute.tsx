import { Navigate, useLocation } from 'react-router';

const RedirectRoute = ({target='/'}) => {
    const location = useLocation();

    return <Navigate to={target} replace state={location.state} />
}
export default RedirectRoute