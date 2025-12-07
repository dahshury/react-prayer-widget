"use client";

import { useEffect, useMemo, useState } from "react";
import {
	DEFAULT_EXTENDED_SETTINGS,
	type ExtendedPrayerSettings,
	type PrayerTimes,
} from "@/entities/prayer";
import { DEFAULT_TICKER_INTERVAL_MS } from "@/features/prayer/config";
import { usePrayerProgress } from "@/features/prayer/model";
import { WidgetSettingsContext } from "@/features/settings/ui";
import { TranslationProvider } from "@/shared/lib/hooks";
import { useFontSettings } from "@/shared/lib/hooks/use-font-settings";
import { cn } from "@/shared/lib/utils";
import { PrayerGrid } from "@/widgets/prayer-grid";
import { MinimalTicker } from "@/widgets/ticker";
import { NextPrayerCard } from "./next-prayer-card";

export type PrayerWidgetProps = {
	prayerTimes: PrayerTimes;
	settings?: Partial<ExtendedPrayerSettings>;
	onSettingsChange?: (settings: Partial<ExtendedPrayerSettings>) => void;
	className?: string;
	cardClassName?: string;
	gridClassName?: string;
	tickerClassName?: string;
	showGrid?: boolean;
	showTicker?: boolean;
	maxWidth?:
		| "md"
		| "lg"
		| "xl"
		| "2xl"
		| "3xl"
		| number
		| string
		| "fit-content"
		| "max-content"
		| "min-content"
		| "auto"
		| `calc(${string})`
		| `clamp(${string})`
		| `min(${string})`
		| `max(${string})`
		| `var(${string})`
		| `${number}${"px" | "rem" | "em" | "%" | "vw" | "vh" | "ch"}`;
};

/**
 * One-stop bundled widget: next card + grid + ticker, with fonts/backgrounds/settings.
 */
export function PrayerWidget({
	prayerTimes,
	settings,
	onSettingsChange,
	className,
	cardClassName,
	gridClassName,
	tickerClassName,
	showGrid = true,
	showTicker = true,
	maxWidth,
}: PrayerWidgetProps) {
	const [localSettings, setLocalSettings] = useState<ExtendedPrayerSettings>(
		() => ({ ...DEFAULT_EXTENDED_SETTINGS, ...settings })
	);

	useFontSettings(localSettings);

	// Sync settings prop to localSettings
	useEffect(() => {
		if (!settings) {
			return;
		}
		setLocalSettings((prev) => {
			// Always merge to ensure we pick up any changes from parent
			return { ...prev, ...settings };
		});
	}, [settings]);

	// Memoize tickerInterval to ensure stable reference and correct value
	// Use settings prop directly if available, otherwise fall back to localSettings
	// Must be before any conditional returns to satisfy rules of hooks
	const tickerInterval = useMemo(() => {
		// Prefer settings prop (from parent) over localSettings to ensure we get latest value
		return (
			settings?.tickerIntervalMs ??
			localSettings.tickerIntervalMs ??
			DEFAULT_TICKER_INTERVAL_MS
		);
	}, [settings?.tickerIntervalMs, localSettings.tickerIntervalMs]);

	const nextPrayer = usePrayerProgress(prayerTimes);

	if (!nextPrayer) {
		return null;
	}

	const currentOrNextName = nextPrayer.name;
	const renderGrid = showGrid && localSettings.showOtherPrayers !== false;
	const renderTicker = showTicker && localSettings.showTicker !== false;

	return (
		<TranslationProvider language={localSettings.language || "en"}>
			<WidgetSettingsContext
				onSettingsChange={(next) => {
					setLocalSettings((prev) => ({ ...prev, ...next }));
					// Propagate changes to parent if callback provided
					if (onSettingsChange) {
						onSettingsChange(next);
					}
				}}
				settings={localSettings}
			>
				<div className={cn("space-y-4", className)}>
					<NextPrayerCard
						cardBackground={localSettings.cardBackground}
						cardBackgroundOpacity={localSettings.cardBackgroundOpacity}
						className={cardClassName}
						horizontalView={localSettings.horizontalView}
						language={localSettings.language}
						maxWidth={
							maxWidth as Parameters<typeof NextPrayerCard>[0]["maxWidth"]
						}
						nextPrayer={nextPrayer}
						nextSize={localSettings.nextCardSize || "md"}
						timeFormat24h={localSettings.timeFormat24h}
					/>

					{renderGrid ? (
						<PrayerGrid
							cardBackground={localSettings.cardBackground}
							cardBackgroundOpacity={localSettings.cardBackgroundOpacity}
							className={gridClassName}
							currentOrNextName={currentOrNextName}
							dimPreviousPrayers={localSettings.dimPreviousPrayers}
							horizontalView={localSettings.horizontalView}
							language={localSettings.language}
							prayerTimes={prayerTimes}
							size={localSettings.otherCardSize}
							timeFormat24h={localSettings.timeFormat24h}
							timezone={localSettings.timezone}
						/>
					) : null}

					{renderTicker ? (
						<MinimalTicker
							className={tickerClassName}
							intervalMs={tickerInterval}
							key={`ticker-${settings?.tickerIntervalMs ?? localSettings.tickerIntervalMs ?? DEFAULT_TICKER_INTERVAL_MS}`}
							prayerTimes={prayerTimes}
						/>
					) : null}
				</div>
			</WidgetSettingsContext>
		</TranslationProvider>
	);
}
