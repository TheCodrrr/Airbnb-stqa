import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../../src/components/overlays/Modal';

const Harness = ({ isOpen = true, onClose = vi.fn() }) => (
  <>
    <button type="button">outside-trigger</button>
    <Modal isOpen={isOpen} onClose={onClose} title="Test modal">
      <button type="button">inside-a</button>
      <button type="button">inside-b</button>
    </Modal>
  </>
);

describe('Modal', () => {
  test('renders dialog, traps focus, and handles escape/backdrop', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    const dialog = screen.getByRole('dialog', { name: /test modal/i });
    expect(dialog).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close modal/i });
    closeBtn.focus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'inside-b' })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(dialog.parentElement);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('unmounts when closed after transition', () => {
    vi.useFakeTimers();

    const { rerender } = render(<Harness isOpen />);
    act(() => {
      rerender(<Harness isOpen={false} />);
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
