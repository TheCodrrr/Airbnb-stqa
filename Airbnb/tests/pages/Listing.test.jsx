import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

describe('Listing page integration', () => {
  test('renders key sections and sticky reserve flow entrypoints', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /romantic jacuzzi/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /where you'll sleep/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /select check-in date/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /things to know/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /show all \d+ photos/i }));
    expect(screen.getByRole('dialog', { name: /photo tour/i })).toBeInTheDocument();
  });
});
