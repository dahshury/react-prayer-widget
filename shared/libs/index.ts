// Shared hooks

// Geolocation utilities
export { countryToFlag } from "./geo";
export {
	useControlledState,
	useCurrentTime,
	useIsInView,
	useTimezoneSync,
	useTranslation,
} from "./hooks";

// Prayer-related utilities
export {
	adjustTimeByMinutes,
	applyOffset,
	computePrayerProgress,
	DEFAULT_EXTENDED_SETTINGS,
	formatTimeUntil,
	getCountdownString,
	getNextPrayer,
	getTimezoneCoordinates,
	SETTINGS_STORAGE_KEY,
	timezoneCoordinates,
} from "./prayer";
// React utilities
export { getStrictContext } from "./react";
// Timezone utilities
export {
	getCountryCodeFromTimezone,
	getLocationFromTimezoneLocalized,
	TIMEZONES,
} from "./timezone";
// Shared utilities
export { cn } from "./utils";
