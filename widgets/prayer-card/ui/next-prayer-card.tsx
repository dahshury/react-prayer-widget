"use client";

import type { CSSProperties } from "react";
import type { PrayerName } from "@/entities/prayer";
import { useWidgetSettings } from "@/features/settings/ui";
import { getRandomBackground } from "@/shared/lib/backgrounds";
import { formatMinutesHHmm, formatTimeDisplay } from "@/shared/lib/time";
import {
	WidgetPrayerCard,
	type WidgetPrayerCardSize,
} from "@/widgets/prayer-card";

/** Represents the next upcoming prayer */
export type NextPrayer = {
	name: PrayerName;
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
	maxWidth?: MaxWidth;
	/** Card background setting (default, image, or color gradient theme) */
	cardBackground?: string;
	/** Card background opacity (0-1) */
	cardBackgroundOpacity?: number;
	/** Whether to use horizontal layout (affects background image selection) */
	horizontalView?: boolean;
};

type MaxWidthToken = "md" | "lg" | "xl" | "2xl" | "3xl";
type MaxWidthKeyword = "fit-content" | "max-content" | "min-content" | "auto";
type MaxWidthCustom =
	| `${number}${"px" | "rem" | "em" | "%" | "vw" | "vh" | "ch"}`
	| `calc(${string})`
	| `clamp(${string})`
	| `min(${string})`
	| `max(${string})`
	| `var(${string})`;
type MaxWidth = MaxWidthToken | MaxWidthKeyword | MaxWidthCustom | number;

const MAX_WIDTH_CLASSES: Record<MaxWidthToken, string> = {
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	"3xl": "max-w-3xl",
};

const MAX_WIDTH_TOKENS = Object.keys(MAX_WIDTH_CLASSES) as MaxWidthToken[];

const isPresetMaxWidth = (value: MaxWidth): value is MaxWidthToken =>
	typeof value === "string" &&
	(MAX_WIDTH_TOKENS as readonly string[]).includes(value);

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
	cardBackground,
	cardBackgroundOpacity,
	horizontalView,
}: NextPrayerCardProps) {
	const settingsContext = useWidgetSettings();
	// Use prop if provided, otherwise fall back to settings context
	const opacity =
		cardBackgroundOpacity !== undefined
			? cardBackgroundOpacity
			: settingsContext?.settings?.cardBackgroundOpacity;
	const maxWidthClass = (() => {
		if (maxWidth === undefined) {
			return "";
		}
		if (typeof maxWidth === "number") {
			return "";
		}
		if (isPresetMaxWidth(maxWidth)) {
			return MAX_WIDTH_CLASSES[maxWidth];
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
		if (isPresetMaxWidth(maxWidth)) {
			return;
		}
		return { maxWidth };
	})();
	return (
		<div className={`mx-auto ${maxWidthClass}`} style={maxWidthStyle}>
			<WidgetPrayerCard
				cardBackground={cardBackground}
				cardBackgroundOpacity={opacity}
				classes={classes}
				className={className}
				countdown={formatMinutesHHmm(nextPrayer.timeUntil)}
				gradientClass={gradientClass}
				horizontalView={horizontalView}
				isNext
				name={nextPrayer.name}
				nextSize={nextSize ?? size ?? "md"}
				onNameClick={
					settingsContext?.onSettingsChange
						? () => {
								settingsContext.onSettingsChange({
									cardBackground: getRandomBackground(),
								});
							}
						: null
				}
				progress={nextPrayer.progress}
				showIcon={showIcon}
				size={size}
				time={formatTimeDisplay(nextPrayer.time, timeFormat24h, language)}
			/>
		</div>
	);
}
