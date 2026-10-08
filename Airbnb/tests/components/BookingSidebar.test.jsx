import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingProvider, useBooking } from '../../src/context/BookingContext';
import { addDays, startOfDay } from '../../src/utils/date';
import BookingSidebar from '../../src/components/booking/BookingSidebar';

const Controls = () => {
  const { selectDate } = useBooking();
  const today = startOfDay(new Date());

  return (
    <>
      <button type="button" onClick={() => selectDate(addDays(today, 2))}>set-checkin</button>
      <button type="button" onClick={() => selectDate(addDays(today, 4))}>set-checkout</button>
      <button type="button" onClick={() => selectDate(addDays(today, 3))}>set-one-night</button>
    </>
  );
};

const Wrapped = () => (
  <BookingProvider>
    <h2 id="calendar-heading">Calendar heading</h2>
    <Controls />
    <BookingSidebar />
  </BookingProvider>
);

describe('BookingSidebar', () => {
  test('shows default pricing and cancellation copy', () => {
    render(<Wrapped />);

    expect(screen.getByText(/for 5 nights/i)).toBeInTheDocument();
    expect(screen.getByText(/free cancellation before/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reserve/i })).toBeInTheDocument();
  });

  test('updates selected dates/prices and scrolls to calendar', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);

    await user.click(screen.getByText('set-checkin'));
    await user.click(screen.getByText('set-checkout'));
    expect(screen.getAllByText(/for\s*2\s*nights/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/).length).toBe(2);

    fireEvent.click(screen.getByText('Check-In').closest('[role="button"]'));
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  test('shows singular night label for one-night stay', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);

    await user.click(screen.getByText('set-checkin'));
    await user.click(screen.getByText('set-one-night'));
    expect(screen.getAllByText(/for\s*1\s*night$/i).length).toBeGreaterThan(0);
  });

  test('enforces guest boundaries in popup', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);

    await user.click(screen.getByRole('button', { name: /guests/i }));
    const minusBtn = screen.getByRole('button', { name: '-' });
    const plusBtn = screen.getByRole('button', { name: '+' });

    expect(minusBtn).toBeDisabled();

    await user.click(plusBtn);
    await user.click(minusBtn);
    expect(screen.getByText('1 guest')).toBeInTheDocument();

    for (let i = 0; i < 10; i += 1) {
      await user.click(plusBtn);
    }

    expect(screen.getByText('10 guests')).toBeInTheDocument();
    expect(plusBtn).toBeDisabled();
  });
});
