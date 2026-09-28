import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GuestRoute() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <p>Loading…</p>
      </div>
    );
  }

  return <Outlet />;
}

export default GuestRoute;
