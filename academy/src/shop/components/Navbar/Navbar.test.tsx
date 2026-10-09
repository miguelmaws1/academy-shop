import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest'; 
import { Navbar } from './Navbar';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar Component', () => {
  
  test('renders the academy name and links correctly', () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    // Check if the logo is present
    const logo = screen.getByText('Saldivar Academia de Música');
    expect(logo).toBeInTheDocument();

    // Check if individual links exist using their accessible text
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/'); 

    const coursesLink = screen.getByRole('link', { name: 'Cursos' });
    expect(coursesLink).toBeInTheDocument();
    expect(coursesLink).toHaveAttribute('href', '/cursos'); 

    const contactLink = screen.getByRole('link', { name: 'Contacto' });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contacto');

  });

});
