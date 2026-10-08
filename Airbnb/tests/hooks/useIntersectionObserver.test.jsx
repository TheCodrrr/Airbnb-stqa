import { render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import useIntersectionObserver from '../../src/hooks/useIntersectionObserver';

let observerCallback;
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

class MockObserver {
  constructor(cb) {
    observerCallback = cb;
  }
  observe = observe;
  unobserve = unobserve;
  disconnect = disconnect;
}

beforeEach(() => {
  observe.mockClear();
  unobserve.mockClear();
  disconnect.mockClear();
  observerCallback = undefined;
});

const Harness = ({ options }) => {
  const [ref, isIntersecting] = useIntersectionObserver(options);

  useEffect(() => {
    if (ref.current) {
      observerCallback?.([{ isIntersecting: true }]);
    }
  }, [ref]);

  return (
    <>
      <div ref={ref}>target</div>
      <span>{String(isIntersecting)}</span>
    </>
  );
};

describe('useIntersectionObserver', () => {
  test('observes target and updates state, then cleans up', () => {
    vi.stubGlobal('IntersectionObserver', MockObserver);

    const { unmount } = render(<Harness options={{ threshold: 0.25 }} />);

    expect(observe).toHaveBeenCalled();
    expect(screen.getByText('true')).toBeInTheDocument();

    unmount();
    expect(unobserve).toHaveBeenCalled();
  });

  test('handles missing target ref safely', () => {
    vi.stubGlobal('IntersectionObserver', MockObserver);

    const NoTarget = () => {
      useIntersectionObserver({ threshold: 0.5 });
      return <span>no-target</span>;
    };

    const { unmount } = render(<NoTarget />);
    expect(screen.getByText('no-target')).toBeInTheDocument();
    expect(observe).not.toHaveBeenCalled();

    unmount();
    expect(unobserve).not.toHaveBeenCalled();
  });
});
