// Time constants
const HOURS_IN_HALF_DAY = 12;
const HOUR_RESET = 0;
const PM_THRESHOLD = 12;

// Regex patterns (top-level for performance)
const TIME_REGEX = /(\d{1,2}):(\d{2})/;
const GMT_OFFSET_REGEX = /GMT[+-]\d{1,2}/;

// Helper to get AM/PM period string
function getPeriod(isPM: boolean, locale: "en" | "ar"): string {
	if (isPM) {
		return locale === "ar" ? "م" : "PM";
	}
	return locale === "ar" ? "ص" : "AM";
}

export function formatTimeDisplay(
	time24h: string,
	use24Hour: boolean,
	locale: "en" | "ar" = "en"
): string {
	const sanitized = sanitizeTimeString(time24h);
	if (use24Hour) {
		return sanitized;
	}
	const [hStr, mStr] = sanitized.split(":");
	const hours = Number(hStr);

	// Determine AM/PM period
	const isPM = hours >= PM_THRESHOLD;
	const period = getPeriod(isPM, locale);

	const hour12 =
		hours % HOURS_IN_HALF_DAY === HOUR_RESET
			? HOURS_IN_HALF_DAY
			: hours % HOURS_IN_HALF_DAY;
	return `${hour12}:${mStr} ${period}`;
}

export function formatMinutesHHmm(totalMinutes: number): string {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	const hh = String(hours).padStart(2, "0");
	const mm = String(minutes).padStart(2, "0");
	return `${hh}:${mm}`;
}

export function sanitizeTimeString(raw: string): string {
	if (!raw) {
		return "00:00";
	}
	const match = raw.match(TIME_REGEX);
	if (!match) {
		return "00:00";
	}
	let h = Number(match[1]);
	let m = Number(match[2]);
	if (!(Number.isFinite(h) && Number.isFinite(m))) {
		return "00:00";
	}
	const MAX_HOURS = 23;
	const MAX_MINUTES = 59;
	h = Math.max(0, Math.min(MAX_HOURS, h));
	m = Math.max(0, Math.min(MAX_MINUTES, m));
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatCurrentTime(
	date: Date,
	use24Hour: boolean,
	language: "en" | "ar" = "en"
): string {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	if (use24Hour) {
		// Force 24h formatting regardless of locale behavior
		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
	}
	try {
		const base = language === "ar" ? "ar-SA" : "en-US";
		return new Intl.DateTimeFormat(base, {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(date);
	} catch {
		const isPM = hours >= PM_THRESHOLD;
		const period = getPeriod(isPM, language);
		const hour12 =
			hours % HOURS_IN_HALF_DAY === HOUR_RESET
				? HOURS_IN_HALF_DAY
				: hours % HOURS_IN_HALF_DAY;
		return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
	}
}

export function getGmtOffsetLabel(timeZone: string): string {
	try {
		const now = new Date();
		// Prefer shortOffset if supported
		const withOffset = new Intl.DateTimeFormat("en-US", {
			timeZone,
			hour: "2-digit",
			timeZoneName: "shortOffset",
			hour12: false,
		}).format(now);
		const match = withOffset.match(GMT_OFFSET_REGEX);
		if (match) {
			return match[0];
		}
		// Fallback to short name which often includes GMT offset
		const withShort = new Intl.DateTimeFormat("en-US", {
			timeZone,
			timeZoneName: "short",
		}).format(now);
		const m2 = withShort.match(GMT_OFFSET_REGEX);
		if (m2) {
			return m2[0];
		}
	} catch {
		// ignore
	}
	return "GMT";
}
