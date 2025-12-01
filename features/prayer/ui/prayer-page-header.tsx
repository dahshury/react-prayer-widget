"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import type { ExtendedPrayerSettings, Location } from "@/entities/prayer";
import { countryToFlag } from "@/shared/lib/geo";
import { formatCurrentTime } from "@/shared/lib/time";
import { DualDateDisplay } from "@/widgets/dates";

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

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-3">
				{!!settings.showDate && <DualDateDisplay />}
				{/* Current time outside the card, near date/city */}
				{settings.showClock !== false && isMounted && (
					<div className="font-mono text-muted-foreground text-xs">
						{formatCurrentTime(
							currentTime,
							settings.timeFormat24h ?? true,
							settings.language || "en"
						)}
					</div>
				)}
				{!!settings.showCity && (
					<div className="flex items-center gap-1 text-muted-foreground text-xs">
						<MapPin className="h-3 w-3" />
						<span>
							{location?.city ||
								(settings.language === "ar" ? "جاري التحميل..." : "Loading...")}
						</span>
						<span className="ml-1">
							{location?.countryCode
								? countryToFlag(location.countryCode)
								: countryToFlag(location?.country)}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
