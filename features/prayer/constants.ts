export const FRIDAY_DAY_INDEX = 5;
export const DEFAULT_TICKER_INTERVAL_MS = 5000;

export const PRAYER_NAMES = [
	"Fajr",
	"Dhuhr",
	"Asr",
	"Maghrib",
	"Isha",
] as const;

export type PrayerName = (typeof PRAYER_NAMES)[number];
