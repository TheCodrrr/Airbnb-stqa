import { render, screen, fireEvent } from '@testing-library/react';
import { GalleryProvider, useGallery } from '../../src/context/GalleryContext';

const Harness = () => {
  const {
    isPhotoTourOpen,
    isLightboxOpen,
    currentPhotoIndex,
    openPhotoTour,
    openLightbox,
    closeOverlay,
    goTo,
  } = useGallery();

  return (
    <div>
      <div data-testid="gallery-state">{JSON.stringify({ isPhotoTourOpen, isLightboxOpen, currentPhotoIndex })}</div>
      <button onClick={() => openPhotoTour(3)}>open-tour</button>
      <button onClick={() => openLightbox(2)}>open-lightbox</button>
      <button onClick={() => goTo(5)}>goto</button>
      <button onClick={closeOverlay}>close</button>
    </div>
  );
};

const getState = () => JSON.parse(screen.getByTestId('gallery-state').textContent);

describe('GalleryContext', () => {
  test('manages photo tour/lightbox exclusivity and index', () => {
    render(<GalleryProvider><Harness /></GalleryProvider>);

    expect(getState()).toEqual({ isPhotoTourOpen: false, isLightboxOpen: false, currentPhotoIndex: 0 });

    fireEvent.click(screen.getByText('open-tour'));
    expect(getState()).toEqual({ isPhotoTourOpen: true, isLightboxOpen: false, currentPhotoIndex: 3 });

    fireEvent.click(screen.getByText('open-lightbox'));
    expect(getState()).toEqual({ isPhotoTourOpen: false, isLightboxOpen: true, currentPhotoIndex: 2 });

    fireEvent.click(screen.getByText('goto'));
    expect(getState().currentPhotoIndex).toBe(5);

    fireEvent.click(screen.getByText('close'));
    expect(getState()).toEqual({ isPhotoTourOpen: false, isLightboxOpen: false, currentPhotoIndex: 5 });
  });

  test('throws when useGallery is used without provider', () => {
    const Consumer = () => {
      useGallery();
      return null;
    };

    expect(() => render(<Consumer />)).toThrow('useGallery must be used inside <GalleryProvider>');
  });
});
