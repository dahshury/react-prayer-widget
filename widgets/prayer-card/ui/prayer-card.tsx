"use client";

import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import React from "react";
import { useTranslation } from "@/shared/lib/hooks";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/ui/card";

export type WidgetPrayerCardSize = "xxs" | "xs" | "sm" | "md" | "lg";

export type WidgetPrayerCardProps = {
	name: string;
	time: string;
	/** IANA timezone to determine local weekday (for Friday/Jumuʿah handling) */
	timezone?: string;
	/** Optional explicit Friday override from parent */
	isFriday?: boolean;
	isNext?: boolean;
	isCurrent?: boolean;
	progress?: number;
	className?: string;
	countdown?: string;
	horizontalView?: boolean;
	/** Base size token applied to paddings and text sizes */
	size?: WidgetPrayerCardSize;
	/** Optional size override specifically for the next (central) card */
	nextSize?: WidgetPrayerCardSize;
	/** Override the gradient/background classes */
	gradientClass?: string;
	/** Hide the icon if false */
	showIcon?: boolean;
	/** Provide custom icon per prayer */
	getIcon?: (name: string) => React.ReactNode;
	/** Class overrides for fine-grained styling */
	classes?: {
		container?: string;
		icon?: string;
		name?: string;
		time?: string;
		countdown?: string;
		overlay?: string;
		progressFill?: string;
	};
	/** Inline style on the container */
	style?: React.CSSProperties;
	/** Optional drop handler for custom azan files */
	onDropFile?: (file: File) => void;
};

const defaultIcon = (name: string) => {
	switch (name.toLowerCase()) {
		case "fajr":
			return <Sunrise className="h-4 w-4 text-orange-300" />;
		case "sunrise":
			return <Sun className="h-4 w-4 text-yellow-400" />;
		case "dhuhr":
			return <Sun className="h-4 w-4 text-yellow-500" />;
		case "asr":
			return <Sun className="h-4 w-4 text-amber-500" />;
		case "maghrib":
			return <Sunset className="h-4 w-4 text-orange-500" />;
		case "isha":
			return <Moon className="h-4 w-4 text-blue-300" />;
		default:
			return <Sun className="h-4 w-4" />;
	}
};

const defaultGradient = (name: string) => {
	switch (name.toLowerCase()) {
		case "fajr":
			return "from-slate-800 via-orange-900/30 to-orange-800/20";
		case "sunrise":
			return "from-orange-400/20 via-yellow-400/20 to-amber-300/20";
		case "dhuhr":
			return "from-blue-400/20 via-cyan-300/20 to-sky-200/20";
		case "asr":
			return "from-amber-400/20 via-orange-400/20 to-yellow-500/20";
		case "maghrib":
			return "from-orange-500/20 via-red-400/20 to-pink-400/20";
		case "isha":
			return "from-indigo-800/30 via-purple-800/20 to-slate-800/20";
		default:
			return "from-amber-500/20 to-orange-500/20";
	}
};

type SizeTokens = {
	paddings: string;
	nameText: string;
	timeText: string;
	countdownText: string;
};

type SizeTokenMap = Record<
	WidgetPrayerCardSize | "md",
	Omit<SizeTokens, "countdownText">
> & {
	[K in WidgetPrayerCardSize | "md"]: {
		nameText: string;
		timeText: string;
		paddings: string;
		countdownText?: string;
	};
};

const NEXT_VARIANT_SIZES: SizeTokenMap = {
	xxs: {
		paddings: "py-0 px-1.5",
		nameText: "text-[8px]",
		timeText: "text-[10px]",
		countdownText: "text-[7px]",
	},
	xs: {
		paddings: "py-0.5 px-2",
		nameText: "text-[9px]",
		timeText: "text-[11px]",
		countdownText: "text-[8px]",
	},
	sm: {
		paddings: "py-1 px-2.5",
		nameText: "text-[10px]",
		timeText: "text-xs",
		countdownText: "text-[9px]",
	},
	md: {
		paddings: "py-1 px-3",
		nameText: "text-[10px]",
		timeText: "text-base",
		countdownText: "text-[9px]",
	},
	lg: {
		paddings: "py-1.5 px-4",
		nameText: "text-xs",
		timeText: "text-lg",
		countdownText: "text-[11px]",
	},
};

const HORIZONTAL_VARIANT_SIZES: SizeTokenMap = {
	xxs: {
		paddings: "py-0.5 px-1.5",
		nameText: "text-[9px]",
		timeText: "text-[11px]",
		countdownText: "text-[10px]",
	},
	xs: {
		paddings: "py-1 px-2",
		nameText: "text-[10px]",
		timeText: "text-xs",
		countdownText: "text-[10px]",
	},
	sm: {
		paddings: "py-1 px-2.5",
		nameText: "text-xs",
		timeText: "text-sm",
		countdownText: "text-[10px]",
	},
	md: {
		paddings: "py-1.5 px-3",
		nameText: "text-sm",
		timeText: "text-base",
		countdownText: "text-[10px]",
	},
	lg: {
		paddings: "py-2 px-4",
		nameText: "text-base",
		timeText: "text-lg",
		countdownText: "text-[10px]",
	},
};

const VERTICAL_VARIANT_SIZES: SizeTokenMap = {
	xxs: {
		paddings: "py-0.5 px-1.5",
		nameText: "text-[8px]",
		timeText: "text-[10px]",
		countdownText: "text-[10px]",
	},
	xs: {
		paddings: "py-1 px-2",
		nameText: "text-[9px]",
		timeText: "text-[11px]",
		countdownText: "text-[10px]",
	},
	sm: {
		paddings: "py-1 px-2.5",
		nameText: "text-[10px]",
		timeText: "text-xs",
		countdownText: "text-[10px]",
	},
	md: {
		paddings: "py-1.5 px-3",
		nameText: "text-xs",
		timeText: "text-sm",
		countdownText: "text-[10px]",
	},
	lg: {
		paddings: "py-2 px-4",
		nameText: "text-sm",
		timeText: "text-base",
		countdownText: "text-[10px]",
	},
};

function sizeTokens(
	size: WidgetPrayerCardSize | undefined,
	variant: "next" | "horizontal" | "vertical"
): SizeTokens {
	const s = (size || "md") as WidgetPrayerCardSize;

	let sizeMap: SizeTokenMap;
	if (variant === "next") {
		sizeMap = NEXT_VARIANT_SIZES;
	} else if (variant === "horizontal") {
		sizeMap = HORIZONTAL_VARIANT_SIZES;
	} else {
		sizeMap = VERTICAL_VARIANT_SIZES;
	}

	const config = sizeMap[s];
	return {
		paddings: config.paddings,
		nameText: config.nameText,
		timeText: config.timeText,
		countdownText: config.countdownText || "text-[10px]",
	};
}

// Helper component: Next card variant
function NextCardVariant({
	time,
	countdown,
	iconNode,
	tokens,
	resolvedGradient,
	className,
	classes,
	style,
	onDropFile,
	progress,
	t,
	translatedName,
}: {
	time: string;
	countdown?: string;
	iconNode: React.ReactNode;
	tokens: SizeTokens;
	resolvedGradient: string;
	className?: string;
	classes?: WidgetPrayerCardProps["classes"];
	style?: React.CSSProperties;
	onDropFile?: (file: File) => void;
	progress: number;
	t: (key: string) => string | null;
	translatedName: string;
}) {
	return (
		<Card
			className={cn(
				"relative overflow-hidden border-amber-500/30 bg-gradient-to-r",
				tokens.paddings,
				resolvedGradient,
				className,
				classes?.container
			)}
			onDragOver={(e) => {
				if (onDropFile) {
					e.preventDefault();
				}
			}}
			onDrop={(e) => {
				if (!onDropFile) {
					return;
				}
				e.preventDefault();
				const f = e.dataTransfer?.files?.[0] as File | undefined;
				if (!f) {
					return;
				}
				onDropFile(f);
			}}
			style={style}
		>
			<div
				className={cn("pointer-events-none absolute inset-0", classes?.overlay)}
			>
				<div
					className={cn(
						"absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-30 transition-all duration-700",
						classes?.progressFill
					)}
					style={{
						width: `${Math.max(0, Math.min(MAX_PROGRESS_PERCENTAGE, progress))}%`,
					}}
				/>
			</div>

			<div className="relative p-0.5 pr-12">
				<div className="flex min-w-0 items-center gap-1.5">
					{iconNode ? (
						<div className={cn("shrink-0 scale-75", classes?.icon)}>
							{iconNode}
						</div>
					) : null}
					<span
						className={cn(
							"whitespace-nowrap font-medium leading-none",
							tokens.nameText,
							classes?.name
						)}
						style={{ color: "var(--prayer-name-color)" }}
					>
						{translatedName}
					</span>
				</div>
				<div className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 text-right">
					<div
						className={cn(
							"whitespace-nowrap font-semibold leading-none",
							tokens.timeText,
							classes?.time
						)}
						style={{ color: "var(--prayer-time-color)" }}
					>
						{countdown ? (
							<>
								<span className={cn("mr-1 opacity-70", tokens.nameText)}>
									{t("general.remaining") !== "general.remaining"
										? t("general.remaining")
										: "Remaining"}
									:
								</span>
								{countdown}
							</>
						) : (
							time
						)}
					</div>
				</div>
			</div>
		</Card>
	);
}

// Helper component: Horizontal card variant
function HorizontalCardVariant({
	translatedName,
	time,
	iconNode,
	tokens,
	resolvedGradient,
	isCurrent,
	className,
	classes,
	style,
}: {
	translatedName: string;
	time: string;
	iconNode: React.ReactNode;
	tokens: SizeTokens;
	resolvedGradient: string;
	isCurrent: boolean;
	className?: string;
	classes?: WidgetPrayerCardProps["classes"];
	style?: React.CSSProperties;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-lg border border-muted/30 bg-gradient-to-r",
				tokens.paddings,
				resolvedGradient,
				!!isCurrent && "ring-2 ring-amber-400/50",
				className,
				classes?.container
			)}
			style={style}
		>
			<div className="flex items-center gap-2">
				{iconNode}
				<span
					className={cn(
						"whitespace-nowrap font-medium",
						tokens.nameText,
						classes?.name
					)}
					style={{ color: "var(--prayer-name-color)" }}
				>
					{translatedName}
				</span>
			</div>
			<div
				className={cn(
					"whitespace-nowrap font-semibold",
					tokens.timeText,
					classes?.time
				)}
				style={{ color: "var(--prayer-time-color)" }}
			>
				{time}
			</div>
		</div>
	);
}

// Helper component: Vertical card variant
function VerticalCardVariant({
	translatedName,
	time,
	iconNode,
	tokens,
	resolvedGradient,
	isCurrent,
	className,
	classes,
	style,
}: {
	translatedName: string;
	time: string;
	iconNode: React.ReactNode;
	tokens: SizeTokens;
	resolvedGradient: string;
	isCurrent: boolean;
	className?: string;
	classes?: WidgetPrayerCardProps["classes"];
	style?: React.CSSProperties;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center rounded-lg border border-muted/30 bg-gradient-to-b",
				tokens.paddings,
				resolvedGradient,
				!!isCurrent && "ring-2 ring-amber-400/50",
				className,
				classes?.container
			)}
			style={style}
		>
			{iconNode ? (
				<div className={cn("mb-1", classes?.icon)}>{iconNode}</div>
			) : null}
			<div
				className={cn(
					"mb-0.5 whitespace-nowrap",
					tokens.nameText,
					classes?.name
				)}
				style={{ color: "var(--prayer-name-color)" }}
			>
				{translatedName}
			</div>
			<div
				className={cn(
					"whitespace-nowrap font-semibold",
					tokens.timeText,
					classes?.time
				)}
				style={{ color: "var(--prayer-time-color)" }}
			>
				{time}
			</div>
		</div>
	);
}

const MemoWidgetPrayerCard = React.memo(InnerWidgetPrayerCard);

// Helper function: Detect if today is Friday in the given timezone
function detectFriday(timezone: string | undefined): boolean {
	try {
		const opts: Intl.DateTimeFormatOptions & { timeZone?: string } = {
			weekday: "long",
		};
		if (timezone) {
			opts.timeZone = timezone;
		}
		const weekday = new Date().toLocaleDateString(
			"en-US",
			opts as Intl.DateTimeFormatOptions
		);
		return weekday === "Friday";
	} catch {
		return false;
	}
}

// Helper function: Get translated prayer name
function getTranslatedPrayerName(
	name: string,
	isFriday: boolean,
	t: (key: string) => string | null
): string {
	switch (name.toLowerCase()) {
		case "fajr":
			return t("prayers.fajr") || name;
		case "sunrise":
			return t("prayers.sunrise") || name;
		case "dhuhr":
			return (isFriday ? t("prayers.jumuah") : t("prayers.dhuhr")) || name;
		case "asr":
			return t("prayers.asr") || name;
		case "maghrib":
			return t("prayers.maghrib") || name;
		case "isha":
			return t("prayers.isha") || name;
		default:
			return name;
	}
}

// Helper function: Get icon node based on visibility conditions
function getIconNode(
	shouldShowIcon: boolean,
	prayerName: string,
	getIcon?: (name: string) => React.ReactNode
): React.ReactNode {
	if (!shouldShowIcon) {
		return null;
	}
	return getIcon ? getIcon(prayerName) : defaultIcon(prayerName);
}

function InnerWidgetPrayerCard({
	name,
	time,
	timezone,
	isFriday: fridayOverride,
	isNext,
	isCurrent,
	progress = 0,
	className,
	countdown,
	horizontalView = false,
	size,
	nextSize,
	gradientClass,
	showIcon = true,
	getIcon,
	classes,
	style,
	onDropFile,
}: WidgetPrayerCardProps) {
	const { t } = useTranslation();
	const tz =
		timezone ||
		(typeof Intl !== "undefined"
			? Intl.DateTimeFormat().resolvedOptions().timeZone
			: undefined);
	const isFridayDetected = detectFriday(tz);
	const isFriday =
		typeof fridayOverride === "boolean" ? fridayOverride : isFridayDetected;
	const translatedName = getTranslatedPrayerName(name, isFriday, t);

	const resolvedGradient = gradientClass || defaultGradient(name);
	const shouldShowIcon =
		showIcon && (isNext || !(size === "xxs" || size === "xs"));
	const iconNode = getIconNode(shouldShowIcon, name, getIcon);

	if (isNext) {
		const tokens = sizeTokens(nextSize || size, "next");
		return (
			<NextCardVariant
				classes={classes}
				className={className}
				countdown={countdown}
				iconNode={iconNode}
				onDropFile={onDropFile}
				progress={progress}
				resolvedGradient={resolvedGradient}
				style={style}
				t={t}
				time={time}
				tokens={tokens}
				translatedName={translatedName}
			/>
		);
	}

	if (horizontalView) {
		const tokens = sizeTokens(size, "horizontal");
		return (
			<HorizontalCardVariant
				classes={classes}
				className={className}
				iconNode={iconNode}
				isCurrent={isCurrent ?? false}
				resolvedGradient={resolvedGradient}
				style={style}
				time={time}
				tokens={tokens}
				translatedName={translatedName}
			/>
		);
	}

	const tokens = sizeTokens(size, "vertical");
	return (
		<VerticalCardVariant
			classes={classes}
			className={className}
			iconNode={iconNode}
			isCurrent={isCurrent ?? false}
			resolvedGradient={resolvedGradient}
			style={style}
			time={time}
			tokens={tokens}
			translatedName={translatedName}
		/>
	);
}

export function WidgetPrayerCard(props: WidgetPrayerCardProps) {
	return <MemoWidgetPrayerCard {...props} />;
}

// Progress and animation constants
const MAX_PROGRESS_PERCENTAGE = 100; // Progress bar max value (0-100%)
