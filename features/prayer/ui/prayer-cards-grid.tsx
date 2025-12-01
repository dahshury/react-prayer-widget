"use client";

import type { ExtendedPrayerSettings, PrayerTimes } from "@/entities/prayer";
import { storeCustomAzanFile } from "@/shared/libs/prayer/azan";
import { formatTimeDisplay } from "@/shared/libs/time/format";
import { WidgetPrayerCard } from "@/widgets/prayer-card";

type PrayerCardsGridProps = {
	/** Prayer times for all 5 prayers */
	prayerTimes: PrayerTimes;
	/** Application settings */
	settings: ExtendedPrayerSettings;
	/** Current next prayer name */
	nextPrayerName: string;
	/** Whether today is Friday */
	isFriday: boolean;
	/** Function to check if time has passed */
	isPastTime: (hhmm: string) => boolean;
	/** Settings update callback */
	onSettingsChange: (s: Partial<ExtendedPrayerSettings>) => void;
};

type PrayerCardProps = {
	prayerName: "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
	time: string;
	settings: ExtendedPrayerSettings;
	nextPrayerName: string;
	isFriday: boolean;
	isPastTime: (hhmm: string) => boolean;
	onDropFile: (file: File) => Promise<void>;
};

// Helper component to render a single prayer card
function PrayerCardItem({
	prayerName,
	time,
	settings,
	nextPrayerName,
	isFriday,
	isPastTime,
	onDropFile,
}: PrayerCardProps) {
	const getPastClass = (prayerTime: string): string | undefined =>
		settings.dimPreviousPrayers && isPastTime(prayerTime)
			? "opacity-40"
			: undefined;

	return (
		<WidgetPrayerCard
			className={getPastClass(time)}
			horizontalView={settings.horizontalView}
			isCurrent={nextPrayerName === prayerName}
			isFriday={isFriday}
			name={prayerName}
			onDropFile={onDropFile}
			size={settings.otherCardSize || "sm"}
			time={formatTimeDisplay(
				time,
				settings.timeFormat24h ?? true,
				settings.language || "en"
			)}
			timezone={settings.timezone}
		/>
	);
}

/**
 * Prayer cards grid component
 * Displays all 5 prayer times in either grid (5 columns) or horizontal layout
 * Supports drag-and-drop azan file upload
 */
export function PrayerCardsGrid({
	prayerTimes,
	settings,
	nextPrayerName,
	isFriday,
	isPastTime,
	onSettingsChange,
}: PrayerCardsGridProps) {
	// Helper to handle azan file upload for a specific prayer
	const handleAzanUpload = async (
		prayerName: "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha",
		file: File
	) => {
		await storeCustomAzanFile(prayerName, file);
		onSettingsChange({
			azanByPrayer: {
				...(settings.azanByPrayer || {}),
				[prayerName]: `custom:${prayerName}`,
			},
		});
	};

	const prayers = [
		{ name: "Fajr" as const, time: prayerTimes.fajr },
		{ name: "Dhuhr" as const, time: prayerTimes.dhuhr },
		{ name: "Asr" as const, time: prayerTimes.asr },
		{ name: "Maghrib" as const, time: prayerTimes.maghrib },
		{ name: "Isha" as const, time: prayerTimes.isha },
	];

	return (
		<div
			className={
				settings.horizontalView ? "space-y-2" : "grid grid-cols-5 gap-2"
			}
		>
			{prayers.map((prayer) => (
				<PrayerCardItem
					isFriday={isFriday}
					isPastTime={isPastTime}
					key={prayer.name}
					nextPrayerName={nextPrayerName}
					onDropFile={(file) => handleAzanUpload(prayer.name, file)}
					prayerName={prayer.name}
					settings={settings}
					time={prayer.time}
				/>
			))}
		</div>
	);
}
