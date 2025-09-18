"use client";

import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export type WidgetPrayerCardSize = "xxs" | "xs" | "sm" | "md" | "lg";

export interface WidgetPrayerCardProps {
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
}

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

function sizeTokens(
	size: WidgetPrayerCardSize | undefined,
	variant: "next" | "horizontal" | "vertical",
) {
	const s = size || "md";
	if (variant === "next") {
		const paddings =
			s === "xxs"
				? "py-0 px-1.5"
				: s === "xs"
					? "py-0.5 px-2"
					: s === "sm"
						? "py-1 px-2.5"
						: s === "lg"
							? "py-1.5 px-4"
							: "py-1 px-3";
		const nameText =
			s === "xxs"
				? "text-[8px]"
				: s === "xs"
					? "text-[9px]"
					: s === "sm"
						? "text-[10px]"
						: s === "lg"
							? "text-xs"
							: "text-[10px]";
		const timeText =
			s === "xxs"
				? "text-[10px]"
				: s === "xs"
					? "text-[11px]"
					: s === "sm"
						? "text-xs"
						: s === "lg"
							? "text-lg"
							: "text-base";
		const countdownText =
			s === "xxs"
				? "text-[7px]"
				: s === "xs"
					? "text-[8px]"
					: s === "sm"
						? "text-[9px]"
						: s === "lg"
							? "text-[11px]"
							: "text-[9px]";
		return { paddings, nameText, timeText, countdownText };
	}
	if (variant === "horizontal") {
		const paddings =
			s === "xxs"
				? "py-0.5 px-1.5"
				: s === "xs"
					? "py-1 px-2"
					: s === "sm"
						? "py-1 px-2.5"
						: s === "lg"
							? "py-2 px-4"
							: "py-1.5 px-3";
		const nameText =
			s === "xxs"
				? "text-[9px]"
				: s === "xs"
					? "text-[10px]"
					: s === "sm"
						? "text-xs"
						: s === "lg"
							? "text-base"
							: "text-sm";
		const timeText =
			s === "xxs"
				? "text-[11px]"
				: s === "xs"
					? "text-xs"
					: s === "sm"
						? "text-sm"
						: s === "lg"
							? "text-lg"
							: "text-base";
		return { paddings, nameText, timeText, countdownText: "text-[10px]" };
	}
	// vertical
	const paddings =
		s === "xxs"
			? "py-0.5 px-1.5"
			: s === "xs"
				? "py-1 px-2"
				: s === "sm"
					? "py-1 px-2.5"
					: s === "lg"
						? "py-2 px-4"
						: "py-1.5 px-3";
	const nameText =
		s === "xxs"
			? "text-[8px]"
			: s === "xs"
				? "text-[9px]"
				: s === "sm"
					? "text-[10px]"
					: s === "lg"
						? "text-sm"
						: "text-xs";
	const timeText =
		s === "xxs"
			? "text-[10px]"
			: s === "xs"
				? "text-[11px]"
				: s === "sm"
					? "text-xs"
					: s === "lg"
						? "text-base"
						: "text-sm";
	return { paddings, nameText, timeText, countdownText: "text-[10px]" };
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
	const isFridayDetected = (() => {
		try {
			const opts: Intl.DateTimeFormatOptions & { timeZone?: string } = {
				weekday: "long",
			};
			if (tz) opts.timeZone = tz;
			const weekday = new Date().toLocaleDateString(
				"en-US",
				opts as Intl.DateTimeFormatOptions,
			);
			return weekday === "Friday";
		} catch {
			return false;
		}
	})();
	const isFriday =
		typeof fridayOverride === "boolean" ? fridayOverride : isFridayDetected;
	const translatedName = (() => {
		switch (name.toLowerCase()) {
			case "fajr":
				return t("prayers.fajr");
			case "sunrise":
				return t("prayers.sunrise");
			case "dhuhr":
				return isFriday ? t("prayers.jumuah") : t("prayers.dhuhr");
			case "asr":
				return t("prayers.asr");
			case "maghrib":
				return t("prayers.maghrib");
			case "isha":
				return t("prayers.isha");
			default:
				return name;
		}
	})();

	const resolvedGradient = gradientClass || defaultGradient(name);
	const shouldShowIcon =
		showIcon && (isNext || !(size === "xxs" || size === "xs"));
	const iconNode = shouldShowIcon
		? getIcon
			? getIcon(name)
			: defaultIcon(name)
		: null;

	if (isNext) {
		const tokens = sizeTokens(nextSize || size, "next");
		return (
			<Card
				className={cn(
					"relative overflow-hidden bg-gradient-to-r border-amber-500/30",
					tokens.paddings,
					resolvedGradient,
					className,
					classes?.container,
				)}
				style={style}
				onDrop={(e) => {
					if (!onDropFile) return;
					e.preventDefault();
					const f = e.dataTransfer?.files?.[0] as File | undefined;
					if (!f) return;
					onDropFile(f);
				}}
				onDragOver={(e) => {
					if (onDropFile) e.preventDefault();
				}}
			>
				<div
					className={cn(
						"absolute inset-0 pointer-events-none",
						classes?.overlay,
					)}
				>
					<div
						className={cn(
							"absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-30 transition-all duration-700",
							classes?.progressFill,
						)}
						style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
					/>
				</div>

				<div className="relative p-0.5 pr-12">
					<div className="flex items-center gap-1.5 min-w-0">
						{iconNode ? (
							<div className={cn("scale-75 shrink-0", classes?.icon)}>
								{iconNode}
							</div>
						) : null}
						<span
							className={cn(
								"leading-none font-medium whitespace-nowrap",
								tokens.nameText,
								classes?.name,
							)}
							style={{ color: "var(--prayer-name-color)" }}
						>
							{translatedName}
						</span>
					</div>
					<div className="absolute right-2 top-1/2 -translate-y-1/2 text-right pointer-events-none">
						<div
							className={cn(
								"font-semibold leading-none whitespace-nowrap",
								tokens.timeText,
								classes?.time,
							)}
							style={{ color: "var(--prayer-time-color)" }}
						>
							{countdown ? (
								<>
									<span className={cn("opacity-70 mr-1", tokens.nameText)}>
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

	if (horizontalView) {
		const tokens = sizeTokens(size, "horizontal");
		return (
			<div
				className={cn(
					"flex items-center justify-between rounded-lg bg-gradient-to-r border border-muted/30",
					tokens.paddings,
					resolvedGradient,
					isCurrent && "ring-2 ring-amber-400/50",
					className,
					classes?.container,
				)}
				style={style}
			>
				<div className="flex items-center gap-2">
					{iconNode}
					<span
						className={cn(
							"font-medium whitespace-nowrap",
							tokens.nameText,
							classes?.name,
						)}
						style={{ color: "var(--prayer-name-color)" }}
					>
						{translatedName}
					</span>
				</div>
				<div
					className={cn(
						"font-semibold whitespace-nowrap",
						tokens.timeText,
						classes?.time,
					)}
					style={{ color: "var(--prayer-time-color)" }}
				>
					{time}
				</div>
			</div>
		);
	}

	const tokens = sizeTokens(size, "vertical");
	return (
		<div
			className={cn(
				"flex flex-col items-center rounded-lg bg-gradient-to-b border border-muted/30",
				tokens.paddings,
				resolvedGradient,
				isCurrent && "ring-2 ring-amber-400/50",
				className,
				classes?.container,
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
					classes?.name,
				)}
				style={{ color: "var(--prayer-name-color)" }}
			>
				{translatedName}
			</div>
			<div
				className={cn(
					"font-semibold whitespace-nowrap",
					tokens.timeText,
					classes?.time,
				)}
				style={{ color: "var(--prayer-time-color)" }}
			>
				{time}
			</div>
		</div>
	);
}

const MemoWidgetPrayerCard = React.memo(InnerWidgetPrayerCard);

export function WidgetPrayerCard(props: WidgetPrayerCardProps) {
	return <MemoWidgetPrayerCard {...props} />;
}
