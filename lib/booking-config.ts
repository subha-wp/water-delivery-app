// ===== FREE JAR BOOKING CONFIGURATION =====
// Edit this file to change the free jar booking time and settings

export const BOOKING_CONFIG = {
  // Booking time (24-hour format)
  HOUR: 8, // 0-23 (8 = 8:00 AM)
  MINUTE: 0, // 0-59 (0 = exactly at the hour)

  // Booking window duration in minutes
  WINDOW_MINUTES: 1, // How long the booking window stays open

  // Maximum slots per day
  MAX_SLOTS_PER_DAY: 10,

  // Timezone
  TIMEZONE: "Asia/Kolkata",

  // Display settings
  DISPLAY_NAME: "8:00 AM ",
  DESCRIPTION: "Daily free jar booking opens at 8:00 AM",
};

// Helper function to get formatted booking time
export function getBookingTimeDisplay(): string {
  const hour12 =
    BOOKING_CONFIG.HOUR > 12
      ? BOOKING_CONFIG.HOUR - 12
      : BOOKING_CONFIG.HOUR === 0
      ? 12
      : BOOKING_CONFIG.HOUR;

  const ampm = BOOKING_CONFIG.HOUR >= 12 ? "PM" : "AM";
  const minute = BOOKING_CONFIG.MINUTE.toString().padStart(2, "0");

  return `${hour12}:${minute} ${ampm}`;
}

// Helper function to check if current IST time is within booking window
export function isWithinBookingWindow(istDate: Date): boolean {
  const currentHour = istDate.getHours();
  const currentMinute = istDate.getMinutes();

  // Check if we're in the booking hour
  if (currentHour !== BOOKING_CONFIG.HOUR) {
    return false;
  }

  // Check if we're within the booking window
  const windowStart = BOOKING_CONFIG.MINUTE;
  const windowEnd = BOOKING_CONFIG.MINUTE + BOOKING_CONFIG.WINDOW_MINUTES;

  return currentMinute >= windowStart && currentMinute < windowEnd;
}

// Helper function to calculate seconds until next booking time
export function calculateSecondsUntilNextBooking(istDate: Date): number {
  const now = istDate;
  const nextBooking = new Date(istDate);

  // Set to next booking time
  nextBooking.setHours(BOOKING_CONFIG.HOUR, BOOKING_CONFIG.MINUTE, 0, 0);

  // If we've passed today's booking time, move to tomorrow
  if (now >= nextBooking) {
    nextBooking.setDate(nextBooking.getDate() + 1);
  }

  const diffMs = nextBooking.getTime() - now.getTime();
  return Math.floor(diffMs / 1000);
}
