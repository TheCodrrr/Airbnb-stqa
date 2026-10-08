import {
  startOfDay,
  isSameDay,
  isBefore,
  isAfter,
  isBetween,
  addMonths,
  addDays,
  diffNights,
  getMonthGrid,
  formatMonthYear,
  formatShortDate,
  formatAriaDate,
} from '../../src/utils/date';

describe('date utils', () => {
  test('handles null and valid values safely', () => {
    expect(startOfDay(null)).toBeNull();
    expect(isSameDay(null, new Date())).toBe(false);
    expect(isBefore(null, new Date())).toBe(false);
    expect(isAfter(new Date(), null)).toBe(false);
    expect(isBetween(null, new Date(), new Date())).toBe(false);
  });

  test('normalizes time for comparisons', () => {
    const morning = new Date('2026-10-10T08:00:00');
    const evening = new Date('2026-10-10T20:00:00');
    const nextDay = new Date('2026-10-11T00:00:00');

    expect(isSameDay(morning, evening)).toBe(true);
    expect(isBefore(morning, nextDay)).toBe(true);
    expect(isAfter(nextDay, evening)).toBe(true);
    expect(isBetween(new Date('2026-10-10T12:00:00'), morning, nextDay)).toBe(false);
    expect(isBetween(new Date('2026-10-10T12:00:00'), new Date('2026-10-09'), new Date('2026-10-12'))).toBe(true);
  });

  test('adds months/days and calculates nights', () => {
    const base = new Date('2026-01-31T00:00:00');
    expect(addMonths(base, 1).getMonth()).toBe(2);
    expect(addDays(base, 2).getDate()).toBe(2);

    expect(diffNights(null, null)).toBe(0);
    expect(diffNights(new Date('2026-11-10'), new Date('2026-11-10'))).toBe(1);
    expect(diffNights(new Date('2026-11-10'), new Date('2026-11-15'))).toBe(5);
  });

  test('generates month grid and formats strings', () => {
    const grid = getMonthGrid(2026, 9);
    const nonNullDays = grid.filter(Boolean);

    expect(nonNullDays).toHaveLength(31);
    expect(nonNullDays[0].getDate()).toBe(1);

    const date = new Date('2026-10-18T00:00:00');
    expect(formatMonthYear(date)).toBe('October 2026');
    expect(formatShortDate(date)).toBe('Oct 18');
    expect(formatAriaDate(date)).toBe('October 18, 2026');
  });
});
