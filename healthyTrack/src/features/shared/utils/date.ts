/**
 * Centralized date utilities to avoid scattered formatting functions
 * All date operations should use functions from this file for consistency
 */

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get date as ISO string (YYYY-MM-DD)
 */
export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Add days to a date
 * @param date Base date
 * @param days Number of days to add (negative to subtract)
 */
export const addDays = (date: Date, days: number): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
};

/**
 * Format date as localized long format
 * @param date Date to format
 * @param locale Language code (default: browser locale)
 */
export const formatDateLong = (date: Date, locale: string = 'en-US'): string => {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format date as short format (e.g., "Mon, 13 Apr")
 * @param date Date to format
 * @param locale Language code
 */
export const formatDateShort = (date: Date, locale: string = 'en-US'): string => {
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

/**
 * Get day of week name
 * @param isoDate ISO date string (YYYY-MM-DD) or Date object
 * @param locale Language code
 */
export const getDayName = (
  isoDate: string | Date,
  locale: string = 'en-US'
): string => {
  const DAY_LABELS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate;
  const dayIndex = date.getDay();

  if (locale.startsWith('vi')) {
    const VI_LABELS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return VI_LABELS[dayIndex];
  }

  return DAY_LABELS[dayIndex];
};

/**
 * Parse ISO date string to Date object
 */
export const parseISODate = (isoDate: string): Date => {
  return new Date(isoDate);
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const checkDate = typeof date === 'string' ? new Date(date) : date;

  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Format number with locale
 * @param num Number to format
 * @param locale Language code
 */
export const formatNumber = (num: number, locale: string = 'en-US'): string => {
  return num.toLocaleString(locale);
};

/**
 * Format calories display (e.g., "1,234 kcal")
 */
export const formatCalories = (calories: number, locale: string = 'en-US'): string => {
  return formatNumber(calories, locale) + ' kcal';
};

