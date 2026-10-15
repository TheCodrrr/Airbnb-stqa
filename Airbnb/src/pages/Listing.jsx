import '../styles/tokens.css';
import { GalleryProvider } from '../context/GalleryContext';
import { BookingProvider } from '../context/BookingContext';
import useStickyNav from '../hooks/useStickyNav';
import Navbar from '../components/layout/Navbar';
import StickySubNav from '../components/layout/StickySubNav';
import TitleRow from '../components/listing/TitleRow';
import Gallery from '../components/listing/Gallery';
import { Lightbox, PhotoTour } from '../components/listing/GalleryOverlays';
import Overview from '../components/listing/Overview';
import Highlights from '../components/listing/Highlights';
import TranslationBanner from '../components/listing/TranslationBanner';
import Description from '../components/listing/Description';
import SleepCards from '../components/listing/SleepCards';
import Amenities from '../components/listing/Amenities';
import Calendar from '../components/booking/Calendar';
import ReviewsOverview from '../components/listing/ReviewsOverview';
import ReviewsGrid from '../components/listing/ReviewsGrid';
import Location from '../components/listing/Location';
import HostSection from '../components/listing/HostSection';
import PaymentNotice from '../components/listing/PaymentNotice';
import ThingsToKnow from '../components/listing/ThingsToKnow';
import NearbyStays from '../components/listing/NearbyStays';
import ListingLayout from '../components/layout/ListingLayout';
import BookingSidebar from '../components/booking/BookingSidebar';
import styles from './Listing.module.css';

/* ── Inner component so hooks can consume providers ────────── */
const ListingPage = () => {
  const { isSticky, setSentinelEl } = useStickyNav();

  return (
    <div className={styles.page}>

      {/* ── Section 1: Global Top Navbar ─────────────────────── */}
      <Navbar />

      {/* ── Sentinel: triggers sticky subnav when Navbar scrolls away ── */}
      <div
        ref={setSentinelEl}
        aria-hidden="true"
        style={{ height: 1, marginBottom: -1 }}
      />

      {/* ── Sticky Sub-Nav (replaces Navbar on scroll) ── */}
      <StickySubNav isSticky={isSticky} />

      <main className={styles.main} id="main-content">

        {/* ── Section 2: Listing Title Row ─────────────────────── */}
        <TitleRow />

        {/* ── Section 3: Photo Gallery Grid ────────────────────── */}
        <section id="section-photos" aria-label="Property photos">
          <Gallery />
        </section>

        {/* ══════════════════════════════════════════════════════════
            TWO-COLUMN ZONE — sidebar visible here only
            Left: Overview → Calendar  |  Right: BookingSidebar
            ══════════════════════════════════════════════════════════ */}
        <ListingLayout
          leftContent={
            <>
              <Overview />
              <Highlights />
              <TranslationBanner />
              <Description />
              <SleepCards />

              <section id="section-amenities" aria-labelledby="amenities-heading">
                <Amenities />
              </section>

              <Calendar />

              {/* Anchor for Reserve button in StickySubNav */}
              <div id="section-booking" aria-hidden="true" style={{ height: 0 }} />
            </>
          }
          rightContent={<BookingSidebar />}
        />

        {/* Full-width divider spanning entire container */}
        <hr className={styles.zoneDivider} aria-hidden="true" />

        {/* ══════════════════════════════════════════════════════════
            FULL-WIDTH ZONE — no sidebar below this point
            Reviews → Location → Host → PaymentNotice → ThingsToKnow → NearbyStays
            ══════════════════════════════════════════════════════════ */}
        <div className={styles.fullWidthZone}>

          {/* ── Reviews ──────────────────────────────────────────── */}
          <section id="section-reviews" aria-labelledby="reviews-heading">
            <ReviewsOverview />
            <ReviewsGrid />
          </section>

          {/* ── Location ─────────────────────────────────────────── */}
          <div id="section-location">
            <Location />
          </div>

          {/* ── Meet Your Host ────────────────────────────────────── */}
          <div id="section-host">
            <HostSection />
          </div>

          {/* ── Payment Notice ────────────────────────────────────── */}
          <PaymentNotice />

          {/* ── Things to Know ───────────────────────────────────── */}
          <ThingsToKnow />

          {/* ── Nearby Stays ─────────────────────────────────────── */}
          <NearbyStays />

        </div>

      </main>

      {/* ── Overlays — rendered at root to escape stacking ctx ─── */}
      <Lightbox />
      <PhotoTour />

    </div>
  );
};

/* ── Root: wrap with providers ─────────────────────────────── */
const Listing = () => (
  <GalleryProvider>
    <BookingProvider>
      <ListingPage />
    </BookingProvider>
  </GalleryProvider>
);

export default Listing;
