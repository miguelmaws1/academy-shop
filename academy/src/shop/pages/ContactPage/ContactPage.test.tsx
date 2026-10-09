import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest'; 
import { ContactPage } from './ContactPage';
import { contactContent } from '../../content/contactContent';

describe('Navbar Component', () => {
  
  test('renders the contact page correctly', () => {  
    const { container } = render(<ContactPage />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();

    const cleanLines = contactContent
      .replace(/^#{1,6}\s+/gm, '')                  
      .replace(/(\*\*|__)(.*?)\1/g, '$2')          
      .replace(/(\*|_)(.*?)\1/g, '$2')             
      .replace(/^(\s*)[-*+]\s+/gm, '$1')           
      .replace(/^(\s*)\d+\.\s+/gm, '$1')           
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0); // Ignore totally empty lines

    cleanLines.forEach(line => {
      expect(container.textContent).toContain(line);
    });

  });

});
