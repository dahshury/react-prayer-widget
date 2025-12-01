import {
	DAY_OFFSET,
	DAYS_IN_WEEK,
	MARCH_MONTH,
	MONTH_END_DATE,
	OCTOBER_MONTH,
} from "../config/dst-constants";

export function isInDST(dateStr?: string, applySummerHour?: boolean): boolean {
	if (!applySummerHour) {
		return false;
	}
	const d = dateStr ? new Date(dateStr) : new Date();
	const y = d.getFullYear();
	// last Sunday of March
	const march = new Date(Date.UTC(y, MARCH_MONTH, MONTH_END_DATE));
	const lastSunMarch = new Date(march);
	lastSunMarch.setUTCDate(
		MONTH_END_DATE - ((march.getUTCDay() + DAY_OFFSET) % DAYS_IN_WEEK)
	);
	// last Sunday of October
	const oct = new Date(Date.UTC(y, OCTOBER_MONTH, MONTH_END_DATE));
	const lastSunOct = new Date(oct);
	lastSunOct.setUTCDate(
		MONTH_END_DATE - ((oct.getUTCDay() + DAY_OFFSET) % DAYS_IN_WEEK)
	);
	const dayUTC = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
	const startUTC = Date.UTC(
		lastSunMarch.getUTCFullYear(),
		lastSunMarch.getUTCMonth(),
		lastSunMarch.getUTCDate()
	);
	const endUTC = Date.UTC(
		lastSunOct.getUTCFullYear(),
		lastSunOct.getUTCMonth(),
		lastSunOct.getUTCDate()
	);
	return dayUTC > startUTC && dayUTC < endUTC;
}
