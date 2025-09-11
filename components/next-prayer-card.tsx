"use client";

import {
	WidgetPrayerCard,
	type WidgetPrayerCardSize,
} from "@/components/widget-prayer-card";
import { formatMinutesHHmm, formatTimeDisplay } from "@/lib/utils";

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
}: NextPrayerCardProps) {
	return (
		<WidgetPrayerCard
			name={nextPrayer.name}
			time={formatTimeDisplay(nextPrayer.time, timeFormat24h, language)}
			isNext
			progress={nextPrayer.progress}
			countdown={formatMinutesHHmm(nextPrayer.timeUntil)}
			className={className}
			size={size}
			nextSize={nextSize}
			gradientClass={gradientClass}
			showIcon={showIcon}
			classes={classes}
		/>
	);
}
