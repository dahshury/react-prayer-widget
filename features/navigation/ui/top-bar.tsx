"use client";

import { MapPin } from "lucide-react";
import { countryToFlag } from "@/shared/libs/geo/country";
import { formatCurrentTime } from "@/shared/libs/time/format";
import { DualDateDisplay } from "@/widgets/dates";

/** Props for the TopBar component */
export type TopBarProps = {
	showDate?: boolean;
	showClock?: boolean;
	showCity?: boolean;
	currentTime: Date;
	location?: {
		city?: string | null;
		countryCode?: string | null;
		country?: string | null;
	};
	timeFormat24h?: boolean;
	language?: "en" | "ar";
	className?: string;
	classes?: {
		container?: string;
		date?: string;
		clock?: string;
		city?: string;
		cityIcon?: string;
	};
};

export function TopBar({
	showDate = true,
	showClock = true,
	showCity = true,
	currentTime,
	location,
	timeFormat24h = true,
	language = "en",
	className,
	classes,
}: TopBarProps) {
	return (
		<div
			className={`flex items-center justify-between ${className ?? ""} ${classes?.container ?? ""}`}
		>
			<div className="flex items-center gap-3">
				{!!showDate && <DualDateDisplay className={classes?.date} />}
				{!!showClock && (
					<div
						className={`font-mono text-muted-foreground text-xs ${classes?.clock ?? ""}`}
					>
						{formatCurrentTime(currentTime, timeFormat24h, language)}
					</div>
				)}
				{!!showCity && (
					<div
						className={`flex items-center gap-1 text-muted-foreground text-xs ${classes?.city ?? ""}`}
					>
						<MapPin className={`h-3 w-3 ${classes?.cityIcon ?? ""}`} />
						<span>
							{location?.city ||
								(language === "ar" ? "جاري التحميل..." : "Loading...")}
						</span>
						<span className="ml-1">
							{location?.countryCode
								? countryToFlag(location.countryCode)
								: countryToFlag(location?.country || "")}
						</span>
					</div>
				)}
			</div>
			<div />
		</div>
	);
}
