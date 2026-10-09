import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest'; 
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../common/components/AuthProvider';
import { CourseSupportPage } from './CourseSupportPage';

describe('AdminNavbar Component', () => {
  
  test('renders the academy admin navbar and links correctly', () => {
    render(
            <AuthProvider>
                <MemoryRouter>
                    <CourseSupportPage />
                 </MemoryRouter>
            </AuthProvider>
            
        );


    const mainText = screen.getByText('Selecciona el tab de la lista');
    expect(mainText).toBeInTheDocument();

    const tabSelector = document.getElementById('tab-title-selector');
    expect(tabSelector).toBeInTheDocument();
    expect(tabSelector?.tagName).toBe('SELECT');

  });

});
