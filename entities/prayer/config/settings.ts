import type { ExtendedPrayerSettings } from "../model";

export type AllSettings = ExtendedPrayerSettings;

export const DEFAULT_EXTENDED_SETTINGS: ExtendedPrayerSettings = {
	calculationMethod: 4,
	asrMethod: 0,
	fajrOffset: 0,
	dhuhrOffset: 0,
	asrOffset: 0,
	maghribOffset: 0,
	ishaOffset: 0,
	timezone: "Asia/Mecca",
	countryCode: "SA",
	city: undefined,
	showOtherPrayers: true,
	showCity: true,
	showTicker: true,
	showDate: true,
	horizontalView: false,
	timeFormat24h: true,
	dimPreviousPrayers: true,
	language: "en",
	autoDetectTimezone: false,
	showClock: true,
	tickerIntervalMs: 5000,
	prayerNameColor: "#ffffff",
	prayerTimeColor: "#ffffff",
	prayerCountdownColor: "#ffffff",
	azanEnabled: true,
	azanPerPrayer: false,
	azanGlobalChoice: "default",
	azanByPrayer: {
		Fajr: "default",
		Dhuhr: "default",
		Asr: "default",
		Maghrib: "default",
		Isha: "default",
	},
	azanCustomNames: {},
	azanVolume: 1,
	azanEditMode: false,
	nextCardSize: "md",
	otherCardSize: "sm",
	appWidth: "xl",
};

export const SETTINGS_STORAGE_KEY = "tawkit:settings:v1";
