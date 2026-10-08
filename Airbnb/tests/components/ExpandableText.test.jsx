import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpandableText from '../../src/components/ui/ExpandableText';

describe('ExpandableText', () => {
  test('renders empty text without toggle', () => {
    render(<ExpandableText text="" id="empty-text" />);
    expect(document.getElementById('empty-text')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /show more/i })).not.toBeInTheDocument();
  });

  test('renders short text without toggle when no overflow', () => {
    render(<ExpandableText text="Short text" id="short-text" />);
    expect(screen.getByText('Short text')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /show more/i })).not.toBeInTheDocument();
  });

  test('toggles long text and aria state', async () => {
    const user = userEvent.setup();
    render(<ExpandableText text={'A'.repeat(180)} id="long-text" />);

    const toggle = screen.getByRole('button', { name: /show more/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'long-text');

    await user.click(toggle);
    expect(screen.getByRole('button', { name: /show less/i })).toHaveAttribute('aria-expanded', 'true');
  });
});
