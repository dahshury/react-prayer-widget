"use client";

import { useEffect, useState } from "react";
import type { ExtendedPrayerSettings } from "@/entities/prayer";
import {
	DEFAULT_EXTENDED_SETTINGS,
	SETTINGS_STORAGE_KEY,
} from "@/entities/prayer";
import { setLocaleCookie } from "@/shared/lib/utils/cookie.utils";

/**
 * Persists all settings to localStorage for consistency across page refreshes.
 *
 * Note: Azan audio files are stored separately in localStorage with keys like:
 * - tawkit:azan:custom:Fajr (for per-prayer custom files)
 * - tawkit:azan:custom:GLOBAL (for global custom file)
 * The settings object only contains metadata (choice IDs, display names, volume, etc.),
 * not the actual audio file data.
 */
export function useSettingsPersistence(
	initialSettings?: Partial<ExtendedPrayerSettings>
) {
	const [settings, setSettings] = useState<ExtendedPrayerSettings>(() => {
		// Initialize from localStorage synchronously to avoid a second hydration pass
		try {
			const base = { ...DEFAULT_EXTENDED_SETTINGS, ...(initialSettings || {}) };
			if (typeof window === "undefined") {
				return base;
			}
			const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
			if (!raw) {
				// Set initial cookie if no settings exist
				if (base.language) {
					setLocaleCookie(base.language);
				}
				return base;
			}
			const parsed = JSON.parse(raw) as Partial<ExtendedPrayerSettings>;
			// Merge parsed settings with defaults to ensure all fields are present
			const merged = { ...base, ...parsed };
			// Sync locale to cookie on initial load
			if (merged.language) {
				setLocaleCookie(merged.language);
			}
			return merged;
		} catch (_e) {
			return { ...DEFAULT_EXTENDED_SETTINGS, ...(initialSettings || {}) };
		}
	});

	// Persist all settings to localStorage whenever they change
	// This ensures all user preferences are saved and restored on page refresh
	useEffect(() => {
		try {
			if (typeof window !== "undefined") {
				// Save all settings to localStorage
				// Audio files are stored separately, so they're not included here
				localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));

				// Sync locale to cookie for server-side rendering
				if (settings.language) {
					setLocaleCookie(settings.language);
				}
			}
		} catch (_e) {
			// Silently ignore storage errors (e.g., quota exceeded, private browsing)
		}
	}, [settings]);

	return { settings, setSettings };
}
