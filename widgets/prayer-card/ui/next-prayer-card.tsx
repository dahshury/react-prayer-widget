"use client";

import type { CSSProperties } from "react";
import { formatMinutesHHmm, formatTimeDisplay } from "@/shared/lib/time";
import {
	WidgetPrayerCard,
	type WidgetPrayerCardSize,
} from "@/widgets/prayer-card";

/** Represents the next upcoming prayer */
export type NextPrayer = {
	name: string;
	time: string;
	progress: number;
	timeUntil: number;
};

/** Props for the NextPrayerCard component */
export type NextPrayerCardProps = {
	nextPrayer: NextPrayer;
	timeFormat24h?: boolean;
	language?: "en" | "ar";
	className?: string;
	size?: WidgetPrayerCardSize;
	nextSize?: WidgetPrayerCardSize;
	gradientClass?: string;
	showIcon?: boolean;
	classes?: {
		container?: string;
		icon?: string;
		name?: string;
		time?: string;
		countdown?: string;
		overlay?: string;
		progressFill?: string;
	};
	/** Optional max width for the rendered card container */
	maxWidth?: "md" | "lg" | "xl" | "2xl" | "3xl" | number | string;
};

export function NextPrayerCard({
	nextPrayer,
	timeFormat24h = true,
	language = "en",
	className,
	size,
	nextSize,
	gradientClass,
	showIcon,
	classes,
	maxWidth,
}: NextPrayerCardProps) {
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
	const maxWidthStyle: CSSProperties | undefined = (() => {
		if (maxWidth === undefined) {
			return;
		}
		if (typeof maxWidth === "number") {
			return { maxWidth: `${maxWidth}px` };
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
		return { maxWidth: String(maxWidth) };
	})();
	return (
		<div className={`mx-auto ${maxWidthClass}`} style={maxWidthStyle}>
			<WidgetPrayerCard
				classes={classes}
				className={className}
				countdown={formatMinutesHHmm(nextPrayer.timeUntil)}
				gradientClass={gradientClass}
				isNext
				name={nextPrayer.name}
				nextSize={nextSize ?? size ?? "md"}
				progress={nextPrayer.progress}
				showIcon={showIcon}
				size={size}
				time={formatTimeDisplay(nextPrayer.time, timeFormat24h, language)}
			/>
		</div>
	);
}
