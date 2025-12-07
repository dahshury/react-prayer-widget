"use client";

import type {
	ExtendedPrayerSettings,
	PrayerName,
	PrayerTimes,
} from "@/entities/prayer";
import { DEFAULT_TICKER_INTERVAL_MS } from "@/features/prayer/config";
import { getRandomBackground } from "@/shared/lib/backgrounds";
import { formatMinutesHHmm, formatTimeDisplay } from "@/shared/lib/time";
import { MinimalTicker } from "./minimal-ticker";
import { WidgetPrayerCard } from "./prayer-card";

type NextPrayerSectionProps = {
	/** Current prayer information */
	nextPrayer: {
		name: PrayerName;
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
	/** Settings update callback */
	onSettingsChange: (s: Partial<ExtendedPrayerSettings>) => void;
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
	onSettingsChange,
}: NextPrayerSectionProps) {
	return (
		<div className="space-y-4">
			{isSmallScreen ? (
				<div className="mx-auto max-w-[360px]">
					<WidgetPrayerCard
						cardBackground={settings.cardBackground}
						cardBackgroundOpacity={settings.cardBackgroundOpacity}
						className="mb-2"
						countdown={formatMinutesHHmm(nextPrayer.timeUntil)}
						horizontalView={settings.horizontalView}
						isFriday={isFriday}
						isNext={true}
						name={nextPrayer.name}
						nextSize="xxs"
						onNameClick={() => {
							onSettingsChange({ cardBackground: getRandomBackground() });
						}}
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
					cardBackground={settings.cardBackground}
					cardBackgroundOpacity={settings.cardBackgroundOpacity}
					className="mb-2"
					countdown={formatMinutesHHmm(nextPrayer.timeUntil)}
					horizontalView={settings.horizontalView}
					isFriday={isFriday}
					isNext={true}
					name={nextPrayer.name}
					nextSize={settings.nextCardSize || "md"}
					onNameClick={() => {
						onSettingsChange({ cardBackground: getRandomBackground() });
					}}
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
					className={isSmallScreen ? "mx-auto max-w-[360px]" : ""}
					intervalMs={settings.tickerIntervalMs ?? DEFAULT_TICKER_INTERVAL_MS}
					prayerTimes={prayerTimes}
				/>
			)}
		</div>
	);
}
