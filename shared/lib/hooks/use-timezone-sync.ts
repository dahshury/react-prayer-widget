"use client";

import { useEffect } from "react";
import type { ExtendedPrayerSettings } from "@/entities/prayer";
import { getCountryCodeFromTimezone } from "@/shared/lib/timezone";

/**
 * Hook that keeps timezone in sync with system timezone when auto-detect is enabled.
 * Detects changes to the system timezone and updates settings accordingly.
 */
export function useTimezoneSync(
	settings: ExtendedPrayerSettings,
	setSettings: (
		updater: (prev: ExtendedPrayerSettings) => ExtendedPrayerSettings
	) => void
) {
	useEffect(() => {
		if (settings.autoDetectTimezone) {
			const sysTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			if (sysTz && settings.timezone !== sysTz) {
				setSettings((prev) => ({
					...prev,
					timezone: sysTz,
					countryCode: getCountryCodeFromTimezone(sysTz) || prev.countryCode,
				}));
			}
		}
	}, [settings.autoDetectTimezone, settings.timezone, setSettings]);
}
