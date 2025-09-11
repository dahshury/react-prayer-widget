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

export function WidgetPrayerCardSkeleton({
	variant,
	horizontalView = false,
	className,
	size,
	nextSize,
}: WidgetPrayerCardSkeletonProps) {
	if (variant === "next") {
		const paddings = paddingTokens(nextSize || size, "next");
		return (
			<Card
				className={cn(
					"relative overflow-hidden bg-gradient-to-r border-amber-500/30 from-amber-500/20 to-orange-500/20",
					paddings,
					className,
				)}
			>
				<div className="relative p-0.5 text-center">
					<div className="flex items-center justify-center gap-1 mb-0">
						<Skeleton className="h-3 w-3 rounded-full" />
						<Skeleton className="h-3 w-12" />
					</div>
					<div className="flex justify-center">
						<Skeleton className="h-4 w-24" />
					</div>
					<div className="mt-1 flex justify-center">
						<Skeleton className="h-3 w-20" />
					</div>
				</div>
			</Card>
		);
	}

	// grid item variant
	if (horizontalView) {
		const paddings = paddingTokens(size, "horizontal");
		return (
			<div
				className={cn(
					"flex items-center justify-between rounded-lg bg-gradient-to-r border border-muted/30",
					paddings,
					className,
				)}
			>
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-4 rounded-full" />
					<Skeleton className="h-3 w-10" />
				</div>
				<Skeleton className="h-3 w-10" />
			</div>
		);
	}

	const paddings = paddingTokens(size, "vertical");
	return (
		<div
			className={cn(
				"flex flex-col items-center rounded-lg bg-gradient-to-b border border-muted/30",
				paddings,
				className,
			)}
		>
			<Skeleton className="h-4 w-4 rounded-full mb-1" />
			<Skeleton className="h-3 w-10 mb-1" />
			<Skeleton className="h-3 w-12" />
		</div>
	);
}
