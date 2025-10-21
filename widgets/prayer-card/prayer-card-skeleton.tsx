"use client";

import { cn } from "@/shared/libs/utils/cn";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import type { WidgetPrayerCardSize } from "@/widgets/prayer-card/prayer-card";

type WidgetPrayerCardSkeletonProps = {
	variant: "next" | "grid";
	horizontalView?: boolean;
	className?: string;
	/** Match WidgetPrayerCard size tokens */
	size?: WidgetPrayerCardSize;
	/** Match WidgetPrayerCard nextSize tokens */
	nextSize?: WidgetPrayerCardSize;
};

type TextTokens = {
	nameText: string;
	timeText: string;
	countdownText: string;
};

type SizeTokenConfig = Record<
	WidgetPrayerCardSize | "md",
	{ nameText: string; timeText: string }
>;

const PADDING_TOKENS = {
	next: {
		xs: "py-1 px-2",
		sm: "py-1.5 px-2.5",
		md: "py-2 px-3",
		lg: "py-3 px-4",
		xxs: "py-2 px-3",
	},
	horizontal: {
		xs: "p-2",
		sm: "p-2.5",
		md: "p-3",
		lg: "p-4",
		xxs: "p-3",
	},
	vertical: {
		xs: "p-2",
		sm: "p-2.5",
		md: "p-3",
		lg: "p-4",
		xxs: "p-3",
	},
} as const;

const TEXT_TOKENS_NEXT: SizeTokenConfig = {
	xs: { nameText: "text-[9px]", timeText: "text-xs" },
	sm: { nameText: "text-[10px]", timeText: "text-sm" },
	md: { nameText: "text-[10px]", timeText: "text-sm" },
	lg: { nameText: "text-xs", timeText: "text-base" },
	xxs: { nameText: "text-[10px]", timeText: "text-sm" },
};

const TEXT_TOKENS_HORIZONTAL: SizeTokenConfig = {
	xs: { nameText: "text-[10px]", timeText: "text-xs" },
	sm: { nameText: "text-xs", timeText: "text-sm" },
	md: { nameText: "text-xs", timeText: "text-sm" },
	lg: { nameText: "text-sm", timeText: "text-base" },
	xxs: { nameText: "text-xs", timeText: "text-sm" },
};

const TEXT_TOKENS_VERTICAL: SizeTokenConfig = {
	xs: { nameText: "text-[9px]", timeText: "text-[11px]" },
	sm: { nameText: "text-[10px]", timeText: "text-xs" },
	md: { nameText: "text-[10px]", timeText: "text-xs" },
	lg: { nameText: "text-xs", timeText: "text-sm" },
	xxs: { nameText: "text-[10px]", timeText: "text-xs" },
};

function paddingTokens(
	size: WidgetPrayerCardSize | undefined,
	variant: "next" | "horizontal" | "vertical"
): string {
	const s = (size || "md") as WidgetPrayerCardSize;
	return PADDING_TOKENS[variant][s];
}

function textTokens(
	size: WidgetPrayerCardSize | undefined,
	variant: "next" | "horizontal" | "vertical"
): TextTokens {
	const s = (size || "md") as WidgetPrayerCardSize;

	let textConfig: SizeTokenConfig;
	if (variant === "next") {
		textConfig = TEXT_TOKENS_NEXT;
	} else if (variant === "horizontal") {
		textConfig = TEXT_TOKENS_HORIZONTAL;
	} else {
		textConfig = TEXT_TOKENS_VERTICAL;
	}

	const { nameText, timeText } = textConfig[s];
	return { nameText, timeText, countdownText: "text-[10px]" };
}

function minHeightStyle(
	variant: "next" | "horizontal" | "vertical",
	size: WidgetPrayerCardSize | undefined
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
					"relative overflow-hidden border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-orange-500/20",
					paddings,
					className
				)}
				style={style}
			>
				<div className="relative p-0.5 text-center">
					<div className="mb-0 flex items-center justify-center gap-1">
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
					"flex items-center justify-between rounded-lg border border-muted/30 bg-gradient-to-r",
					paddings,
					className
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
				"flex flex-col items-center rounded-lg border border-muted/30 bg-gradient-to-b",
				paddings,
				className
			)}
			style={style}
		>
			<Skeleton className="mb-1 h-4 w-4 rounded-full" />
			<div className={cn("mb-1", texts.nameText)}>
				<Skeleton className="h-[1em] w-10" />
			</div>
			<div className={cn(texts.timeText)}>
				<Skeleton className="h-[1em] w-12" />
			</div>
		</div>
	);
}
