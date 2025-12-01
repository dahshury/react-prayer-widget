import { MINUTES_PER_DAY, MINUTES_PER_HOUR } from "../config/dst-constants";

export function shift(hhmm: string, delta?: number): string {
	if (!delta || delta === 0) {
		return hhmm;
	}
	const [h, m] = hhmm.split(":").map((n) => Number(n));
	if (!(Number.isFinite(h) && Number.isFinite(m))) {
		return hhmm;
	}
	let total = h * MINUTES_PER_HOUR + m + delta;
	total = ((total % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
	const nh = Math.floor(total / MINUTES_PER_HOUR);
	const nm = total % MINUTES_PER_HOUR;
	return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

export function shift1h(hhmm: string, sign: 1 | -1): string {
	return shift(hhmm, sign === 1 ? MINUTES_PER_HOUR : -MINUTES_PER_HOUR);
}
