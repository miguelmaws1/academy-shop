
import { useAuth } from '../../../common/components/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

export const AdminNavbar = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout = () => {
    // 1. Clear the authentication token/state
    logout(); 

    // 2. Redirect the user back to the login page
    navigate("/administracion-del-sistema", { replace: true });
  };
  return (
   <nav className="main-navbar font-montserrat" style={{backgroundColor: 'green'}}>
      {}
      <h1 className="font-montserrat" style={{ fontWeight: 700 }}>Administración del Sistema</h1>
      
      {}
      <ul className="nav-links-list">
        <li>
          <Link to="consola" >Consola</Link>
        </li>
        <li>
          <Link to="soporte-cursos">Soporte Cursos</Link>
        </li>
        <li>
          <Link to="editor-tabs">Editor Tabs</Link>
        </li>
        <li>
          <Link to="" onClick={handleLogout}>Salir</Link>
        </li>
      </ul>
    </nav>
  );
}
