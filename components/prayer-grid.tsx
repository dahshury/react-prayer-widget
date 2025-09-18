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
		if (maxWidth === undefined) return "";
		if (typeof maxWidth === "number") return "";
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
		if (maxWidth === undefined) return undefined;
		if (typeof maxWidth === "number")
			return { maxWidth: `${maxWidth}px` } as React.CSSProperties;
		if (
			maxWidth === "md" ||
			maxWidth === "lg" ||
			maxWidth === "xl" ||
			maxWidth === "2xl" ||
			maxWidth === "3xl"
		)
			return undefined;
		return { maxWidth: String(maxWidth) } as React.CSSProperties;
	})();
	return (
		<div className={`mx-auto ${maxWidthClass}`} style={maxWidthStyle}>
			<div className={`${containerClass} ${className ?? ""}`}>
				<WidgetPrayerCard
					name="Fajr"
					time={formatTimeDisplay(prayerTimes.fajr, timeFormat24h, language)}
					isCurrent={currentOrNextName === "Fajr"}
					horizontalView={horizontalView}
					timezone={timezone}
					isFriday={isFriday}
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
					timezone={timezone}
					isFriday={isFriday}
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
					timezone={timezone}
					isFriday={isFriday}
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
		</div>
	);
}
