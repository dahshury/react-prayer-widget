"use client";

import { useEffect } from "react";
import type { ExtendedPrayerSettings } from "@/entities/prayer";
import { DEFAULT_PRAYER_FONT, DEFAULT_TIME_FONT } from "../fonts";

/**
 * Hook to apply font settings to CSS variables
 * Updates --prayer-name-font and --prayer-time-font based on settings
 */
export function useFontSettings(settings: ExtendedPrayerSettings) {
	useEffect(() => {
		const root = document.documentElement;

		// Get font values from settings or use defaults
		const prayerFont = settings.prayerFont || DEFAULT_PRAYER_FONT;
		const timeFont = settings.timeFont || DEFAULT_TIME_FONT;

		// Map font values to CSS font-family values
		const getFontFamily = (fontValue: string): string => {
			if (fontValue === "default") {
				return "var(--font-sans)";
			}
			// Return the font name as-is, it will be used as font-family
			return `"${fontValue}", var(--font-sans)`;
		};

		// Apply fonts to CSS variables
		root.style.setProperty("--prayer-name-font", getFontFamily(prayerFont));
		root.style.setProperty("--prayer-time-font", getFontFamily(timeFont));
	}, [settings.prayerFont, settings.timeFont]);
}
