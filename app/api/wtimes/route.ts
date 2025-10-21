import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type RequestBody = {
	countryCode?: string;
	timezone?: string;
	date?: string; // YYYY-MM-DD
	city?: string;
	offsets?: {
		fajr?: number;
		sunrise?: number;
		dhuhr?: number;
		asr?: number;
		maghrib?: number;
		isha?: number;
	};
	applySummerHour?: boolean;
	forceHourMore?: boolean;
	forceHourLess?: boolean;
};

const TZ_TO_WTIMES: Record<string, { cc: string; city: string }> = {
	"Asia/Mecca": { cc: "SA", city: "MAKKAH" },
	"Asia/Riyadh": { cc: "SA", city: "RIYADH" },
	"Asia/Dubai": { cc: "AE", city: "DUBAI" },
	"Asia/Kuwait": { cc: "KW", city: "KUWAIT" },
	"Asia/Qatar": { cc: "QA", city: "DOHA" },
	"Asia/Bahrain": { cc: "BH", city: "MANAMA" },
	"Asia/Muscat": { cc: "OM", city: "MUSCAT" },
	"Asia/Baghdad": { cc: "IQ", city: "BAGHDAD" },
	"Asia/Damascus": { cc: "SY", city: "DAMASCUS" },
	"Asia/Beirut": { cc: "LB", city: "BEIRUT" },
	"Asia/Amman": { cc: "JO", city: "AMMAN" },
	"Asia/Jerusalem": { cc: "PS", city: "JERUSALEM" },
	"Africa/Cairo": { cc: "EG", city: "CAIRO" },
	"Africa/Casablanca": { cc: "MA", city: "CASABLANCA" },
	"Africa/Tunis": { cc: "TN", city: "TUNIS" },
	"Africa/Algiers": { cc: "DZ", city: "ALGIERS" },
	"Europe/Istanbul": { cc: "TR", city: "ISTANBUL" },
	"Asia/Karachi": { cc: "PK", city: "KARACHI" },
	"Asia/Dhaka": { cc: "BD", city: "DHAKA" },
	"Asia/Jakarta": { cc: "ID", city: "JAKARTA" },
	"Asia/Kuala_Lumpur": { cc: "MY", city: "KUALA_LUMPUR" },
	"Europe/London": { cc: "UK", city: "LONDON" },
	"America/New_York": { cc: "US", city: "NEW_YORK" },
	"America/Los_Angeles": { cc: "US", city: "LOS_ANGELES" },
	"America/Toronto": { cc: "CA", city: "TORONTO" },
	"Australia/Sydney": { cc: "AU", city: "SYDNEY" },
};

// DST (Daylight Saving Time) constants
const MARCH_MONTH = 2; // 0-indexed: March
const OCTOBER_MONTH = 9; // 0-indexed: October
const MONTH_END_DATE = 31;
const DAY_OFFSET = 6; // Offset for finding last Sunday
const DAYS_IN_WEEK = 7;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

function toMonthDay(dateStr?: string) {
	const d = dateStr ? new Date(dateStr) : new Date();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	return `${mm}-${dd}`;
}

function normalizeCity(raw?: string): string | null {
	if (!raw) {
		return null;
	}
	const basic = raw
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toUpperCase()
		.replace(/\s+/g, "_")
		.replace(/-/g, "_")
		.replace(/[^A-Z0-9_]/g, "_")
		.replace(/_+/g, "_")
		.replace(/^_|_$/g, "");
	return basic || null;
}

// Helper to find wtimes file by city name
function findWtimesByCity(
	entries: string[],
	cityRaw: string | undefined,
	prefixLower: string
): string | null {
	const cityNormalized = normalizeCity(cityRaw || "");
	if (!cityNormalized) {
		return null;
	}
	const cityLower = cityNormalized.toLowerCase();
	const byCity = entries.find((f) => {
		const fl = f.toLowerCase();
		if (!(fl.startsWith(prefixLower) && fl.endsWith(".js"))) {
			return false;
		}
		const after = fl.slice(prefixLower.length);
		return after.startsWith(cityLower);
	});
	return byCity || null;
}

// Helper to find wtimes file by timezone mapping
function findWtimesByTimezone(
	entries: string[],
	mapping: { cc: string; city: string } | null,
	prefixLower: string
): string | null {
	if (!mapping) {
		return null;
	}
	const mappedNormalized = normalizeCity(mapping.city);
	if (!mappedNormalized) {
		return null;
	}
	const cityLower = mappedNormalized.toLowerCase();
	const byTz = entries.find((f) => {
		const fl = f.toLowerCase();
		if (!(fl.startsWith(prefixLower) && fl.endsWith(".js"))) {
			return false;
		}
		const after = fl.slice(prefixLower.length);
		return after.startsWith(cityLower);
	});
	return byTz || null;
}

// Helper to find first wtimes file
function findFirstWtimesFile(
	entries: string[],
	prefixLower: string
): string | null {
	const file = entries.find(
		(f) => f.toLowerCase().startsWith(prefixLower) && f.endsWith(".js")
	);
	return file || null;
}

async function findWtimesFile(
	cc: string,
	timezone?: string,
	cityRaw?: string
): Promise<string | null> {
	try {
		const root = process.cwd();
		const inputCc = cc.toUpperCase();
		const mapping =
			timezone && TZ_TO_WTIMES[timezone] ? TZ_TO_WTIMES[timezone] : null;
		const mappedCc = mapping ? mapping.cc.toUpperCase() : null;

		// Prefer the user-selected country directory first, then fall back to timezone-mapped directory
		const dirCandidates = Array.from(
			new Set([inputCc, mappedCc].filter((v): v is string => !!v))
		).map((code) => ({
			code,
			dir: path.join(root, "tawkit-9.61", "data", code),
		}));

		for (const { code, dir } of dirCandidates) {
			let entries: string[] = [];
			try {
				entries = await fs.readdir(dir);
			} catch {
				continue;
			}
			const codeLower = code.toLowerCase();
			const prefixLower = `wtimes-${codeLower}.`;

			// 1) Try explicit city match if provided
			const byCity = findWtimesByCity(entries, cityRaw, prefixLower);
			if (byCity) {
				return path.join(dir, byCity);
			}

			// 2) Try via timezone mapping
			const byTz = findWtimesByTimezone(entries, mapping, prefixLower);
			if (byTz) {
				return path.join(dir, byTz);
			}

			// 3) Fallback: pick the first wtimes-<CC>.*.js file in this directory
			const file = findFirstWtimesFile(entries, prefixLower);
			if (file) {
				return path.join(dir, file);
			}
		}
		return null;
	} catch {
		return null;
	}
}

function parseTimesFromFileContent(content: string, mmdd: string) {
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

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as RequestBody;
		const cc = (body.countryCode || "").toUpperCase();
		const tz = body.timezone;
		if (!cc) {
			return NextResponse.json(
				{ error: "countryCode required" },
				{ status: 400 }
			);
		}

		const filePath = await findWtimesFile(cc, tz, body.city);
		if (!filePath) {
			return NextResponse.json(
				{ error: "city dataset not found" },
				{ status: 404 }
			);
		}

		const content = await fs.readFile(filePath, "utf8");
		const mmdd = toMonthDay(body.date);
		const times = parseTimesFromFileContent(content, mmdd);
		if (!times) {
			return NextResponse.json(
				{ error: "times for date not found" },
				{ status: 404 }
			);
		}

		// Apply minute offsets per prayer if provided
		const shift = (hhmm: string, delta?: number) => {
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
		};

		const applySummerHour = !!body.applySummerHour;
		const forcePlus = !!body.forceHourMore;
		const forceMinus = !!body.forceHourLess;

		// Europe-style DST window: from last Sunday of March 02:00 to last Sunday of October 03:00
		const isInDST = (() => {
			if (!applySummerHour) {
				return false;
			}
			const d = body.date ? new Date(body.date) : new Date();
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
			const dayUTC = Date.UTC(
				d.getUTCFullYear(),
				d.getUTCMonth(),
				d.getUTCDate()
			);
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
		})();

		const shift1h = (hhmm: string, sign: 1 | -1) =>
			shift(hhmm, sign === 1 ? MINUTES_PER_HOUR : -MINUTES_PER_HOUR);

		const withOffsets = {
			fajr: shift(times.fajr, body.offsets?.fajr),
			sunrise: shift(times.sunrise, body.offsets?.sunrise),
			dhuhr: shift(times.dhuhr, body.offsets?.dhuhr),
			asr: shift(times.asr, body.offsets?.asr),
			maghrib: shift(times.maghrib, body.offsets?.maghrib),
			isha: shift(times.isha, body.offsets?.isha),
		};

		const afterDst = isInDST
			? {
					fajr: shift1h(withOffsets.fajr, 1),
					sunrise: shift1h(withOffsets.sunrise, 1),
					dhuhr: shift1h(withOffsets.dhuhr, 1),
					asr: shift1h(withOffsets.asr, 1),
					maghrib: shift1h(withOffsets.maghrib, 1),
					isha: shift1h(withOffsets.isha, 1),
				}
			: withOffsets;

		const afterForce = (() => {
			let r = afterDst;
			if (forcePlus) {
				r = {
					fajr: shift1h(r.fajr, 1),
					sunrise: shift1h(r.sunrise, 1),
					dhuhr: shift1h(r.dhuhr, 1),
					asr: shift1h(r.asr, 1),
					maghrib: shift1h(r.maghrib, 1),
					isha: shift1h(r.isha, 1),
				};
			}
			if (forceMinus) {
				r = {
					fajr: shift1h(r.fajr, -1),
					sunrise: shift1h(r.sunrise, -1),
					dhuhr: shift1h(r.dhuhr, -1),
					asr: shift1h(r.asr, -1),
					maghrib: shift1h(r.maghrib, -1),
					isha: shift1h(r.isha, -1),
				};
			}
			return r;
		})();

		return NextResponse.json({
			date: body.date || new Date().toISOString().split("T")[0],
			...afterForce,
		});
	} catch {
		return NextResponse.json({ error: "unexpected error" }, { status: 500 });
	}
}
