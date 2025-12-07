"use client";

import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import React from "react";
import type { PrayerName } from "@/entities/prayer";
import { getCardBackgroundStyle } from "@/shared/lib/backgrounds";
import { useTranslation } from "@/shared/lib/hooks";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/ui/card";

export type WidgetPrayerCardSize = "xxs" | "xs" | "sm" | "md" | "lg";

export type WidgetPrayerCardProps = {
	name: PrayerName;
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
	getIcon?: (name: PrayerName) => React.ReactNode;
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
	/** Card background setting (default, image, or color gradient theme) */
	cardBackground?: string;
	/** Card background opacity 0..1 */
	cardBackgroundOpacity?: number;
	/** Callback when prayer name is clicked (for randomizing background) */
	onNameClick?: (() => void) | null;
};

const defaultIcon = (name: PrayerName) => {
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

const defaultGradient = (name: PrayerName) => {
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
	cardBackground,
	cardBackgroundOpacity,
	horizontalView,
	onNameClick,
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
	cardBackground?: string;
	cardBackgroundOpacity?: number;
	horizontalView?: boolean;
	onNameClick?: (() => void) | null;
}) {
	const backgroundInfo = cardBackground
		? getCardBackgroundStyle(
				cardBackground,
				horizontalView ?? false,
				cardBackgroundOpacity
			)
		: undefined;
	const useDefaultGradient = !cardBackground || cardBackground === "default";

	return (
		<Card
			className={cn(
				"relative isolate overflow-hidden rounded-xl border-2",
				"shadow-[0_15px_40px_rgba(17,24,39,0.25)] backdrop-blur-md",
				"transition-all duration-500 ease-out",
				"border-amber-400/60 dark:border-amber-300/60",
				"focus-visible:outline-none focus-visible:ring-2",
				"focus-visible:ring-amber-300/70 focus-visible:ring-offset-0",
				tokens.paddings,
				useDefaultGradient ? "bg-gradient-to-r" : null,
				useDefaultGradient ? resolvedGradient : null,
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
			{/* Background image layer with opacity - at the very bottom */}
			{backgroundInfo?.backgroundImage ? (
				<div
					className="pointer-events-none absolute inset-0"
					style={{
						backgroundImage: backgroundInfo.backgroundImage,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						opacity: backgroundInfo.opacity ?? 1,
						zIndex: -1,
					}}
				/>
			) : null}
			{/* Overlay effects - above background */}
			<div className="-inset-2 pointer-events-none absolute z-[1] rounded-[18px] bg-gradient-to-r from-amber-400/18 via-orange-400/14 to-yellow-400/18 opacity-70 blur-2xl" />
			<div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.2),transparent_42%)] opacity-75 mix-blend-screen" />
			<div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-white/6 via-transparent to-amber-500/12 opacity-70" />
			<div
				className={cn(
					"pointer-events-none absolute inset-0 z-[1]",
					classes?.overlay
				)}
			>
				<div
					className={cn(
						"absolute top-0 left-0 h-full bg-gradient-to-r",
						"from-amber-500/50 via-orange-500/45 to-yellow-400/50",
						"opacity-60 mix-blend-screen transition-all duration-700 ease-out",
						"backdrop-blur-[2px]",
						"shadow-[inset_0_0_25px_rgba(251,191,36,0.35)]",
						classes?.progressFill
					)}
					style={{
						width: `${Math.max(0, Math.min(MAX_PROGRESS_PERCENTAGE, progress))}%`,
					}}
				/>
				<div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/25 via-white/5 to-transparent opacity-60 blur-md" />
			</div>

			<div className="relative z-10 flex min-h-8 items-center justify-between gap-4">
				<div className="flex min-w-0 flex-1 items-center gap-1.5">
					{iconNode ? (
						<div
							className={cn(
								"shrink-0 scale-75 drop-shadow-[0_6px_18px_rgba(251,191,36,0.35)]",
								"transition-transform duration-300",
								classes?.icon
							)}
						>
							{iconNode}
						</div>
					) : null}
					{onNameClick ? (
						<button
							className={cn(
								"truncate font-semibold leading-none tracking-tight",
								"drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]",
								tokens.nameText,
								classes?.name,
								"cursor-pointer transition-opacity hover:opacity-80"
							)}
							onClick={onNameClick}
							style={{
								color: "var(--prayer-name-color)",
								fontFamily: "var(--prayer-name-font)",
							}}
							type="button"
						>
							{translatedName}
						</button>
					) : (
						<span
							className={cn(
								"truncate font-semibold leading-none tracking-tight",
								"drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]",
								tokens.nameText,
								classes?.name
							)}
							style={{
								color: "var(--prayer-name-color)",
								fontFamily: "var(--prayer-name-font)",
							}}
						>
							{translatedName}
						</span>
					)}
				</div>
				<div
					className={cn("shrink-0 text-right", classes?.time)}
					style={{
						color: "var(--prayer-time-color)",
						fontFamily: "var(--prayer-time-font)",
					}}
				>
					<div
						className={cn(
							"whitespace-nowrap rounded-lg border border-white/5",
							"bg-black/10 px-2 py-1 font-bold leading-none",
							"drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)] backdrop-blur-[1px]",
							tokens.timeText
						)}
						style={{ fontFamily: "var(--prayer-time-font)" }}
					>
						{countdown ? (
							<>
								<span
									className={cn(
										"mr-1.5 font-medium opacity-80",
										tokens.nameText
									)}
								>
									{t("general.remaining") !== "general.remaining"
										? t("general.remaining")
										: "Remaining"}
									:
								</span>
								<span className="rounded-md bg-white/5 px-1.5 py-0.5 tracking-wider shadow-amber-500/20 shadow-inner">
									{countdown}
								</span>
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
	cardBackground,
	cardBackgroundOpacity,
	onNameClick,
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
	cardBackground?: string;
	cardBackgroundOpacity?: number;
	onNameClick?: (() => void) | null;
}) {
	const backgroundInfo = cardBackground
		? getCardBackgroundStyle(cardBackground, true, cardBackgroundOpacity)
		: undefined;
	const useDefaultGradient = !cardBackground || cardBackground === "default";

	return (
		<div
			className={cn(
				"relative isolate flex items-center justify-between overflow-hidden rounded-lg",
				useDefaultGradient ? "bg-gradient-to-r" : null,
				tokens.paddings,
				useDefaultGradient ? resolvedGradient : null,
				isCurrent ? "ring-2 ring-amber-400/50" : null,
				className,
				classes?.container
			)}
			style={style}
		>
			{/* Background image layer with opacity - at the very bottom */}
			{backgroundInfo?.backgroundImage ? (
				<div
					className="pointer-events-none absolute inset-0 rounded-lg"
					style={{
						backgroundImage: backgroundInfo.backgroundImage,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						opacity: backgroundInfo.opacity ?? 1,
						zIndex: -1,
					}}
				/>
			) : null}
			{/* Border layer - above background */}
			<div className="pointer-events-none absolute inset-0 z-[2] rounded-lg border border-muted/30" />
			{/* Content - above background */}
			<div className="relative z-10 flex items-center gap-2">
				{iconNode}
				{onNameClick ? (
					<button
						className={cn(
							"whitespace-nowrap font-medium",
							tokens.nameText,
							classes?.name,
							"cursor-pointer transition-opacity hover:opacity-80"
						)}
						onClick={onNameClick}
						style={{
							color: "var(--prayer-name-color)",
							fontFamily: "var(--prayer-name-font)",
						}}
						type="button"
					>
						{translatedName}
					</button>
				) : (
					<span
						className={cn(
							"whitespace-nowrap font-medium",
							tokens.nameText,
							classes?.name
						)}
						style={{
							color: "var(--prayer-name-color)",
							fontFamily: "var(--prayer-name-font)",
						}}
					>
						{translatedName}
					</span>
				)}
			</div>
			<div
				className={cn(
					"whitespace-nowrap font-semibold",
					tokens.timeText,
					classes?.time
				)}
				style={{
					color: "var(--prayer-time-color)",
					fontFamily: "var(--prayer-time-font)",
				}}
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
	cardBackground,
	cardBackgroundOpacity,
	onNameClick,
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
	cardBackground?: string;
	cardBackgroundOpacity?: number;
	onNameClick?: (() => void) | null;
}) {
	const backgroundInfo = cardBackground
		? getCardBackgroundStyle(cardBackground, false, cardBackgroundOpacity)
		: undefined;
	const useDefaultGradient = !cardBackground || cardBackground === "default";

	return (
		<div
			className={cn(
				"relative isolate flex flex-col items-center overflow-hidden rounded-xl",
				"shadow-[0_10px_28px_rgba(17,24,39,0.18)] backdrop-blur-sm",
				tokens.paddings,
				useDefaultGradient ? "bg-gradient-to-b" : null,
				useDefaultGradient ? resolvedGradient : null,
				isCurrent ? "ring-2 ring-amber-400/50" : null,
				className,
				classes?.container
			)}
			style={style}
		>
			{/* Background image layer with opacity - at the very bottom */}
			{backgroundInfo?.backgroundImage ? (
				<div
					className="pointer-events-none absolute inset-0 rounded-xl"
					style={{
						backgroundImage: backgroundInfo.backgroundImage,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
						opacity: backgroundInfo.opacity ?? 1,
						zIndex: -1,
					}}
				/>
			) : null}
			{/* Border layer - above background */}
			<div className="pointer-events-none absolute inset-0 z-[2] rounded-xl border-2 border-white/10 dark:border-white/15" />
			{/* Overlay effects - above background, clipped to card bounds */}
			<div className="pointer-events-none absolute inset-0 z-[1] rounded-xl bg-gradient-to-b from-white/8 via-transparent to-amber-500/10 opacity-75" />
			<div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_42%),radial-gradient(circle_at_72%_78%,rgba(251,191,36,0.16),transparent_48%)] opacity-85 mix-blend-screen" />
			<div className="pointer-events-none absolute inset-x-4 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent opacity-80" />
			<div className="pointer-events-none absolute inset-x-4 bottom-0 z-[1] h-px bg-gradient-to-r from-transparent via-orange-200/60 to-transparent opacity-70" />

			{/* Content - above border and overlays */}
			<div className="relative z-10 flex flex-col items-center">
				{iconNode ? (
					<div
						className={cn(
							"mb-1 drop-shadow-[0_6px_16px_rgba(251,191,36,0.28)]",
							classes?.icon
						)}
					>
						{iconNode}
					</div>
				) : null}
				{onNameClick ? (
					<button
						className={cn(
							"mb-0.5 whitespace-nowrap",
							tokens.nameText,
							classes?.name,
							"cursor-pointer transition-opacity hover:opacity-80"
						)}
						onClick={onNameClick}
						style={{
							color: "var(--prayer-name-color)",
							fontFamily: "var(--prayer-name-font)",
						}}
						type="button"
					>
						{translatedName}
					</button>
				) : (
					<div
						className={cn(
							"mb-0.5 whitespace-nowrap",
							tokens.nameText,
							classes?.name
						)}
						style={{
							color: "var(--prayer-name-color)",
							fontFamily: "var(--prayer-name-font)",
						}}
					>
						{translatedName}
					</div>
				)}
				<div
					className={cn(
						"whitespace-nowrap rounded-lg border border-white/5",
						"bg-black/10 px-2 py-1 font-semibold",
						"drop-shadow-[0_3px_10px_rgba(0,0,0,0.28)] backdrop-blur-[1px]",
						tokens.timeText,
						classes?.time
					)}
					style={{
						color: "var(--prayer-time-color)",
						fontFamily: "var(--prayer-time-font)",
					}}
				>
					{time}
				</div>
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
	name: PrayerName,
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
	prayerName: PrayerName,
	getIcon?: (name: PrayerName) => React.ReactNode
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
	cardBackground,
	cardBackgroundOpacity,
	onNameClick,
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
				cardBackground={cardBackground}
				cardBackgroundOpacity={cardBackgroundOpacity}
				classes={classes}
				className={className}
				countdown={countdown}
				horizontalView={horizontalView}
				iconNode={iconNode}
				onDropFile={onDropFile}
				onNameClick={onNameClick}
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
				cardBackground={cardBackground}
				cardBackgroundOpacity={cardBackgroundOpacity}
				classes={classes}
				className={className}
				iconNode={iconNode}
				isCurrent={isCurrent ?? false}
				onNameClick={onNameClick}
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
			cardBackground={cardBackground}
			cardBackgroundOpacity={cardBackgroundOpacity}
			classes={classes}
			className={className}
			iconNode={iconNode}
			isCurrent={isCurrent ?? false}
			onNameClick={onNameClick}
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
