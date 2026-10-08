import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingProvider } from '../../src/context/BookingContext';
import Calendar from '../../src/components/booking/Calendar';
import { addDays, formatAriaDate, startOfDay } from '../../src/utils/date';

const WrappedCalendar = () => (
  <BookingProvider>
    <Calendar />
  </BookingProvider>
);

describe('Calendar', () => {
  test('renders two months and clear button', () => {
    render(<WrappedCalendar />);

    expect(screen.getAllByRole('grid')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /clear dates/i })).toBeInTheDocument();
  });

  test('selects check-in and checkout dates and updates heading', async () => {
    const user = userEvent.setup();
    render(<WrappedCalendar />);

    const today = startOfDay(new Date());
    const checkIn = addDays(today, 2);
    const checkOut = addDays(today, 5);

    await user.click(screen.getByRole('button', { name: formatAriaDate(checkIn) }));
    expect(screen.getByRole('heading', { level: 2, name: /select checkout date/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: formatAriaDate(checkOut) }));
    expect(screen.getByRole('heading', { level: 2, name: /3 nights in candolim/i })).toBeInTheDocument();
  });

  test('disables past dates and supports month navigation and clear', async () => {
    const user = userEvent.setup();
    render(<WrappedCalendar />);

    const today = startOfDay(new Date());
    const pastDate = addDays(today, -1);

    const pastButton = screen.getByRole('button', { name: new RegExp(`^${formatAriaDate(pastDate)}, unavailable`) });
    expect(pastButton).toBeDisabled();

    const nextBtn = screen.getByRole('button', { name: /next month/i });
    await user.click(nextBtn);
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear dates/i }));
    expect(screen.getByRole('heading', { level: 2, name: /select check-in date/i })).toBeInTheDocument();
  });

  test('supports keyboard selection and hover paths', () => {
    render(<WrappedCalendar />);

    const today = startOfDay(new Date());
    const checkIn = addDays(today, 1);
    fireEvent.click(screen.getByRole('button', { name: formatAriaDate(checkIn) }));

    const checkout = addDays(today, 4);
    fireEvent.mouseEnter(screen.getByRole('button', { name: formatAriaDate(checkout) }));
    expect(screen.getByText('3 nights')).toBeInTheDocument();

    const checkInButton = screen.getByRole('button', { name: /check-in date,/i });
    checkInButton.focus();
    fireEvent.keyDown(checkInButton.closest('[role="grid"]'), { key: 'ArrowRight' });
    fireEvent.keyDown(checkInButton.closest('[role="grid"]'), { key: 'Enter' });
  });
});
