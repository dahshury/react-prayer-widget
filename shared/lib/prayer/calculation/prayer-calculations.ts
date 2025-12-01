import type { PrayerTimes } from "@/entities/prayer";

/**
 * Apply a time offset to an HH:MM format time string
 * Handles day wrapping correctly
 */
export function applyOffset(time: string, offset: number): string {
	if (offset === 0) {
		return time;
	}

	const [hours, minutes] = time.split(":").map(Number);
	const totalMinutes = hours * 60 + minutes + offset;
	const newHours = Math.floor(totalMinutes / 60) % 24;
	const newMinutes = totalMinutes % 60;

	return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}

/**
 * Get the next prayer from current time
 * Returns prayer name, time, and minutes until it occurs
 */
export function getNextPrayer(prayerTimes: PrayerTimes): {
	name: string;
	time: string;
	timeUntil: number;
} {
	const now = new Date();
	const currentTime = now.getHours() * 60 + now.getMinutes();

	const prayers = [
		{ name: "Fajr", time: prayerTimes.fajr },
		{ name: "Sunrise", time: prayerTimes.sunrise },
		{ name: "Dhuhr", time: prayerTimes.dhuhr },
		{ name: "Asr", time: prayerTimes.asr },
		{ name: "Maghrib", time: prayerTimes.maghrib },
		{ name: "Isha", time: prayerTimes.isha },
	];

	for (const prayer of prayers) {
		const [prayerHours, prayerMinutes] = prayer.time.split(":").map(Number);
		const prayerTime = prayerHours * 60 + prayerMinutes;

		if (prayerTime > currentTime) {
			return {
				name: prayer.name,
				time: prayer.time,
				timeUntil: prayerTime - currentTime,
			};
		}
	}

	// If no prayer found today, return Fajr of next day
	const [hours, minutes] = prayers[0].time.split(":").map(Number);
	const fajrTime = hours * 60 + minutes;
	const timeUntilNextFajr = 24 * 60 - currentTime + fajrTime;

	return {
		name: prayers[0].name,
		time: prayers[0].time,
		timeUntil: timeUntilNextFajr,
	};
}

/**
 * Format minutes until next prayer as a human-readable countdown string
 */
export function formatTimeUntil(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hours > 0) {
		return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
	}
	return `00:${mins.toString().padStart(2, "0")}:00`;
}
