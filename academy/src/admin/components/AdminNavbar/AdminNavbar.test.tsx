import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest'; 
import { AdminNavbar } from './AdminNavbar';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../common/components/AuthProvider';

describe('AdminNavbar Component', () => {
  
  test('renders the academy admin navbar and links correctly', () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <AdminNavbar />
             </MemoryRouter>
        </AuthProvider>
        
    );

    // Check if the logo is present
    const logo = screen.getByText('Administración del Sistema');
    expect(logo).toBeInTheDocument();

    // Check if individual links exist using their accessible text
    const consoleLink = screen.getByRole('link', { name: 'Consola' });
    expect(consoleLink).toBeInTheDocument();
    expect(consoleLink).toHaveAttribute('href', '/consola'); 

    const coursesSupport = screen.getByRole('link', { name: 'Soporte Cursos' });
    expect(coursesSupport).toBeInTheDocument();
    expect(coursesSupport).toHaveAttribute('href', '/soporte-cursos'); 

    const tabEditorLink = screen.getByRole('link', { name: 'Editor Tabs' });
    expect(tabEditorLink).toBeInTheDocument();
    expect(tabEditorLink).toHaveAttribute('href', '/editor-tabs');

  });

});

const mockLogout = vi.fn(); // short for Vitest

vi.mock("../../../common/components/AuthProvider", () => ({
  AuthProvider: ({ children }: any) => children,
  useAuth: () => ({ logout: mockLogout }),
}));


test('checks academy admin section log out',async () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <AdminNavbar />
             </MemoryRouter>
        </AuthProvider>
        
    );

    const logout = screen.getByRole('link', { name: 'Salir' });
    const user = userEvent.setup();
    await user.click(logout);

    expect(mockLogout).toHaveBeenCalledTimes(1);
});