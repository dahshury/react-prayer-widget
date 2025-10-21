import type { Location, PrayerSettings, PrayerTimes } from "@/entities/prayer";
import { DEFAULT_SETTINGS } from "./constants";

/**
 * Prayer times calculation service
 * Integrates with multiple APIs:
 * - Local Tawkit dataset (via /api/wtimes)
 * - Aladhan Islamic calendar API
 */
export const PrayerService = {
	/**
	 * Get prayer times for a given location
	 * Tries local Tawkit dataset first, falls back to Aladhan API
	 */
	async getPrayerTimes(
		location: Location,
		settings: PrayerSettings = DEFAULT_SETTINGS
	): Promise<PrayerTimes> {
		try {
			const date = new Date();
			const dateStr = date.toISOString().split("T")[0];

			// Prefer local tawkit dataset when we have a country code
			if (location.countryCode) {
				const local = await fetch("/api/wtimes", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						countryCode: location.countryCode,
						timezone:
							location.timezoneName ||
							Intl.DateTimeFormat().resolvedOptions().timeZone,
						date: dateStr,
						city: location.cityCode
							? location.cityCode.split(".")[1]
							: location.city,
						offsets: {
							fajr: settings.fajrOffset || 0,
							sunrise: 0,
							dhuhr: settings.dhuhrOffset || 0,
							asr: settings.asrOffset || 0,
							maghrib: settings.maghribOffset || 0,
							isha: settings.ishaOffset || 0,
						},
						applySummerHour: !!settings.applySummerHour,
						forceHourMore: !!settings.forceHourMore,
						forceHourLess: !!settings.forceHourLess,
					}),
				});
				if (local.ok) {
					const t = await local.json();
					return {
						fajr: t.fajr,
						sunrise: t.sunrise,
						dhuhr: t.dhuhr,
						asr: t.asr,
						maghrib: t.maghrib,
						isha: t.isha,
						date: dateStr,
						hijri: "—",
					};
				}
			}

			const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${location.latitude}&longitude=${location.longitude}&method=${settings.calculationMethod}&school=${settings.asrMethod}`;

			let response: Response;
			try {
				response = await fetch(url);
			} catch (_e) {
				throw new Error("network_fetch_failed");
			}
			if (!response.ok) {
				throw new Error(`fetch_not_ok_${response.status}`);
			}
			const data = await response.json();

			const ALADHAN_API_SUCCESS_CODE = 200;
			if (data.code !== ALADHAN_API_SUCCESS_CODE) {
				throw new Error("Failed to fetch prayer times");
			}

			const timings = data.data.timings;
			const hijriDate = data.data.date.hijri;

			// Apply offsets
			const applyOffset = (time: string, offset: number): string => {
				if (offset === 0) {
					return time;
				}

				const [hours, minutes] = time.split(":").map(Number);
				const totalMinutes = hours * 60 + minutes + offset;
				const newHours = Math.floor(totalMinutes / 60) % 24;
				const newMinutes = totalMinutes % 60;

				return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
			};

			return {
				fajr: applyOffset(timings.Fajr, settings.fajrOffset),
				sunrise: timings.Sunrise,
				dhuhr: applyOffset(timings.Dhuhr, settings.dhuhrOffset),
				asr: applyOffset(timings.Asr, settings.asrOffset),
				maghrib: applyOffset(timings.Maghrib, settings.maghribOffset),
				isha: applyOffset(timings.Isha, settings.ishaOffset),
				date: dateStr,
				hijri: `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}`,
			};
		} catch (_error) {
			// Fallback prayer times for Makkah
			return {
				fajr: "05:30",
				sunrise: "06:45",
				dhuhr: "12:15",
				asr: "15:30",
				maghrib: "18:00",
				isha: "19:30",
				date: new Date().toISOString().split("T")[0],
				hijri: "Loading...",
			};
		}
	},
};
