import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest'; 
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../common/components/AuthProvider';
import { LoginAdminPage } from './LoginAdminPage';

describe('Login Admin Component and static labels', () => {
  
  test('renders the admin login', () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <LoginAdminPage />
             </MemoryRouter>
        </AuthProvider>
        
    );

    // Check if the logo is present
    const welcome = screen.getByText('Bienvenido a Administracion del Sistema');
    expect(welcome).toBeInTheDocument();
    const indication = screen.getByText('Favor de ingresar tu usuario y contraseña.');
    expect(indication).toBeInTheDocument();


  });

  test('renders the admin login errors', async () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <LoginAdminPage/>
             </MemoryRouter>
        </AuthProvider>       
    );

    const submitButton = screen.getByRole('button',{ name: 'Ingresar' });
    const user = userEvent.setup();

    await user.click(submitButton);   
    expect(document.getElementById('errorMessage')).toHaveTextContent('Favor de llenar todos los campos'); 

    const userInput = screen.getByLabelText('Usuario');
    await user.type(userInput, 'mytext@example.com');
    expect(userInput).toHaveValue('mytext@example.com');

    await user.click(submitButton);
    expect(document.getElementById('errorMessage')).toHaveTextContent('Favor de llenar todos los campos');

    const passInput = screen.getByLabelText('Contraseña');
    await user.type(passInput, 'my pass');
    expect(passInput).toHaveValue('my pass');

    await user.click(submitButton);
    expect(document.getElementById('errorMessage')).toBeNull();
  });

});
