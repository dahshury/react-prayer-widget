"use client";

import { useEffect, useRef } from "react";
import type { ExtendedPrayerSettings } from "@/entities/prayer";
import { LocationService } from "@/services/location";

/**
 * Hook that monitors geolocation permission changes.
 * If user previously denied and later grants permission, auto-enables auto-detect.
 */
export function useGeolocationPermission(
	settings: ExtendedPrayerSettings,
	setSettings: (
		updater: (prev: ExtendedPrayerSettings) => ExtendedPrayerSettings
	) => void,
	loadPrayerTimes: (useCurrentLocation: boolean) => Promise<void>
) {
	const cleanupRef = useRef<(() => void) | undefined>(undefined);

	useEffect(() => {
		if (typeof navigator === "undefined" || !("permissions" in navigator)) {
			return;
		}

		let disposed = false;

		// Helper to handle permission changes
		const handlePermissionChange = async (
			status: PermissionStatus,
			currentSettings: ExtendedPrayerSettings
		): Promise<void> => {
			if (disposed) {
				return;
			}
			if (status.state === "granted" && currentSettings.locationError) {
				try {
					const detected = await LocationService.getCurrentLocation(
						currentSettings.language || "en",
						{ strict: true }
					);
					const sysTz =
						Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Mecca";
					setSettings((prev) => ({
						...prev,
						autoDetectTimezone: true,
						timezone: sysTz,
						countryCode: detected.countryCode || prev.countryCode,
						city: detected.city || prev.city,
						cityCode: undefined,
						locationError: undefined,
					}));
					// Recompute using device coordinates
					await loadPrayerTimes(true);
				} catch {
					// Ignore retry failures
				}
			}
		};

		(async () => {
			try {
				const status = await navigator.permissions.query({
					name: "geolocation" as PermissionName,
				});

				// Create stable handler that can be added/removed from event listener
				const handleChange = async () => {
					await handlePermissionChange(status, settings);
				};

				status.addEventListener("change", handleChange);
				// Trigger once in case it is already granted now
				await handleChange();
				cleanupRef.current = () =>
					status.removeEventListener("change", handleChange);
			} catch {
				// Permissions API unsupported; nothing to do
			}
		})();

		return () => {
			disposed = true;
			if (cleanupRef.current) {
				cleanupRef.current();
			}
		};
	}, [settings, loadPrayerTimes, setSettings]);
}
