import type { PrayerName, PrayerTimes } from "../model";
import { PRAYER_SEQUENCE } from "../model";
import { getNextPrayer } from "./prayer-calculations";

// Time constants
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR; // 1440
const PERCENT_SCALE = 100;
const MIN_PROGRESS = 0;
const MAX_PROGRESS = 100;
const MIN_PERIOD = 1;

/**
 * Adjust a time in HH:MM format by a given number of minutes.
 * Handles day wrapping correctly.
 */
export function adjustTimeByMinutes(
	hhmm: string,
	deltaMinutes: number
): string {
	if (!deltaMinutes) {
		return hhmm;
	}
	const [h, m] = hhmm.split(":").map(Number);
	let total = h * MINUTES_PER_HOUR + m + deltaMinutes;
	total = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
	const nh = Math.floor(total / MINUTES_PER_HOUR)
		.toString()
		.padStart(2, "0");
	const nm = (total % MINUTES_PER_HOUR).toString().padStart(2, "0");
	return `${nh}:${nm}`;
}

/**
 * Compute the next prayer, the progress through the current prayer interval,
 * and the minutes remaining until the next prayer.
 */
export function computePrayerProgress(
	prayerTimes: PrayerTimes,
	now: Date = new Date()
): {
	next: { name: PrayerName; time: string };
	progress: number;
	minutesUntilNext: number;
} {
	const next = getNextPrayer(prayerTimes);
	const currentMinutes =
		now.getHours() * MINUTES_PER_HOUR +
		now.getMinutes() +
		now.getSeconds() / SECONDS_PER_MINUTE;

	const prayers = PRAYER_SEQUENCE.map(({ name, key }) => {
		const [hours, minutes] = prayerTimes[key].split(":").map(Number);
		return {
			name,
			time: prayerTimes[key],
			minutes: hours * MINUTES_PER_HOUR + minutes,
		};
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
			? prayers[0].minutes + MINUTES_PER_DAY
			: prayers[nextPrayerIndex].minutes;
	const normalizedNow =
		currentMinutes < periodStart
			? currentMinutes + MINUTES_PER_DAY
			: currentMinutes;
	const totalPeriod = Math.max(MIN_PERIOD, periodEnd - periodStart);
	const elapsed = Math.max(MIN_PROGRESS, normalizedNow - periodStart);
	const progress = Math.max(
		MIN_PROGRESS,
		Math.min(MAX_PROGRESS, (elapsed / totalPeriod) * PERCENT_SCALE)
	);
	const nextPrayerTimeInSeconds = periodEnd * SECONDS_PER_MINUTE;
	const currentTimeInSeconds = normalizedNow * SECONDS_PER_MINUTE;
	const timeUntilSeconds = nextPrayerTimeInSeconds - currentTimeInSeconds;
	const timeUntilMinutes = Math.ceil(timeUntilSeconds / SECONDS_PER_MINUTE);

	return {
		next: { name: next.name, time: next.time },
		progress,
		minutesUntilNext: Math.max(0, timeUntilMinutes),
	};
}

/**
 * Format minutes until next prayer as a human-readable countdown string.
 */
export function getCountdownString(timeUntilMinutes: number): string {
	if (timeUntilMinutes < MINUTES_PER_HOUR) {
		return `${timeUntilMinutes}m`;
	}
	if (timeUntilMinutes < MINUTES_PER_DAY) {
		// Less than 24 hours
		const hours = Math.floor(timeUntilMinutes / MINUTES_PER_HOUR);
		const minutes = timeUntilMinutes % MINUTES_PER_HOUR;
		return `${hours}h ${minutes}m`;
	}
	const days = Math.floor(timeUntilMinutes / MINUTES_PER_DAY);
	const hours = Math.floor(
		(timeUntilMinutes % MINUTES_PER_DAY) / MINUTES_PER_HOUR
	);
	return `${days}d ${hours}h`;
}
