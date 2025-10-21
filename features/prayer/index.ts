// Re-export all prayer hooks and components

export {
	DEFAULT_TICKER_INTERVAL_MS,
	FRIDAY_DAY_INDEX,
	PRAYER_NAMES,
	type PrayerName,
} from "./constants";
export {
	useAzan,
	useLoadPrayerTimes,
	usePrayerProgress,
	usePrayerTimes,
} from "./hooks";
