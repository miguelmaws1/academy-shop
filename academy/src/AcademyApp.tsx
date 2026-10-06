import { RouterProvider } from 'react-router-dom'
import { appRouter } from './app.router';
import { AuthProvider } from './common/components/useAuth';

export const AcademyApp = () => {
  return (
    <AuthProvider>
       <RouterProvider router={appRouter}/>
    </AuthProvider>
   
  );
};
