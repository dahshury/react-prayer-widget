import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const CITY_MATCH_REGEX = /^"(.+?)"/;

function parseCities(jsContent: string) {
	// Expect lines like: "SA.MAKKAH.مكه" or "SE.STOCKHOLM.---"
	const start = jsContent.indexOf("[");
	const end = jsContent.lastIndexOf("]");
	if (start === -1 || end === -1) {
		return [] as { code: string; city: string; extra?: string }[];
	}
	const arrayContent = jsContent.slice(start + 1, end);
	const lines = arrayContent
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
	const results: { code: string; city: string; extra?: string }[] = [];
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

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const cc = (searchParams.get("cc") || "").toUpperCase();
		if (!cc || cc.length !== 2) {
			return NextResponse.json({ error: "cc required" }, { status: 400 });
		}

		const root = process.cwd();
		const filePath = path.join(root, "tawkit-9.61", "data", cc, `${cc}.js`);
		const content = await fs.readFile(filePath, "utf8");
		const cities = parseCities(content);
		return NextResponse.json({ cc, cities });
	} catch {
		return NextResponse.json({ error: "not found" }, { status: 404 });
	}
}
