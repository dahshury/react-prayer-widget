"use client";

import type { ExtendedPrayerSettings, PrayerTimes } from "@/entities/prayer";
import { DEFAULT_TICKER_INTERVAL_MS } from "@/features/prayer/config";
import {
	formatMinutesHHmm,
	formatTimeDisplay,
} from "@/shared/libs/time/format";
import { WidgetPrayerCard } from "@/widgets/prayer-card";
import { MinimalTicker } from "@/widgets/ticker/minimal-ticker";

type NextPrayerSectionProps = {
	/** Current prayer information */
	nextPrayer: {
		name: string;
		time: string;
		timeUntil: number;
		progress: number;
	};
	/** All prayer times for the day */
	prayerTimes: PrayerTimes;
	/** Application settings */
	settings: ExtendedPrayerSettings;
	/** Whether today is Friday */
	isFriday: boolean;
	/** Whether screen is small */
	isSmallScreen: boolean;
	/** Whether other prayers are visible (controls ticker placement) */
	otherPrayersVisible: boolean;
};

/**
 * Next prayer section component
 * Shows the current/next prayer card with countdown and progress bar
 * Includes inline ticker when other prayer cards are hidden
 */
export function NextPrayerSection({
	nextPrayer,
	prayerTimes,
	settings,
	isFriday,
	isSmallScreen,
	otherPrayersVisible,
}: NextPrayerSectionProps) {
	return (
		<div className="space-y-4">
			{isSmallScreen ? (
				<div className="mx-auto max-w-[360px]">
					<WidgetPrayerCard
						className="mb-2"
						countdown={formatMinutesHHmm(nextPrayer.timeUntil)}
						isFriday={isFriday}
						isNext={true}
						name={nextPrayer.name}
						nextSize="xxs"
						progress={nextPrayer.progress}
						time={formatTimeDisplay(
							nextPrayer.time,
							settings.timeFormat24h ?? true,
							settings.language || "en"
						)}
						timezone={settings.timezone}
					/>
				</div>
			) : (
				<WidgetPrayerCard
					className="mb-2"
					countdown={formatMinutesHHmm(nextPrayer.timeUntil)}
					isFriday={isFriday}
					isNext={true}
					name={nextPrayer.name}
					nextSize={settings.nextCardSize || "md"}
					progress={nextPrayer.progress}
					time={formatTimeDisplay(
						nextPrayer.time,
						settings.timeFormat24h ?? true,
						settings.language || "en"
					)}
					timezone={settings.timezone}
				/>
			)}

			{/* Inline ticker directly below the central card when other prayers are hidden */}
			{!!settings.showTicker && !otherPrayersVisible && (
				<MinimalTicker
					className={isSmallScreen ? "mx-auto max-w-[360px]" : null}
					intervalMs={settings.tickerIntervalMs ?? DEFAULT_TICKER_INTERVAL_MS}
					prayerTimes={prayerTimes}
				/>
			)}
		</div>
	);
}
