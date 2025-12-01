"use client";

import { useEffect, useState } from "react";
import type { PrayerTimes } from "@/entities/prayer";
import { computePrayerProgress } from "@/entities/prayer";

const PRAYER_PROGRESS_UPDATE_INTERVAL_MS = 1000; // Update every 1 second

/**
 * Hook that tracks real-time prayer progress.
 * Updates every second to provide live countdown and progress percentage.
 */
export function usePrayerProgress(prayerTimes: PrayerTimes | null) {
	const [nextPrayer, setNextPrayer] = useState<{
		name: string;
		time: string;
		timeUntil: number;
		progress: number;
	} | null>(null);

	useEffect(() => {
		if (!prayerTimes) {
			return;
		}

		const updateNext = () => {
			const { next, progress, minutesUntilNext } =
				computePrayerProgress(prayerTimes);
			setNextPrayer({
				name: next.name,
				time: next.time,
				timeUntil: minutesUntilNext,
				progress,
			});
		};

		// Initialize immediately to avoid placeholder gap
		updateNext();

		const interval = setInterval(
			updateNext,
			PRAYER_PROGRESS_UPDATE_INTERVAL_MS
		);

		return () => clearInterval(interval);
	}, [prayerTimes]);

	return nextPrayer;
}
