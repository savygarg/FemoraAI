import { Navigate, Outlet } from 'react-router-dom';
import { isDemoAuthenticated } from '../utils/auth';

function GuestRoute() {
  if (isDemoAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
