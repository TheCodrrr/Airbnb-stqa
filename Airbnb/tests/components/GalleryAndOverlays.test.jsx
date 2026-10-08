import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GalleryProvider } from '../../src/context/GalleryContext';
import Gallery from '../../src/components/listing/Gallery';
import { Lightbox, PhotoTour } from '../../src/components/listing/GalleryOverlays';

const Wrapped = () => (
  <GalleryProvider>
    <Gallery />
    <Lightbox />
    <PhotoTour />
  </GalleryProvider>
);

describe('Gallery and overlays', () => {
  test('opens lightbox from gallery tile and navigates photos', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);

    await user.click(screen.getByRole('button', { name: /view hero photo/i }));
    expect(screen.getByRole('dialog', { name: /photo carousel/i })).toBeInTheDocument();

    const next = screen.getByRole('button', { name: /next photo/i });
    await user.click(next);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    await user.click(screen.getByRole('button', { name: /close lightbox/i }));
    expect(screen.queryByRole('dialog', { name: /photo carousel/i })).not.toBeInTheDocument();
  });

  test('opens photo tour from show-all and can close', async () => {
    const user = userEvent.setup();
    render(<Wrapped />);

    await user.click(screen.getByRole('button', { name: /show all \d+ photos/i }));
    expect(screen.getByRole('dialog', { name: /photo tour/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back to listing/i }));
    expect(screen.queryByRole('dialog', { name: /photo tour/i })).not.toBeInTheDocument();
  });
});
