import type { PrayerSettings } from "@/entities/prayer";

/**
 * Default prayer calculation settings
 * Uses Umm Al-Qura University method (4) as the default
 */
export const DEFAULT_SETTINGS: PrayerSettings = {
	calculationMethod: 4, // Umm Al-Qura University, Makkah
	asrMethod: 0, // Standard (Shafi, Maliki, Hanbali)
	fajrOffset: 0,
	dhuhrOffset: 0,
	asrOffset: 0,
	maghribOffset: 0,
	ishaOffset: 0,
};
