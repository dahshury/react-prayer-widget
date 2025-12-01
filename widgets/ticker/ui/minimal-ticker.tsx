"use client";

import { useEffect, useMemo, useState } from "react";
import type { PrayerTimes } from "@/entities/prayer";
import { useTranslation } from "@/shared/lib/hooks";
import {
	AZKAR_GENERAL,
	AZKAR_MASAA,
	AZKAR_SABAH,
	DEFAULT_ISLAMIC_CONTENT,
	type IslamicContent,
} from "@/shared/lib/prayer";

type MinimalTickerProps = {
	className?: string;
	prayerTimes?: PrayerTimes | null;
	intervalMs?: number;
	/** Override the content pool completely */
	contentPool?: IslamicContent[];
	/** Hide the source line if false */
	showSource?: boolean;
	/** Class overrides */
	classes?: {
		container?: string;
		text?: string;
		source?: string;
	};
};

// Constants for time-based content selection
const MORNING_START_HOUR = 4; // Fajr time typically around 4 AM
const MORNING_END_HOUR = 12; // Before noon
const DEFAULT_TICKER_INTERVAL_MS = 5000; // 5 seconds

export function MinimalTicker({
	className,
	prayerTimes,
	intervalMs,
	contentPool,
	showSource = true,
	classes,
}: MinimalTickerProps) {
	const { language } = useTranslation();
	const [currentContent, setCurrentContent] = useState<IslamicContent>(
		contentPool?.[0] ?? DEFAULT_ISLAMIC_CONTENT[0]
	);

	// Decide which pool (Sabah vs Masaa) based on current time (or prayer times if available)
	const basePool = useMemo<IslamicContent[]>(() => {
		if (contentPool && contentPool.length > 0) {
			return contentPool;
		}
		const now = new Date();
		const hour = now.getHours();
		let morning = hour >= MORNING_START_HOUR && hour < MORNING_END_HOUR;
		if (prayerTimes) {
			const toMinutes = (t: string) => {
				const [h, m] = t.split(":").map(Number);
				return h * 60 + m;
			};
			const nowMin = now.getHours() * 60 + now.getMinutes();
			const fajr = toMinutes(prayerTimes.fajr);
			const asr = toMinutes(prayerTimes.asr);
			morning = nowMin >= fajr && nowMin < asr;
		}
		const timedPool = morning ? AZKAR_SABAH : AZKAR_MASAA;
		return [...AZKAR_GENERAL, ...timedPool, ...DEFAULT_ISLAMIC_CONTENT];
	}, [prayerTimes, contentPool]);

	useEffect(() => {
		let pool: IslamicContent[] = basePool;
		let index = 0;
		setCurrentContent(pool[index]);
		const interval = setInterval(() => {
			pool = basePool;
			index = (index + 1) % pool.length;
			setCurrentContent(pool[index]);
		}, intervalMs ?? DEFAULT_TICKER_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [basePool, intervalMs]);

	return (
		<div
			className={`rounded-lg border border-muted/50 bg-muted/30 px-3 py-2 ${className} ${classes?.container ?? ""}`}
		>
			<div
				className={`line-clamp-2 text-foreground/90 text-xs leading-relaxed ${classes?.text ?? ""}`}
			>
				{language === "ar"
					? currentContent.arabic || currentContent.english
					: currentContent.english}
			</div>
			{!!showSource && (
				<div
					className={`mt-1 text-[10px] text-foreground/70 ${classes?.source ?? ""}`}
				>
					— {currentContent.source}
				</div>
			)}
		</div>
	);
}
