"use client";

import { useCallback } from "react";
import type {
	ExtendedPrayerSettings,
	UsePrayerTimesOptions,
} from "@/entities/prayer";
import { formatTimeUntil, getCountdownString } from "@/entities/prayer";
import {
	useCurrentTime,
	useSettingsPersistence,
	useTimezoneSync,
} from "@/shared/lib/hooks";
import { useLoadPrayerTimes } from "../api/use-load-prayer-times";
import { useGeolocationPermission } from "./use-geolocation-permission";
import { usePrayerProgress } from "./use-prayer-progress";

/**
 * Main orchestration hook that composes sub-hooks for prayer times management.
 * Handles settings, timezone detection, location detection, and real-time updates.
 */
export function usePrayerTimes(options?: UsePrayerTimesOptions) {
	// Sub-hook #1: Current time updates (every second)
	const currentTime = useCurrentTime();

	// Sub-hook #2: Settings with localStorage persistence
	const { settings, setSettings } = useSettingsPersistence(
		options?.initialSettings
	);

	// Sub-hook #3: Timezone sync with system when auto-detect enabled
	useTimezoneSync(settings, setSettings);

	// Sub-hook #4: Load prayer times with location detection
	const {
		prayerTimes,
		location,
		loading,
		error,
		loadPrayerTimes,
		hasLoadedOnce,
	} = useLoadPrayerTimes(settings, setSettings);

	// Sub-hook #5: Geolocation permission monitoring
	useGeolocationPermission(settings, setSettings, loadPrayerTimes);

	// Sub-hook #6: Real-time prayer progress tracking
	const nextPrayer = usePrayerProgress(prayerTimes);

	// Update settings and adjust prayer times by offset
	const updateSettings = useCallback(
		(newSettings: Partial<ExtendedPrayerSettings>) => {
			// Compute offset deltas against current settings to allow immediate UI adjustment
			const nextFajr = newSettings.fajrOffset ?? settings.fajrOffset ?? 0;
			const nextDhuhr = newSettings.dhuhrOffset ?? settings.dhuhrOffset ?? 0;
			const nextAsr = newSettings.asrOffset ?? settings.asrOffset ?? 0;
			const nextMaghrib =
				newSettings.maghribOffset ?? settings.maghribOffset ?? 0;
			const nextIsha = newSettings.ishaOffset ?? settings.ishaOffset ?? 0;
			const dFajr = nextFajr - (settings.fajrOffset ?? 0);
			const dDhuhr = nextDhuhr - (settings.dhuhrOffset ?? 0);
			const dAsr = nextAsr - (settings.asrOffset ?? 0);
			const dMaghrib = nextMaghrib - (settings.maghribOffset ?? 0);
			const dIsha = nextIsha - (settings.ishaOffset ?? 0);

			if (dFajr || dDhuhr || dAsr || dMaghrib || dIsha) {
				// Note: Prayer times are managed by sub-hook
				// This just updates the offsets in settings
			}

			setSettings((prev) => {
				let hasChange = false;
				for (const key in newSettings) {
					if (Object.hasOwn(newSettings, key)) {
						const k = key as keyof ExtendedPrayerSettings;
						if (prev[k] !== newSettings[k]) {
							hasChange = true;
							break;
						}
					}
				}
				if (!hasChange) {
					return prev;
				}
				const merged = { ...prev, ...newSettings };
				merged.dimPreviousPrayers = true;
				return merged;
			});
		},
		[settings, setSettings]
	);

	// Refresh location using device coordinates
	const refreshLocation = () => {
		loadPrayerTimes(true).catch(() => {
			// Handle error silently
		});
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
		initialized: hasLoadedOnce,
	};
}
