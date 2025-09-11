"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WidgetPrayerCardSize } from "@/components/widget-prayer-card";
import { cn } from "@/lib/utils";

interface WidgetPrayerCardSkeletonProps {
	variant: "next" | "grid";
	horizontalView?: boolean;
	className?: string;
	/** Match WidgetPrayerCard size tokens */
	size?: WidgetPrayerCardSize;
	/** Match WidgetPrayerCard nextSize tokens */
	nextSize?: WidgetPrayerCardSize;
}

function paddingTokens(
	size: WidgetPrayerCardSize | undefined,
	variant: "next" | "horizontal" | "vertical",
) {
	const s = size || "md";
	if (variant === "next") {
		return s === "xs"
			? "py-1 px-2"
			: s === "sm"
				? "py-1.5 px-2.5"
				: s === "lg"
					? "py-3 px-4"
					: "py-2 px-3";
	}
	if (variant === "horizontal") {
		return s === "xs"
			? "p-2"
			: s === "sm"
				? "p-2.5"
				: s === "lg"
					? "p-4"
					: "p-3";
	}
	// vertical
	return s === "xs" ? "p-2" : s === "sm" ? "p-2.5" : s === "lg" ? "p-4" : "p-3";
}

function textTokens(
	size: WidgetPrayerCardSize | undefined,
	variant: "next" | "horizontal" | "vertical",
) {
	const s = size || "md";
	if (variant === "next") {
		const nameText =
			s === "xs"
				? "text-[9px]"
				: s === "sm"
					? "text-[10px]"
					: s === "lg"
						? "text-xs"
						: "text-[10px]";
		const timeText =
			s === "xs"
				? "text-xs"
				: s === "sm"
					? "text-sm"
					: s === "lg"
						? "text-base"
						: "text-sm";
		const countdownText =
			s === "xs"
				? "text-[9px]"
				: s === "sm"
					? "text-[10px]"
					: s === "lg"
						? "text-xs"
						: "text-[10px]";
		return { nameText, timeText, countdownText };
	}
	if (variant === "horizontal") {
		const nameText =
			s === "xs"
				? "text-[10px]"
				: s === "sm"
					? "text-xs"
					: s === "lg"
						? "text-sm"
						: "text-xs";
		const timeText =
			s === "xs"
				? "text-xs"
				: s === "sm"
					? "text-sm"
					: s === "lg"
						? "text-base"
						: "text-sm";
		return { nameText, timeText, countdownText: "text-[10px]" };
	}
	// vertical
	const nameText =
		s === "xs"
			? "text-[9px]"
			: s === "sm"
				? "text-[10px]"
				: s === "lg"
					? "text-xs"
					: "text-[10px]";
	const timeText =
		s === "xs"
			? "text-[11px]"
			: s === "sm"
				? "text-xs"
				: s === "lg"
					? "text-sm"
					: "text-xs";
	return { nameText, timeText, countdownText: "text-[10px]" };
}

function minHeightStyle(
	variant: "next" | "horizontal" | "vertical",
	size: WidgetPrayerCardSize | undefined,
) {
	const s = size || "md";
	const token =
		variant === "next"
			? `var(--prayer-card-h-next-${s})`
			: `var(--prayer-card-h-item-${s})`;
	return { minHeight: `calc(${token})` } as React.CSSProperties;
}

export function WidgetPrayerCardSkeleton({
	variant,
	horizontalView = false,
	className,
	size,
	nextSize,
}: WidgetPrayerCardSkeletonProps) {
	if (variant === "next") {
		const paddings = paddingTokens(nextSize || size, "next");
		const texts = textTokens(nextSize || size, "next");
		const style = minHeightStyle("next", nextSize || size);
		return (
			<Card
				className={cn(
					"relative overflow-hidden bg-gradient-to-r border-amber-500/30 from-amber-500/20 to-orange-500/20",
					paddings,
					className,
				)}
				style={style}
			>
				<div className="relative p-0.5 text-center">
					<div className="flex items-center justify-center gap-1 mb-0">
						<Skeleton className="h-3 w-3 rounded-full" />
						<div className={cn(texts.nameText)}>
							<Skeleton className="h-[1em] w-12" />
						</div>
					</div>
					<div className={cn("flex justify-center", texts.timeText)}>
						<Skeleton className="h-[1em] w-24" />
					</div>
					<div className={cn("mt-1 flex justify-center", texts.countdownText)}>
						<Skeleton className="h-[1em] w-20" />
					</div>
				</div>
			</Card>
		);
	}

	// grid item variant
	if (horizontalView) {
		const paddings = paddingTokens(size, "horizontal");
		const texts = textTokens(size, "horizontal");
		const style = minHeightStyle("horizontal", size);
		return (
			<div
				className={cn(
					"flex items-center justify-between rounded-lg bg-gradient-to-r border border-muted/30",
					paddings,
					className,
				)}
				style={style}
			>
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-full" />
					<div className={cn(texts.nameText)}>
						<Skeleton className="h-[1em] w-10" />
					</div>
				</div>
				<div className={cn(texts.timeText)}>
					<Skeleton className="h-[1em] w-10" />
				</div>
			</div>
		);
	}

	const paddings = paddingTokens(size, "vertical");
	const texts = textTokens(size, "vertical");
	const style = minHeightStyle("vertical", size);
	return (
		<div
			className={cn(
				"flex flex-col items-center rounded-lg bg-gradient-to-b border border-muted/30",
				paddings,
				className,
			)}
			style={style}
		>
			<Skeleton className="h-4 w-4 rounded-full mb-1" />
			<div className={cn("mb-1", texts.nameText)}>
				<Skeleton className="h-[1em] w-10" />
			</div>
			<div className={cn(texts.timeText)}>
				<Skeleton className="h-[1em] w-12" />
			</div>
		</div>
	);
}
