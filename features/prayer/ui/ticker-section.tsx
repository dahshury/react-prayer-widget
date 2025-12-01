"use client";

import type { PrayerTimes } from "@/entities/prayer";
import { DEFAULT_TICKER_INTERVAL_MS } from "@/features/prayer/config";
import { MinimalTicker } from "@/widgets/ticker";

type TickerSectionProps = {
	/** Prayer times for the day */
	prayerTimes: PrayerTimes;
	/** Ticker interval in milliseconds */
	tickerIntervalMs?: number;
};

/**
 * Ticker section component
 * Shows ticker at the bottom when other prayer cards are visible
 */
export function TickerSection({
	prayerTimes,
	tickerIntervalMs,
}: TickerSectionProps) {
	return (
		<div className="mt-8">
			<MinimalTicker
				intervalMs={tickerIntervalMs ?? DEFAULT_TICKER_INTERVAL_MS}
				prayerTimes={prayerTimes}
			/>
		</div>
	);
}
