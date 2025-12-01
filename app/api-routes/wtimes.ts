import { promises as fs } from "node:fs";
import { NextResponse } from "next/server";
import type { PrayerTimesRequestBody } from "@/entities/prayer/api";
import {
	findWtimesFile,
	isInDST,
	parseTimesFromFileContent,
	shift,
	shift1h,
} from "@/entities/prayer/lib";
import { toMonthDay } from "@/shared/libs/time";

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as PrayerTimesRequestBody;
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

		const applySummerHour = !!body.applySummerHour;
		const forcePlus = !!body.forceHourMore;
		const forceMinus = !!body.forceHourLess;

		// Apply minute offsets per prayer if provided
		const withOffsets = {
			fajr: shift(times.fajr, body.offsets?.fajr),
			sunrise: shift(times.sunrise, body.offsets?.sunrise),
			dhuhr: shift(times.dhuhr, body.offsets?.dhuhr),
			asr: shift(times.asr, body.offsets?.asr),
			maghrib: shift(times.maghrib, body.offsets?.maghrib),
			isha: shift(times.isha, body.offsets?.isha),
		};

		const dstActive = isInDST(body.date, applySummerHour);
		const afterDst = dstActive
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
