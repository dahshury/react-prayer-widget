"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	formatTimeUntil,
	getCurrentLocation,
	getNextPrayer,
	getPrayerTimes,
	type Location,
	type PrayerSettings,
	type PrayerTimes,
} from "@/lib/prayer-api";
import {
	getCountryCodeFromTimezone,
	getLocationFromTimezoneLocalized,
	guessTimezoneFromCountryCode,
	TIMEZONES,
} from "@/lib/timezones";

export interface ExtendedPrayerSettings extends PrayerSettings {
	timezone?: string;
	countryCode?: string;
	city?: string;
	showOtherPrayers?: boolean;
	showCity?: boolean;
	showTicker?: boolean;
	showDate?: boolean;
	horizontalView?: boolean;
	timeFormat24h?: boolean;
	dimPreviousPrayers?: boolean;
	language?: "en" | "ar";
	autoDetectTimezone?: boolean;
	showClock?: boolean;
	tickerIntervalMs?: number;
}

export type UsePrayerTimesOptions = {
	initialSettings?: Partial<ExtendedPrayerSettings>;
};

const timezoneCoordinates: Record<string, { lat: number; lng: number }> = {
	"Asia/Riyadh": { lat: 24.7136, lng: 46.6753 },
	"Asia/Mecca": { lat: 21.4225, lng: 39.8262 },
	"Asia/Dubai": { lat: 25.2048, lng: 55.2708 },
	"Asia/Kuwait": { lat: 29.3117, lng: 47.4818 },
	"Asia/Qatar": { lat: 25.2854, lng: 51.531 },
	"Asia/Bahrain": { lat: 26.0667, lng: 50.5577 },
	"Asia/Muscat": { lat: 23.5859, lng: 58.4059 },
	"Asia/Baghdad": { lat: 33.3152, lng: 44.3661 },
	"Asia/Damascus": { lat: 33.5138, lng: 36.2765 },
	"Asia/Beirut": { lat: 33.8938, lng: 35.5018 },
	"Asia/Amman": { lat: 31.9454, lng: 35.9284 },
	"Asia/Jerusalem": { lat: 31.7683, lng: 35.2137 },
	"Africa/Cairo": { lat: 30.0444, lng: 31.2357 },
	"Africa/Casablanca": { lat: 33.5731, lng: -7.5898 },
	"Africa/Tunis": { lat: 36.8065, lng: 10.1815 },
	"Africa/Algiers": { lat: 36.7538, lng: 3.0588 },
	"Europe/Istanbul": { lat: 41.0082, lng: 28.9784 },
	"Asia/Karachi": { lat: 24.8607, lng: 67.0011 },
	"Asia/Dhaka": { lat: 23.8103, lng: 90.4125 },
	"Asia/Jakarta": { lat: -6.2088, lng: 106.8456 },
	"Asia/Kuala_Lumpur": { lat: 3.139, lng: 101.6869 },
	"Europe/London": { lat: 51.5074, lng: -0.1278 },
	"America/New_York": { lat: 40.7128, lng: -74.006 },
	"America/Los_Angeles": { lat: 34.0522, lng: -118.2437 },
	"America/Toronto": { lat: 43.6532, lng: -79.3832 },
	"Australia/Sydney": { lat: -33.8688, lng: 151.2093 },
};

function getTimezoneCoordinates(timezone: string) {
	return timezoneCoordinates[timezone] || { lat: 21.4225, lng: 39.8262 };
}

/**
 * Compute the next prayer, the progress through the current prayer interval,
 * and the minutes remaining until the next prayer.
 */
function computePrayerProgress(
	prayerTimes: PrayerTimes,
	now: Date = new Date(),
): {
	next: { name: string; time: string };
	progress: number;
	minutesUntilNext: number;
} {
	const next = getNextPrayer(prayerTimes);
	const currentMinutes =
		now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

	const prayers = [
		{ name: "Fajr", time: prayerTimes.fajr },
		{ name: "Sunrise", time: prayerTimes.sunrise },
		{ name: "Dhuhr", time: prayerTimes.dhuhr },
		{ name: "Asr", time: prayerTimes.asr },
		{ name: "Maghrib", time: prayerTimes.maghrib },
		{ name: "Isha", time: prayerTimes.isha },
	].map((prayer) => {
		const [hours, minutes] = prayer.time.split(":").map(Number);
		return { ...prayer, minutes: hours * 60 + minutes };
	});

	let currentPrayerIndex = -1;
	for (let i = 0; i < prayers.length; i++) {
		if (currentMinutes >= prayers[i].minutes) {
			currentPrayerIndex = i;
		} else {
			break;
		}
	}
	if (currentPrayerIndex === -1) {
		currentPrayerIndex = prayers.length - 1;
	}
	const nextPrayerIndex = (currentPrayerIndex + 1) % prayers.length;
	const periodStart = prayers[currentPrayerIndex].minutes;
	const periodEnd =
		nextPrayerIndex === 0
			? prayers[0].minutes + 24 * 60
			: prayers[nextPrayerIndex].minutes;
	const normalizedNow =
		currentMinutes < periodStart ? currentMinutes + 24 * 60 : currentMinutes;
	const totalPeriod = Math.max(1, periodEnd - periodStart);
	const elapsed = Math.max(0, normalizedNow - periodStart);
	const progress = Math.max(0, Math.min(100, (elapsed / totalPeriod) * 100));
	const nextPrayerTimeInSeconds = periodEnd * 60;
	const currentTimeInSeconds = normalizedNow * 60;
	const timeUntilSeconds = nextPrayerTimeInSeconds - currentTimeInSeconds;
	const timeUntilMinutes = Math.ceil(timeUntilSeconds / 60);

	return {
		next: { name: next.name, time: next.time },
		progress,
		minutesUntilNext: Math.max(0, timeUntilMinutes),
	};
}

const DEFAULT_EXTENDED_SETTINGS: ExtendedPrayerSettings = {
	calculationMethod: 4,
	asrMethod: 0,
	fajrOffset: 0,
	dhuhrOffset: 0,
	asrOffset: 0,
	maghribOffset: 0,
	ishaOffset: 0,
	timezone: "Asia/Mecca", // Default to Makkah timezone
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
};

export function usePrayerTimes(options?: UsePrayerTimesOptions) {
	const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
	const [location, setLocation] = useState<Location | null>(null);
	const [settings, setSettings] = useState<ExtendedPrayerSettings>({
		...DEFAULT_EXTENDED_SETTINGS,
		...(options?.initialSettings || {}),
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [nextPrayer, setNextPrayer] = useState<{
		name: string;
		time: string;
		timeUntil: number;
		progress: number;
	} | null>(null);
	const [currentTime, setCurrentTime] = useState(new Date());

	// Update current time every second
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Keep timezone synced with system when auto-detect is enabled
	useEffect(() => {
		if (settings.autoDetectTimezone) {
			const sysTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (sysTz && settings.timezone !== sysTz) {
				setSettings((prev) => ({
					...prev,
					timezone: sysTz,
					countryCode: getCountryCodeFromTimezone(sysTz) || prev.countryCode,
					city: undefined,
				}));
			}
		}
	}, [settings.autoDetectTimezone, settings.timezone]);

	// Memoize only the subset of settings that affect data fetching
	const dataSettings = useMemo(
		() => ({
			timezone: settings.timezone,
			countryCode: settings.countryCode,
			city: settings.city,
			language: settings.language,
			calculationMethod: settings.calculationMethod,
			asrMethod: settings.asrMethod,
			fajrOffset: settings.fajrOffset,
			dhuhrOffset: settings.dhuhrOffset,
			asrOffset: settings.asrOffset,
			maghribOffset: settings.maghribOffset,
			ishaOffset: settings.ishaOffset,
			applySummerHour: settings.applySummerHour,
			forceHourMore: settings.forceHourMore,
			forceHourLess: settings.forceHourLess,
		}),
		[
			settings.timezone,
			settings.countryCode,
			settings.city,
			settings.language,
			settings.calculationMethod,
			settings.asrMethod,
			settings.fajrOffset,
			settings.dhuhrOffset,
			settings.asrOffset,
			settings.maghribOffset,
			settings.ishaOffset,
			settings.applySummerHour,
			settings.forceHourMore,
			settings.forceHourLess,
		],
	);

	const loadPrayerTimes = useCallback(
		async (useCurrentLocation = false) => {
			const {
				timezone,
				countryCode,
				city,
				language,
				calculationMethod,
				asrMethod,
				fajrOffset,
				dhuhrOffset,
				asrOffset,
				maghribOffset,
				ishaOffset,
				applySummerHour,
				forceHourMore,
				forceHourLess,
			} = dataSettings;

			try {
				setLoading(true);
				setError(null);

				let currentLocation: Location;

				if (useCurrentLocation) {
					// Use device location
					const detected = await getCurrentLocation(language || "en");
					if (!timezone && detected.countryCode) {
						const tz = guessTimezoneFromCountryCode(detected.countryCode);
						if (tz) {
							setSettings((prev) => ({
								...prev,
								timezone: tz,
								countryCode: detected.countryCode,
							}));
						}
					}
					currentLocation = detected;
				} else if (timezone) {
					// Use timezone-based location
					const tzMeta = TIMEZONES.find((t) => t.value === timezone);
					currentLocation = {
						latitude: getTimezoneCoordinates(timezone).lat,
						longitude: getTimezoneCoordinates(timezone).lng,
						city:
							city ||
							getLocationFromTimezoneLocalized(timezone, language || "en"),
						country: tzMeta?.country || "",
						countryCode,
					};
				} else {
					// Fallback to Makkah
					currentLocation = {
						latitude: 21.4225,
						longitude: 39.8262,
						city: city || "Makkah",
						country: "Saudi Arabia",
						countryCode: countryCode || "SA",
					};
				}

				setLocation(currentLocation);

				const times = await getPrayerTimes(currentLocation, {
					calculationMethod,
					asrMethod,
					fajrOffset,
					dhuhrOffset,
					asrOffset,
					maghribOffset,
					ishaOffset,
					applySummerHour,
					forceHourMore,
					forceHourLess,
				});
				setPrayerTimes(times);
			} catch (err) {
				setError("Failed to load prayer times");
				console.error(err);
			} finally {
				setLoading(false);
			}
		},
		[dataSettings],
	);

	// getTimezoneCoordinates moved to module scope

	// Update next prayer and progress with real-time precision, recompute every second
	useEffect(() => {
		if (!prayerTimes) return;

		const updateNext = () => {
			const { next, progress, minutesUntilNext } =
				computePrayerProgress(prayerTimes);
			setNextPrayer({
				name: next.name,
				time: next.time,
				timeUntil: minutesUntilNext,
				progress,
			});
		};

		// Initialize immediately to avoid placeholder gap
		updateNext();

		const interval = setInterval(updateNext, 1000);

		return () => clearInterval(interval);
	}, [prayerTimes]);

	// Load on mount and whenever inputs to the memoized loader change
	useEffect(() => {
		void loadPrayerTimes();
	}, [loadPrayerTimes]);

	const updateSettings = useCallback(
		(newSettings: Partial<ExtendedPrayerSettings>) => {
			setSettings((prev) => {
				let hasChange = false;
				for (const key in newSettings) {
					const k = key as keyof ExtendedPrayerSettings;
					if (prev[k] !== newSettings[k]) {
						hasChange = true;
						break;
					}
				}
				return hasChange ? { ...prev, ...newSettings } : prev;
			});
		},
		[],
	);

	const refreshLocation = () => {
		loadPrayerTimes(true); // Use current device location when refreshing
	};

	const getCountdownString = (timeUntilMinutes: number): string => {
		if (timeUntilMinutes < 60) {
			return `${timeUntilMinutes}m`;
		} else if (timeUntilMinutes < 1440) {
			// Less than 24 hours
			const hours = Math.floor(timeUntilMinutes / 60);
			const minutes = timeUntilMinutes % 60;
			return `${hours}h ${minutes}m`;
		} else {
			const days = Math.floor(timeUntilMinutes / 1440);
			const hours = Math.floor((timeUntilMinutes % 1440) / 60);
			return `${days}d ${hours}h`;
		}
	};

	return {
		prayerTimes,
		location,
		settings,
		loading,
		error,
		nextPrayer,
		currentTime,
		updateSettings,
		refreshLocation,
		formatTimeUntil,
		getCountdownString,
	};
}
