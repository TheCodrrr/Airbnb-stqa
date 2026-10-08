import { render, screen, fireEvent } from '@testing-library/react';
import { BookingProvider, useBooking, formatINR } from '../../src/context/BookingContext';
import { addDays, startOfDay } from '../../src/utils/date';
import listing from '../../src/data/listing';

const Harness = () => {
  const { checkIn, checkOut, guests, nights, totalPrice, maxCheckoutDate, selectDate, clearDates, setGuests } = useBooking();
  const today = startOfDay(new Date());

  return (
    <div>
      <div data-testid="state">{JSON.stringify({
        checkIn: checkIn?.toDateString() ?? null,
        checkOut: checkOut?.toDateString() ?? null,
        guests,
        nights,
        totalPrice,
        maxCheckoutDate: maxCheckoutDate?.toDateString() ?? null,
      })}</div>
      <button onClick={() => selectDate(addDays(today, -1))}>past</button>
      <button onClick={() => selectDate(addDays(today, 2))}>checkin</button>
      <button onClick={() => selectDate(addDays(today, 2))}>same-day</button>
      <button onClick={() => selectDate(addDays(today, 1))}>before-checkin</button>
      <button onClick={() => selectDate(addDays(today, 4))}>checkout</button>
      <button onClick={() => selectDate(addDays(today, 25))}>beyond-max</button>
      <button onClick={() => clearDates()}>clear</button>
      <button onClick={() => setGuests((v) => v + 1)}>inc-guest</button>
    </div>
  );
};

const getState = () => JSON.parse(screen.getByTestId('state').textContent);

describe('BookingContext', () => {
  test('exposes expected defaults and INR formatting', () => {
    render(<BookingProvider><Harness /></BookingProvider>);

    const state = getState();
    expect(state.checkIn).toBeNull();
    expect(state.checkOut).toBeNull();
    expect(state.guests).toBe(1);
    expect(state.nights).toBe(listing.defaultStayNights);
    expect(state.totalPrice).toBe(listing.defaultStayNights * listing.pricePerNight);
    expect(formatINR(8500)).toContain('₹');
  });

  test('handles selection flow, max nights, and resets', () => {
    render(<BookingProvider><Harness /></BookingProvider>);

    fireEvent.click(screen.getByText('past'));
    expect(getState().checkIn).toBeNull();

    fireEvent.click(screen.getByText('checkin'));
    const afterCheckin = getState();
    expect(afterCheckin.checkIn).not.toBeNull();
    expect(afterCheckin.checkOut).toBeNull();

    fireEvent.click(screen.getByText('same-day'));
    expect(getState().checkOut).toBeNull();

    fireEvent.click(screen.getByText('before-checkin'));
    const movedCheckIn = getState();
    expect(movedCheckIn.checkOut).toBeNull();

    fireEvent.click(screen.getByText('checkout'));
    const withCheckout = getState();
    expect(withCheckout.checkOut).not.toBeNull();
    expect(withCheckout.nights).toBeGreaterThanOrEqual(1);
    expect(withCheckout.maxCheckoutDate).not.toBeNull();

    fireEvent.click(screen.getByText('beyond-max'));
    const restarted = getState();
    expect(restarted.checkIn).not.toBeNull();
    expect(restarted.checkOut).toBeNull();

    fireEvent.click(screen.getByText('inc-guest'));
    expect(getState().guests).toBe(2);

    fireEvent.click(screen.getByText('clear'));
    expect(getState().checkIn).toBeNull();
    expect(getState().checkOut).toBeNull();
  });

  test('throws when useBooking is used without provider', () => {
    const Consumer = () => {
      useBooking();
      return null;
    };

    expect(() => render(<Consumer />)).toThrow('useBooking must be used inside <BookingProvider>');
  });
});
