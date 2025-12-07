"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ExtendedPrayerSettings, Location } from "@/entities/prayer";
import { countryToFlag } from "@/shared/lib/geo";
import { formatCurrentTime } from "@/shared/lib/time";
import { DualDateDisplay } from "@/shared/ui/dual-date-display";

type PrayerPageHeaderProps = {
	settings: ExtendedPrayerSettings;
	location: Location | null;
	currentTime: Date;
};

/**
 * Header component displaying prayer page metadata:
 * - Dual date display (Gregorian + Hijri)
 * - Current time
 * - Location (city + country flag)
 */
export function PrayerPageHeader({
	settings,
	location,
	currentTime,
}: PrayerPageHeaderProps) {
	const [isMounted, setIsMounted] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-wrap items-center gap-2 sm:gap-3">
				{!!settings.showDate && (
					<DualDateDisplay className="text-xs sm:text-sm" />
				)}

				{settings.showClock !== false && isMounted && (
					<div className="flex items-center gap-1.5 rounded-md border border-muted/30 px-2 py-1">
						<span className="font-mono text-foreground text-xs">
							{formatCurrentTime(
								currentTime,
								settings.timeFormat24h ?? true,
								settings.language || "en"
							)}
						</span>
					</div>
				)}
			</div>

			{!!settings.showCity && (
				<div className="flex items-center gap-1.5 rounded-md border border-muted/30 px-2.5 py-1.5 text-foreground text-xs sm:text-sm">
					<MapPin className="h-3.5 w-3.5 text-amber-400" />
					<span className="font-medium leading-none" suppressHydrationWarning>
						{isMounted
							? location?.city || t("ui.general.loading", "Loading...")
							: "Loading..."}
					</span>
					<span className="text-muted-foreground text-sm">
						{location?.countryCode
							? countryToFlag(location.countryCode)
							: countryToFlag(location?.country)}
					</span>
				</div>
			)}
		</div>
	);
}
