import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest'; 
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../common/components/AuthProvider';
import { TabPage } from './TabPage';
import { sendTab } from "../../../common/services/TabApi";

vi.mock('../../../common/services/TabApi', () => ({
  sendTab: vi.fn(),
}));

describe('Checks Tab Page', () => { 
  test('renders the Tab Page and checks default values', () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <TabPage />
             </MemoryRouter>
        </AuthProvider>
        
    );

    const indication = screen.getByText('Ingresa la información del tab');
    expect(indication).toBeInTheDocument();

    const tabTempo = document.getElementById('tempo-text');
    expect(tabTempo).toHaveValue(60);

    const selectTimeBeat = document.getElementById('time-beats-text');
    expect(selectTimeBeat).toHaveValue('4');

    const selectTimeValue = document.getElementById('time-value-text');
    expect(selectTimeValue).toHaveValue('4');

    const instrumentLayout = document.getElementById('instrument-layout-text');
    expect(instrumentLayout).toHaveValue('E-B-G-D-A-E');

    const tabText = document.getElementById('tab-text');
    expect(tabText).toHaveValue('E |-------------------|\nB |-------------------|\nG |-------------------|\nD |-------------------|\nA |-------------------|\nE |---1---2---3---4---|');
  });

  test('renders the Tab Page errors, success send event and select depending on other select', async () => {
    render(
        <AuthProvider>
            <MemoryRouter>
                <TabPage/>
             </MemoryRouter>
        </AuthProvider>       
    );

    const user = userEvent.setup();
    const sendButton = screen.getByRole('button',{ name: 'Enviar' });
    await user.click(sendButton);
    expect(document.getElementById('errorMessage')).toHaveTextContent('El título es obligatorio');

    vi.mocked(sendTab).mockResolvedValue({
      $metadata: { httpStatusCode: 200 },
    });
    const tabTitle = document.getElementById('tab-title-text') as HTMLInputElement;

    await user.type(tabTitle, 'my first tab');
    await user.click(sendButton);
    expect(document.getElementById('successMessage')).toHaveTextContent('Se envió el tab');

    const selectTimeBeat = document.getElementById('time-beats-text');
    const selectTimeValue = document.getElementById('time-value-text') as HTMLSelectElement;
    await user.selectOptions(selectTimeValue, '8');
    expect(selectTimeBeat).toHaveValue('3');
  });

});
