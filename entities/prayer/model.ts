export type PrayerTimes = {
	fajr: string;
	sunrise: string;
	dhuhr: string;
	asr: string;
	maghrib: string;
	isha: string;
	date: string;
	hijri: string;
};

export const PRAYER_TIME_KEYS = [
	"fajr",
	"sunrise",
	"dhuhr",
	"asr",
	"maghrib",
	"isha",
] as const;

export type PrayerTimeKey = (typeof PRAYER_TIME_KEYS)[number];

export const PRAYER_NAMES = [
	"Fajr",
	"Sunrise",
	"Dhuhr",
	"Asr",
	"Maghrib",
	"Isha",
] as const;

export type PrayerName = (typeof PRAYER_NAMES)[number];

export const PRAYER_SEQUENCE = PRAYER_NAMES.map((name, index) => ({
	name,
	key: PRAYER_TIME_KEYS[index],
})) satisfies ReadonlyArray<{
	name: PrayerName;
	key: PrayerTimeKey;
}>;

export type CalculationMethodId =
	| 1
	| 2
	| 3
	| 4
	| 5
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13;

export type AsrMethodId = 0 | 1;

export type PrayerSettings = {
	calculationMethod: CalculationMethodId;
	asrMethod: AsrMethodId;
	fajrOffset: number;
	dhuhrOffset: number;
	asrOffset: number;
	maghribOffset: number;
	ishaOffset: number;
	// Tawkit-like hour toggles
	applySummerHour?: boolean;
	forceHourMore?: boolean;
	forceHourLess?: boolean;
};

export type ExtendedPrayerSettings = PrayerSettings & {
	timezone?: string;
	countryCode?: string;
	city?: string;
	cityCode?: string;
	showOtherPrayers?: boolean;
	showCity?: boolean;
	showTicker?: boolean;
	showStandaloneTicker?: boolean;
	showDate?: boolean;
	horizontalView?: boolean;
	timeFormat24h?: boolean;
	dimPreviousPrayers?: boolean;
	language?: "en" | "ar";
	autoDetectTimezone?: boolean;
	showClock?: boolean;
	tickerIntervalMs?: number;
	/** Custom colors for prayer UI text */
	prayerNameColor?: string;
	prayerTimeColor?: string;
	prayerCountdownColor?: string;
	/** Enable azan playback at prayer times */
	azanEnabled?: boolean;
	/** When true, customize azan per prayer; otherwise use one global choice */
	azanPerPrayer?: boolean;
	/** Per-prayer azan selection id (default|short|fajr|beep|off|custom) */
	azanByPrayer?: Partial<
		Record<"Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha", string>
	>;
	/** Display names for custom uploaded files per prayer */
	azanCustomNames?: Partial<
		Record<"Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha", string>
	>;
	/** Global azan volume 0..1 */
	azanVolume?: number;
	/** Global azan choice id used when not customizing per prayer */
	azanGlobalChoice?: string;
	/** Global custom azan uploaded by user (name only; data stored in localStorage) */
	azanGlobalCustomName?: string;
	/** Toggle edit mode to drag-drop azan files over prayer cards */
	azanEditMode?: boolean;
	/** Visual size of the next (center) card */
	nextCardSize?: "xxs" | "xs" | "sm" | "md" | "lg";
	/** Visual size of the other prayer cards */
	otherCardSize?: "xxs" | "xs" | "sm" | "md" | "lg";
	/** Max width for the overall app/cards container */
	appWidth?: "xxs" | "xs" | "md" | "lg" | "xl" | "2xl" | "3xl";
	/** Font family for prayer names and general text */
	prayerFont?: string;
	/** Font family for prayer times */
	timeFont?: string;
	/** Card background style (default, image, or color gradient theme) */
	cardBackground?: string;
	/** Card background opacity 0..1 */
	cardBackgroundOpacity?: number;
	/** Error flag for location/permission issues */
	locationError?: string;
};

export type UsePrayerTimesOptions = {
	initialSettings?: Partial<ExtendedPrayerSettings>;
};
