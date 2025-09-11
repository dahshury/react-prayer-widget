"use client";

import {
	WidgetPrayerCard,
	type WidgetPrayerCardSize,
} from "@/components/widget-prayer-card";
import type { PrayerTimes } from "@/lib/prayer-api";
import { formatTimeDisplay } from "@/lib/utils";

/** Props for the PrayerGrid component */
export type PrayerGridProps = {
	prayerTimes: PrayerTimes;
	currentOrNextName?: string;
	dimPreviousPrayers?: boolean;
	horizontalView?: boolean;
	timeFormat24h?: boolean;
	language?: "en" | "ar";
	className?: string;
	size?: WidgetPrayerCardSize;
	gradientClass?: string;
	showIcon?: boolean;
	classes?: {
		container?: string;
		icon?: string;
		name?: string;
		time?: string;
	};
};

function isPast(hhmm: string): boolean {
	const [h, m] = hhmm.split(":").map(Number);
	const now = new Date();
	const cm = now.getHours() * 60 + now.getMinutes();
	return h * 60 + m < cm;
}

export function PrayerGrid({
	prayerTimes,
	currentOrNextName,
	dimPreviousPrayers = true,
	horizontalView = false,
	timeFormat24h = true,
	language = "en",
	className,
	size,
	gradientClass,
	showIcon,
	classes,
}: PrayerGridProps) {
	const containerClass = horizontalView
		? "space-y-2"
		: "grid grid-cols-5 gap-2";
	return (
		<div className={`${containerClass} ${className ?? ""}`}>
			<WidgetPrayerCard
				name="Fajr"
				time={formatTimeDisplay(prayerTimes.fajr, timeFormat24h, language)}
				isCurrent={currentOrNextName === "Fajr"}
				horizontalView={horizontalView}
				className={
					dimPreviousPrayers && isPast(prayerTimes.fajr)
						? "opacity-40"
						: undefined
				}
				size={size}
				gradientClass={gradientClass}
				showIcon={showIcon}
				classes={classes}
			/>
			<WidgetPrayerCard
				name="Dhuhr"
				time={formatTimeDisplay(prayerTimes.dhuhr, timeFormat24h, language)}
				isCurrent={currentOrNextName === "Dhuhr"}
				horizontalView={horizontalView}
				className={
					dimPreviousPrayers && isPast(prayerTimes.dhuhr)
						? "opacity-40"
						: undefined
				}
				size={size}
				gradientClass={gradientClass}
				showIcon={showIcon}
				classes={classes}
			/>
			<WidgetPrayerCard
				name="Asr"
				time={formatTimeDisplay(prayerTimes.asr, timeFormat24h, language)}
				isCurrent={currentOrNextName === "Asr"}
				horizontalView={horizontalView}
				className={
					dimPreviousPrayers && isPast(prayerTimes.asr)
						? "opacity-40"
						: undefined
				}
				size={size}
				gradientClass={gradientClass}
				showIcon={showIcon}
				classes={classes}
			/>
			<WidgetPrayerCard
				name="Maghrib"
				time={formatTimeDisplay(prayerTimes.maghrib, timeFormat24h, language)}
				isCurrent={currentOrNextName === "Maghrib"}
				horizontalView={horizontalView}
				className={
					dimPreviousPrayers && isPast(prayerTimes.maghrib)
						? "opacity-40"
						: undefined
				}
				size={size}
				gradientClass={gradientClass}
				showIcon={showIcon}
				classes={classes}
			/>
			<WidgetPrayerCard
				name="Isha"
				time={formatTimeDisplay(prayerTimes.isha, timeFormat24h, language)}
				isCurrent={currentOrNextName === "Isha"}
				horizontalView={horizontalView}
				className={
					dimPreviousPrayers && isPast(prayerTimes.isha)
						? "opacity-40"
						: undefined
				}
				size={size}
				gradientClass={gradientClass}
				showIcon={showIcon}
				classes={classes}
			/>
		</div>
	);
}
