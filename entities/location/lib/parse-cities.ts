import type { CityEntry } from "../model/location";

const CITY_MATCH_REGEX = /^"(.+?)"/;

export function parseCities(jsContent: string): CityEntry[] {
	// Expect lines like: "SA.MAKKAH.مكه" or "SE.STOCKHOLM.---"
	const start = jsContent.indexOf("[");
	const end = jsContent.lastIndexOf("]");
	if (start === -1 || end === -1) {
		return [];
	}
	const arrayContent = jsContent.slice(start + 1, end);
	const lines = arrayContent
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
	const results: CityEntry[] = [];
	for (const line of lines) {
		// Remove trailing comma and wrapping quotes
		const m = line.match(CITY_MATCH_REGEX);
		if (!m) {
			continue;
		}
		const entry = m[1];
		const parts = entry.split(".");
		if (parts.length >= 2) {
			const cc = parts[0];
			const city = parts[1];
			const extra = parts[2] && parts[2] !== "---" ? parts[2] : undefined;
			results.push({ code: `${cc}.${city}`, city, extra });
		}
	}
	return results;
}
