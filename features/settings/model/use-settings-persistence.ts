"use client";

import { useEffect, useState } from "react";
import type { ExtendedPrayerSettings } from "@/entities/prayer";
import {
	DEFAULT_EXTENDED_SETTINGS,
	SETTINGS_STORAGE_KEY,
} from "@/shared/libs/prayer";

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
				return base;
			}
			const parsed = JSON.parse(raw) as Partial<ExtendedPrayerSettings>;
			return { ...base, ...parsed };
		} catch (_e) {
			return { ...DEFAULT_EXTENDED_SETTINGS, ...(initialSettings || {}) };
		}
	});

	// Persist settings to localStorage whenever they change
	useEffect(() => {
		try {
			if (typeof window !== "undefined") {
				localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
			}
		} catch (_e) {
			// Silently ignore storage errors
		}
	}, [settings]);

	return { settings, setSettings };
}
