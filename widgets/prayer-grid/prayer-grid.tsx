"use client";

import type { PrayerTimes } from "@/entities/prayer";
import { formatTimeDisplay } from "@/shared/libs/time/format";
import {
	WidgetPrayerCard,
	type WidgetPrayerCardSize,
} from "@/widgets/prayer-card";

/** Props for the PrayerGrid component */
export type PrayerGridProps = {
	prayerTimes: PrayerTimes;
	currentOrNextName?: string;
	dimPreviousPrayers?: boolean;
	horizontalView?: boolean;
	timeFormat24h?: boolean;
	language?: "en" | "ar";
	/** IANA timezone for weekday handling (Friday/Jumuʿah) */
	timezone?: string;
	/** Explicit Friday flag from parent */
	isFriday?: boolean;
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
	/** Optional max width for the rendered grid container */
	maxWidth?: "md" | "lg" | "xl" | "2xl" | "3xl" | number | string;
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
	timezone,
	isFriday,
	className,
	size,
	gradientClass,
	showIcon,
	classes,
	maxWidth,
}: PrayerGridProps) {
	const containerClass = horizontalView
		? "space-y-2"
		: "grid grid-cols-5 gap-2";
	const maxWidthClass = (() => {
		if (maxWidth === undefined) {
			return "";
		}
		if (typeof maxWidth === "number") {
			return "";
		}
		if (
			maxWidth === "md" ||
			maxWidth === "lg" ||
			maxWidth === "xl" ||
			maxWidth === "2xl" ||
			maxWidth === "3xl"
		) {
			const map: Record<string, string> = {
				md: "max-w-md",
				lg: "max-w-lg",
				xl: "max-w-xl",
				"2xl": "max-w-2xl",
				"3xl": "max-w-3xl",
			};
			return map[maxWidth];
		}
		return "";
	})();
	const maxWidthStyle = (() => {
		if (maxWidth === undefined) {
			return;
		}
		if (typeof maxWidth === "number") {
			return { maxWidth: `${maxWidth}px` } as React.CSSProperties;
		}
		if (
			maxWidth === "md" ||
			maxWidth === "lg" ||
			maxWidth === "xl" ||
			maxWidth === "2xl" ||
			maxWidth === "3xl"
		) {
			return;
		}
		return { maxWidth: String(maxWidth) } as React.CSSProperties;
	})();
	return (
		<div className={`mx-auto ${maxWidthClass}`} style={maxWidthStyle}>
			<div className={`${containerClass} ${className ?? ""}`}>
				<WidgetPrayerCard
					classes={classes}
					className={
						dimPreviousPrayers && isPast(prayerTimes.fajr)
							? "opacity-40"
							: undefined
					}
					gradientClass={gradientClass}
					horizontalView={horizontalView}
					isCurrent={currentOrNextName === "Fajr"}
					isFriday={isFriday}
					name="Fajr"
					showIcon={showIcon}
					size={size}
					time={formatTimeDisplay(prayerTimes.fajr, timeFormat24h, language)}
					timezone={timezone}
				/>
				<WidgetPrayerCard
					classes={classes}
					className={
						dimPreviousPrayers && isPast(prayerTimes.dhuhr)
							? "opacity-40"
							: undefined
					}
					gradientClass={gradientClass}
					horizontalView={horizontalView}
					isCurrent={currentOrNextName === "Dhuhr"}
					isFriday={isFriday}
					name="Dhuhr"
					showIcon={showIcon}
					size={size}
					time={formatTimeDisplay(prayerTimes.dhuhr, timeFormat24h, language)}
					timezone={timezone}
				/>
				<WidgetPrayerCard
					classes={classes}
					className={
						dimPreviousPrayers && isPast(prayerTimes.asr)
							? "opacity-40"
							: undefined
					}
					gradientClass={gradientClass}
					horizontalView={horizontalView}
					isCurrent={currentOrNextName === "Asr"}
					isFriday={isFriday}
					name="Asr"
					showIcon={showIcon}
					size={size}
					time={formatTimeDisplay(prayerTimes.asr, timeFormat24h, language)}
					timezone={timezone}
				/>
				<WidgetPrayerCard
					classes={classes}
					className={
						dimPreviousPrayers && isPast(prayerTimes.maghrib)
							? "opacity-40"
							: undefined
					}
					gradientClass={gradientClass}
					horizontalView={horizontalView}
					isCurrent={currentOrNextName === "Maghrib"}
					name="Maghrib"
					showIcon={showIcon}
					size={size}
					time={formatTimeDisplay(prayerTimes.maghrib, timeFormat24h, language)}
				/>
				<WidgetPrayerCard
					classes={classes}
					className={
						dimPreviousPrayers && isPast(prayerTimes.isha)
							? "opacity-40"
							: undefined
					}
					gradientClass={gradientClass}
					horizontalView={horizontalView}
					isCurrent={currentOrNextName === "Isha"}
					name="Isha"
					showIcon={showIcon}
					size={size}
					time={formatTimeDisplay(prayerTimes.isha, timeFormat24h, language)}
				/>
			</div>
		</div>
	);
}
