import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Adjust to your actual path

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // If not logged in, redirect to the admin login page
  if (!isAuthenticated) {
    return <Navigate to="/administracion-del-sistema" replace />;
  }

  // If logged in, let them through to the AdminLayout / Dashboard
  return <Outlet />;
}
