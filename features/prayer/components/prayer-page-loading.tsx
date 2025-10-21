"use client";

import { WidgetPrayerCardSkeleton } from "@/widgets/prayer-card";

type PrayerPageLoadingProps = {
	/**
	 * Optional CSS class to add to the outer container
	 */
	className?: string;
};

/**
 * Loading state component showing skeleton loaders
 * - One large skeleton for the next prayer card
 * - Five grid skeletons for the prayer time cards
 */
export function PrayerPageLoading({ className }: PrayerPageLoadingProps) {
	return (
		<div className={`space-y-4 ${className || ""}`}>
			<WidgetPrayerCardSkeleton className="mb-2" variant="next" />
			<div className="grid grid-cols-5 gap-2">
				<WidgetPrayerCardSkeleton variant="grid" />
				<WidgetPrayerCardSkeleton variant="grid" />
				<WidgetPrayerCardSkeleton variant="grid" />
				<WidgetPrayerCardSkeleton variant="grid" />
				<WidgetPrayerCardSkeleton variant="grid" />
			</div>
		</div>
	);
}
