import { Navigate, Outlet } from "react-router-dom";
import { AdminNavbar } from "../components/AdminNavbar/AdminNavbar";
import { useAuth } from '../../common/components/AuthProvider';

export const AdminLayout = () => {
  const { isAuthenticated, loading } = useAuth(); 

  if (loading) {
    return <div>Cargando...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/administracion-del-sistema" replace />;
  }

  return (
    <div>
        <AdminNavbar/>
        <Outlet />
    </div>
  );
};