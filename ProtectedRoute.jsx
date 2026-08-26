import { Navigate, Outlet } from 'react-router-dom';
import { isDemoAuthenticated } from '../utils/auth';

function ProtectedRoute() {
  if (!isDemoAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
