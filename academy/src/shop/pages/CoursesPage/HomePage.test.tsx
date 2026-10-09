import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest'; 
import { CoursesPage } from './CoursesPage';
import { coursesContent } from '../../content/coursesContent';

describe('Navbar Component', () => {
  
  test('renders the courses page correctly', () => {  
    const { container } = render(<CoursesPage />);

    const cleanLines = coursesContent
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
