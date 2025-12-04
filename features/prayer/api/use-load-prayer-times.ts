"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LocationService } from "@/entities/location";
import type {
	ExtendedPrayerSettings,
	Location,
	PrayerTimes,
} from "@/entities/prayer";
import { PrayerService } from "@/entities/prayer";
import {
	getLocationFromTimezoneLocalized,
	getTimezoneCoordinates,
	TIMEZONES,
} from "@/shared/lib/timezone";
import { WTIMES_API_URL } from "../config/constants";

/**
 * Hook that handles prayer times loading with location detection.
 * Manages timezone-based and device-based location resolution.
 */
export function useLoadPrayerTimes(
	settings: ExtendedPrayerSettings,
	setSettings: (
		updater: (prev: ExtendedPrayerSettings) => ExtendedPrayerSettings
	) => void
) {
	const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
	const [location, setLocation] = useState<Location | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDetectingLocation, setIsDetectingLocation] = useState(false);
	const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
	// Use a ref to avoid re-creating loaders when detection state flips during a run
	const isDetectingRef = useRef(false);
	// Single-flight promise to prevent concurrent location detection
	const detectPromiseRef = useRef<Promise<Location> | null>(null);
	// Single-flight for loading prayer times and dedupe identical loads
	const loadInFlightRef = useRef<{
		key: string;
		promise: Promise<void>;
	} | null>(null);
	const lastLoadedKeyRef = useRef<string | null>(null);

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
		]
	);

	// Track whether auto-detect was just enabled to trigger location fetch
	const autoDetectEnabledRef = useRef(false);

	// Helper to resolve location from device
	const resolveDeviceLocation = useCallback(
		(language: string): Promise<Location> => {
			// If a detection is already in progress, reuse it
			if (detectPromiseRef.current) {
				return detectPromiseRef.current;
			}

			isDetectingRef.current = true;
			setIsDetectingLocation(true);
			detectPromiseRef.current = (async () => {
				try {
					const detected = await LocationService.getCurrentLocation(
						language as "en" | "ar"
					);

					// Reflect detected data into settings for UI/state coherency
					setSettings((prev) => {
						const sysTz =
							Intl.DateTimeFormat().resolvedOptions().timeZone ||
							prev.timezone ||
							"Asia/Mecca";
						const next = {
							...prev,
							timezone: sysTz,
							countryCode: detected.countryCode || prev.countryCode,
							city: detected.city || prev.city,
							locationError: undefined as string | undefined,
						};
						if (
							prev.timezone === next.timezone &&
							prev.countryCode === next.countryCode &&
							prev.city === next.city &&
							prev.locationError === next.locationError
						) {
							return prev;
						}
						return next;
					});
					return detected;
				} finally {
					setIsDetectingLocation(false);
					isDetectingRef.current = false;
					detectPromiseRef.current = null;
				}
			})();

			return detectPromiseRef.current;
		},
		[setSettings]
	);

	// Helper to resolve location from timezone
	const resolveTimezoneLocation = useCallback(
		(tz: string, language: string, country: string): Location => {
			const tzMeta = TIMEZONES.find((t) => t.value === tz);
			return {
				latitude: getTimezoneCoordinates(tz).lat,
				longitude: getTimezoneCoordinates(tz).lng,
				city:
					settings.city ||
					getLocationFromTimezoneLocalized(tz, language as "en" | "ar"),
				country: tzMeta?.country || "",
				countryCode: country,
			};
		},
		[settings.city]
	);

	// Helper to get default location (Mecca)
	const getDefaultLocation = useCallback(
		(country: string): Location => ({
			latitude: 21.4225,
			longitude: 39.8262,
			city: settings.city || "Makkah Al-Mukarramah",
			country: "Saudi Arabia",
			countryCode: country || "SA",
		}),
		[settings.city]
	);

	// Helper to resolve location based on settings
	const resolveLocation = useCallback(
		(useCurrentLocation: boolean): Promise<Location> => {
			const language = settings.language || "en";
			if (useCurrentLocation || settings.autoDetectTimezone === true) {
				return resolveDeviceLocation(language);
			}
			if (settings.timezone) {
				return Promise.resolve(
					resolveTimezoneLocation(
						settings.timezone,
						language,
						settings.countryCode || ""
					)
				);
			}
			return Promise.resolve(getDefaultLocation(settings.countryCode || ""));
		},
		[
			settings.language,
			settings.autoDetectTimezone,
			settings.timezone,
			settings.countryCode,
			resolveDeviceLocation,
			resolveTimezoneLocation,
			getDefaultLocation,
		]
	);

	// Helper to build deduplication key
	const buildLoadKey = useCallback(
		(useCurrentLocation: boolean): string => {
			const {
				timezone,
				countryCode,
				city: _city,
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

			const today = new Date().toISOString().slice(0, 10);
			return JSON.stringify({
				date: today,
				useCurrentLocation:
					useCurrentLocation || settings.autoDetectTimezone === true,
				timezone: timezone || null,
				countryCode: countryCode || null,
				city: _city || null,
				calculationMethod,
				asrMethod,
				fajrOffset: fajrOffset || 0,
				dhuhrOffset: dhuhrOffset || 0,
				asrOffset: asrOffset || 0,
				maghribOffset: maghribOffset || 0,
				ishaOffset: ishaOffset || 0,
				applySummerHour: !!applySummerHour,
				forceHourMore: !!forceHourMore,
				forceHourLess: !!forceHourLess,
			});
		},
		[dataSettings, settings.autoDetectTimezone]
	);

	const loadPrayerTimes = useCallback(
		async (useCurrentLocation = false) => {
			const {
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

			const loadKey = buildLoadKey(useCurrentLocation);

			// If an identical load is in-flight, reuse it
			if (loadInFlightRef.current?.key === loadKey) {
				return loadInFlightRef.current.promise;
			}
			// If we've already completed an identical load, skip
			if (lastLoadedKeyRef.current === loadKey) {
				return Promise.resolve();
			}

			try {
				if (!hasLoadedOnce) {
					setLoading(true);
				}
				setError(null);

				const run = (async () => {
					const currentLocation = await resolveLocation(useCurrentLocation);
					setLocation(currentLocation);

					const times = await PrayerService.getPrayerTimes(
						currentLocation,
						{
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
						},
						{
							wtimesUrl: WTIMES_API_URL,
						}
					);
					setPrayerTimes(times);
				})();

				loadInFlightRef.current = { key: loadKey, promise: run };
				await run;
				lastLoadedKeyRef.current = loadKey;
			} catch (_err) {
				setError("Failed to load prayer times");
			} finally {
				loadInFlightRef.current = null;
				if (!hasLoadedOnce) {
					setLoading(false);
				}
			}
		},
		[dataSettings, hasLoadedOnce, buildLoadKey, resolveLocation]
	);

	// When user enables auto-detect, immediately prefer device location (ONCE)
	useEffect(() => {
		if (settings.autoDetectTimezone && !autoDetectEnabledRef.current) {
			autoDetectEnabledRef.current = true;
			loadPrayerTimes(true)
				.then(() => {
					if (!hasLoadedOnce) {
						setHasLoadedOnce(true);
					}
				})
				.catch(() => {
					// Handle error silently
				});
		} else if (!settings.autoDetectTimezone) {
			autoDetectEnabledRef.current = false;
		}
	}, [settings.autoDetectTimezone, loadPrayerTimes, hasLoadedOnce]);

	// Load on mount and whenever inputs to the memoized loader change
	useEffect(() => {
		// Avoid duplicate initial load when auto-detect is enabled
		if (settings.autoDetectTimezone) {
			return;
		}
		loadPrayerTimes(false)
			.then(() => {
				if (!hasLoadedOnce) {
					setHasLoadedOnce(true);
				}
			})
			.catch(() => {
				// Handle error silently
			});
	}, [loadPrayerTimes, hasLoadedOnce, settings.autoDetectTimezone]);

	return {
		prayerTimes,
		location,
		loading,
		error,
		loadPrayerTimes,
		isDetectingLocation,
		hasLoadedOnce,
	};
}
