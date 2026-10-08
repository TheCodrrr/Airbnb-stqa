import { render, screen, fireEvent } from '@testing-library/react';
import useStickyNav from '../../src/hooks/useStickyNav';

const Harness = ({ topValue = 10 }) => {
  const { isSticky, setSentinelEl } = useStickyNav();

  return (
    <>
      <div
        ref={(el) => {
          if (el) {
            el.getBoundingClientRect = () => ({ top: topValue });
          }
          setSentinelEl(el);
        }}
      />
      <span>{isSticky ? 'sticky' : 'not-sticky'}</span>
    </>
  );
};

describe('useStickyNav', () => {
  test('sets sticky based on sentinel position and updates on scroll/resize', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { rerender, unmount } = render(<Harness topValue={5} />);
    expect(screen.getByText('not-sticky')).toBeInTheDocument();

    rerender(<Harness topValue={-2} />);
    fireEvent.scroll(window);
    expect(screen.getByText('sticky')).toBeInTheDocument();

    fireEvent(window, new Event('resize'));

    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true });

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  test('stays non-sticky when sentinel is not attached', () => {
    const NoSentinel = () => {
      const { isSticky } = useStickyNav();
      return <span>{isSticky ? 'sticky' : 'not-sticky'}</span>;
    };

    render(<NoSentinel />);
    fireEvent.scroll(window);
    expect(screen.getByText('not-sticky')).toBeInTheDocument();
  });
});
