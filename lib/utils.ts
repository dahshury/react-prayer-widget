import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTimeDisplay(
	time24h: string,
	use24Hour: boolean,
	locale: "en" | "ar" = "en",
): string {
	const sanitized = sanitizeTimeString(time24h);
	if (use24Hour) return sanitized;
	const [hStr, mStr] = sanitized.split(":");
	const hours = Number(hStr);
	const period =
		hours >= 12 ? (locale === "ar" ? "م" : "PM") : locale === "ar" ? "ص" : "AM";
	const hour12 = hours % 12 === 0 ? 12 : hours % 12;
	return `${hour12}:${mStr} ${period}`;
}

// Note: helpers duplicated later in this file with improved behavior

export function formatMinutesHHmm(totalMinutes: number): string {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	const hh = String(hours).padStart(2, "0");
	const mm = String(minutes).padStart(2, "0");
	return `${hh}:${mm}`;
}

// Extracts the first HH:MM pattern from a string, clamps to 24h format.
export function sanitizeTimeString(raw: string): string {
	if (!raw) return "00:00";
	const match = raw.match(/(\d{1,2}):(\d{2})/);
	if (!match) return "00:00";
	let h = Number(match[1]);
	let m = Number(match[2]);
	if (!Number.isFinite(h) || !Number.isFinite(m)) return "00:00";
	h = Math.max(0, Math.min(23, h));
	m = Math.max(0, Math.min(59, m));
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const countryNameToISO2: Record<string, string> = {
	"saudi arabia": "SA",
	"kingdom of saudi arabia": "SA",
	"united arab emirates": "AE",
	uae: "AE",
	kuwait: "KW",
	qatar: "QA",
	bahrain: "BH",
	oman: "OM",
	iraq: "IQ",
	syria: "SY",
	lebanon: "LB",
	jordan: "JO",
	palestine: "PS",
	egypt: "EG",
	morocco: "MA",
	tunisia: "TN",
	algeria: "DZ",
	turkey: "TR",
	pakistan: "PK",
	bangladesh: "BD",
	indonesia: "ID",
	malaysia: "MY",
	"united kingdom": "GB",
	uk: "GB",
	"great britain": "GB",
	"united states": "US",
	usa: "US",
	canada: "CA",
	australia: "AU",
};

function iso2ToFlag(iso2: string): string {
	const code = iso2.trim().toUpperCase();
	if (code.length !== 2) return "";
	const A = 0x1f1e6;
	const base = "A".charCodeAt(0);
	const chars = Array.from(code).map((ch) =>
		String.fromCodePoint(A + (ch.charCodeAt(0) - base)),
	);
	return chars.join("");
}

export function countryToFlag(countryOrCode?: string): string {
	if (!countryOrCode) return "";
	const val = countryOrCode.trim();
	if (val.length === 2) {
		return iso2ToFlag(val);
	}
	const iso = countryNameToISO2[val.toLowerCase()];
	return iso ? iso2ToFlag(iso) : "";
}

export function formatCurrentTime(
	date: Date,
	use24Hour: boolean,
	language: "en" | "ar" = "en",
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
		const period =
			hours >= 12
				? language === "ar"
					? "م"
					: "PM"
				: language === "ar"
					? "ص"
					: "AM";
		const hour12 = hours % 12 === 0 ? 12 : hours % 12;
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
		const match = withOffset.match(/GMT[+-]\d{1,2}/);
		if (match) return match[0];
		// Fallback to short name which often includes GMT offset
		const withShort = new Intl.DateTimeFormat("en-US", {
			timeZone,
			timeZoneName: "short",
		}).format(now);
		const m2 = withShort.match(/GMT[+-]\d{1,2}/);
		if (m2) return m2[0];
	} catch {
		// ignore
	}
	return "GMT";
}
