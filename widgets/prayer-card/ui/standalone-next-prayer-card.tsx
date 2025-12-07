"use client";

import { useEffect, useState } from "react";
import {
	DEFAULT_EXTENDED_SETTINGS,
	type ExtendedPrayerSettings,
	type PrayerTimes,
} from "@/entities/prayer";
import { usePrayerProgress } from "@/features/prayer/model";
import { WidgetSettingsContext } from "@/features/settings/ui";
import { TranslationProvider } from "@/shared/lib/hooks";
import { useFontSettings } from "@/shared/lib/hooks/use-font-settings";
import type { NextPrayerCardProps } from "./next-prayer-card";
import { NextPrayerCard } from "./next-prayer-card";

export type StandaloneNextPrayerCardProps = {
	prayerTimes: PrayerTimes;
	settings?: Partial<ExtendedPrayerSettings>;
} & Pick<
	NextPrayerCardProps,
	| "className"
	| "gradientClass"
	| "showIcon"
	| "classes"
	| "maxWidth"
	| "nextSize"
	| "size"
	| "timeFormat24h"
> & {
		cardBackground?: string;
	};

/**
 * Drop-in Next Prayer card that bundles translation + settings context.
 * Consumers only need to provide daily prayerTimes; everything else is optional.
 */
export function StandaloneNextPrayerCard({
	prayerTimes,
	settings,
	className,
	gradientClass,
	showIcon,
	classes,
	maxWidth,
	nextSize,
	size,
	cardBackground,
}: StandaloneNextPrayerCardProps) {
	const [localSettings, setLocalSettings] = useState<ExtendedPrayerSettings>(
		() => ({ ...DEFAULT_EXTENDED_SETTINGS, ...settings })
	);

	useFontSettings(localSettings);

	useEffect(() => {
		if (!settings) {
			return;
		}
		setLocalSettings((prev) => ({ ...prev, ...settings }));
	}, [settings]);

	const nextPrayer = usePrayerProgress(prayerTimes);

	if (!nextPrayer) {
		return null;
	}

	return (
		<TranslationProvider language={localSettings.language || "en"}>
			<WidgetSettingsContext
				onSettingsChange={(next) =>
					setLocalSettings((prev) => ({ ...prev, ...next }))
				}
				settings={localSettings}
			>
				<div className="flex justify-center">
					<NextPrayerCard
						cardBackground={cardBackground ?? localSettings.cardBackground}
						classes={classes}
						className={className}
						gradientClass={gradientClass}
						horizontalView={localSettings.horizontalView}
						language={localSettings.language}
						maxWidth={maxWidth}
						nextPrayer={nextPrayer}
						nextSize={nextSize ?? localSettings.nextCardSize ?? "md"}
						showIcon={showIcon}
						size={size}
						timeFormat24h={localSettings.timeFormat24h}
					/>
				</div>
			</WidgetSettingsContext>
		</TranslationProvider>
	);
}
