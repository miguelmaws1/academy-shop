import { Link } from 'react-router-dom';

export const Navbar = () => {
    
  return (
   <nav className="main-navbar font-montserrat" >
      {}
      <h1 className="font-montserrat" style={{ fontWeight: 700 }}>Saldivar Academia de Música</h1>
      
      {}
      <ul className="nav-links-list">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cursos">Cursos</Link>
        </li>
        <li>
          <Link to="/contacto">Contacto</Link>
        </li>
      </ul>
    </nav>
  );
}
