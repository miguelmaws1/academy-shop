import { useAuth } from '../../common/components/useAuth';
import { useState} from 'react'; 
import { useNavigate, Navigate} from 'react-router-dom';

export const LoginAdminPage = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  
  // Clean object destructuring matching your exact hook structure
  const { login, isAuthenticated} = useAuth();
  
  console.log('is already authenticated ' + isAuthenticated);
  // Redirect authenticated admins directly to the console dashboard
  if (isAuthenticated) { 
    return <Navigate to="consola" replace />;
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => { 
    e.preventDefault(); 
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const result = await login(username, password);
    if (!result.success) { 
      setError("Usuario o contraseña inválidos(a)");
      console.log(result.error);
    } else {
      console.log('Usuario valido');
      navigate("consola"); // Safe relative path execution
    }
  };

  return (
    <div className="login-admin">
      <form className="login-admin" onSubmit={handleSubmit}>
        <h2 className="login-admin-title">Bienvenido a Administracion del Sistema</h2>
        <h2 className="login-admin-subtitle">Favor de ingresar tu usuario y contraseña.</h2>

        {/* Display Status Messages */}
        {error && <div className="login-admin-error">{error}</div>}
        {success && <div className="login-admin-error">{success}</div>}

        {/* user Input */}
        <div >
          <label htmlFor="user">Usuario</label>
          <br/>
          <input
            className="login-admin-input"
            type="user"
            id="user"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={(e) => {
              setError('');
              setUsername(e.target.value);
            }}
          />
        </div>

        {/* Password Input */}
        <div >
          <label htmlFor="password">Contraseña</label>
          <br/>
          <input
            className="login-admin-input"
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => {
              setError('');
              setPassword(e.target.value);
            }}
          />
        </div>

        {/* Submit Button */}
        <button className="login-admin-button" type="submit" >Ingresar</button>
      </form>
    </div>
  );

};

