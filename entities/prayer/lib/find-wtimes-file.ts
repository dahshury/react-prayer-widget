import { promises as fs } from "node:fs";
import path from "node:path";
import { normalizeCity } from "@/entities/location";
import { TZ_TO_WTIMES } from "../config/timezone-mapping";

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

export async function findWtimesFile(
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
