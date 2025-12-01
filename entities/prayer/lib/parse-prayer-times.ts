export type ParsedPrayerTimes = {
	fajr: string;
	sunrise: string;
	dhuhr: string;
	asr: string;
	maghrib: string;
	isha: string;
};

export function parseTimesFromFileContent(
	content: string,
	mmdd: string
): ParsedPrayerTimes | null {
	// Lines look like: "MM-DD~~~~~Fajr|Sunrise|Dhuhr|Asr|Maghrib|Isha"
	const line = content.split("\n").find((ln) => ln.includes(`${mmdd}~~~~~`));
	if (!line) {
		return null;
	}
	const parts = line.split("~~~~~")[1]?.trim();
	if (!parts) {
		return null;
	}
	const sanitize = (s: string) => s.replace(/[",']/g, "").trim();
	const [fajr, sunrise, dhuhr, asr, maghrib, isha] = parts
		.split("|")
		.map((s) => sanitize(s));
	return { fajr, sunrise, dhuhr, asr, maghrib, isha };
}
