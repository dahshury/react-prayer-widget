import type { ExtendedPrayerSettings } from "@/hooks/use-prayer-times";

type WidgetUISettings = {
	timezone?: string;
	countryCode?: string;
	cityCode?: string;
	city?: string;
	locationError?: string;
	showOtherPrayers?: boolean;
	showCity?: boolean;
	showTicker?: boolean;
	showClock?: boolean;
	showDate?: boolean;
	horizontalView?: boolean;
	timeFormat24h?: boolean;
	dimPreviousPrayers?: boolean;
	language?: "en" | "ar";
	autoDetectTimezone?: boolean;
	tickerIntervalMs?: number;
	prayerNameColor?: string;
	prayerTimeColor?: string;
	prayerCountdownColor?: string;
};

export type AllSettings = ExtendedPrayerSettings & WidgetUISettings;
