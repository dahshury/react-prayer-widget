import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { parseCities } from "@/entities/location";

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
