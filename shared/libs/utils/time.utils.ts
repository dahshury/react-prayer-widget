/**
 * Check if a time in HHmm format has already passed today
 * @param hhmm - Time string in HH:mm format (e.g., "14:30")
 * @returns true if the time has passed, false otherwise
 */
export function isPast(hhmm: string): boolean {
	const [h, m] = hhmm.split(":").map(Number);
	const now = new Date();
	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	return h * 60 + m < currentMinutes;
}
