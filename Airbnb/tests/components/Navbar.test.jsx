import { render, screen } from '@testing-library/react';
import Navbar from '../../src/components/layout/Navbar';

describe('Navbar', () => {
  test('renders primary navigation controls', () => {
    render(<Navbar />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /airbnb home/i })).toBeInTheDocument();
    expect(screen.getByRole('search', { name: /search for stays/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search by location/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /language and region/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open user menu/i })).toHaveAttribute('aria-haspopup', 'true');
  });
});
