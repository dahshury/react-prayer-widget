"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { AZKAR_GENERAL, AZKAR_MASAA, AZKAR_SABAH } from "@/lib/azkar";
import {
	DEFAULT_ISLAMIC_CONTENT,
	type IslamicContent,
} from "@/lib/islamic-content";
import type { PrayerTimes } from "@/lib/prayer-api";

interface MinimalTickerProps {
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
}

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
		contentPool?.[0] ?? DEFAULT_ISLAMIC_CONTENT[0],
	);

	// Decide which pool (Sabah vs Masaa) based on current time (or prayer times if available)
	const basePool = useMemo<IslamicContent[]>(() => {
		if (contentPool && contentPool.length > 0) return contentPool;
		const now = new Date();
		const hour = now.getHours();
		let morning = hour >= 4 && hour < 12;
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
		}, intervalMs ?? 5000);

		return () => clearInterval(interval);
	}, [basePool, intervalMs]);

	return (
		<div
			className={`bg-muted/30 rounded-lg px-3 py-2 border border-muted/50 ${className} ${classes?.container ?? ""}`}
		>
			<div
				className={`text-xs text-foreground/90 leading-relaxed line-clamp-2 ${classes?.text ?? ""}`}
			>
				{language === "ar"
					? currentContent.arabic || currentContent.english
					: currentContent.english}
			</div>
			{showSource && (
				<div
					className={`text-[10px] text-foreground/70 mt-1 ${classes?.source ?? ""}`}
				>
					— {currentContent.source}
				</div>
			)}
		</div>
	);
}
