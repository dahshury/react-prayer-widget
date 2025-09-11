"use client";

import { AlertCircle, MapPin } from "lucide-react";
import { useCallback, useTransition } from "react";
import { WidgetSettingsContext } from "@/components/contexts/widget-settings-context";
import { DualDateDisplay } from "@/components/dual-date-display";
import { MinimalTicker } from "@/components/minimal-ticker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WidgetPrayerCard } from "@/components/widget-prayer-card";
import { WidgetPrayerCardSkeleton } from "@/components/widget-prayer-card-skeleton";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { TranslationProvider } from "@/hooks/use-translation";
import {
	countryToFlag,
	formatCurrentTime,
	formatMinutesHHmm,
	formatTimeDisplay,
} from "@/lib/utils";

export default function PrayerTimesPage() {
	const {
		prayerTimes,
		location,
		settings,
		loading,
		error,
		nextPrayer,
		currentTime,
		updateSettings,
	} = usePrayerTimes();
	const [, startTransition] = useTransition();

	const updateSettingsDeferred = useCallback(
		(s: Partial<typeof settings>) => {
			startTransition(() => {
				updateSettings(s);
			});
		},
		[updateSettings],
	);

	if (error) {
		return (
			<div className="min-h-screen bg-background p-4 flex items-center justify-center">
				<Alert className="max-w-md">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	const isPast = (hhmm: string) => {
		const [h, m] = hhmm.split(":").map(Number);
		const now = new Date();
		const cm = now.getHours() * 60 + now.getMinutes();
		return h * 60 + m < cm;
	};

	return (
		<TranslationProvider language={settings.language || "en"}>
			<div className="min-h-screen bg-background">
				<div className="max-w-xl mx-auto p-4 space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{settings.showDate && <DualDateDisplay />}
							{/* Current time outside the card, near date/city */}
							{settings.showClock !== false && (
								<div className="text-xs text-muted-foreground font-mono">
									{formatCurrentTime(
										currentTime,
										settings.timeFormat24h ?? true,
										settings.language || "en",
									)}
								</div>
							)}
							{settings.showCity && (
								<div className="flex items-center gap-1 text-xs text-muted-foreground">
									<MapPin className="h-3 w-3" />
									<span>
										{location?.city ||
											(settings.language === "ar"
												? "جاري التحميل..."
												: "Loading...")}
									</span>
									<span className="ml-1">
										{location?.countryCode
											? countryToFlag(location.countryCode)
											: countryToFlag(location?.country)}
									</span>
								</div>
							)}
						</div>
						{/* Settings button removed; access via context menu on the main card */}
					</div>

					{loading ? (
						<div className="space-y-4">
							<WidgetPrayerCardSkeleton variant="next" className="mb-2" />
							<div className="grid grid-cols-5 gap-2">
								<WidgetPrayerCardSkeleton variant="grid" />
								<WidgetPrayerCardSkeleton variant="grid" />
								<WidgetPrayerCardSkeleton variant="grid" />
								<WidgetPrayerCardSkeleton variant="grid" />
								<WidgetPrayerCardSkeleton variant="grid" />
							</div>
						</div>
					) : prayerTimes && nextPrayer ? (
						<div className="space-y-4">
							<WidgetSettingsContext
								settings={settings}
								onSettingsChange={updateSettingsDeferred}
							>
								<WidgetPrayerCard
									name={nextPrayer.name}
									time={formatTimeDisplay(
										nextPrayer.time,
										settings.timeFormat24h ?? true,
										settings.language || "en",
									)}
									isNext={true}
									progress={nextPrayer.progress}
									countdown={formatMinutesHHmm(nextPrayer.timeUntil)}
									className="mb-2"
								/>
							</WidgetSettingsContext>

							{settings.showOtherPrayers && (
								<div
									className={
										settings.horizontalView
											? "space-y-2"
											: "grid grid-cols-5 gap-2"
									}
								>
									<WidgetPrayerCard
										name="Fajr"
										time={formatTimeDisplay(
											prayerTimes.fajr,
											settings.timeFormat24h ?? true,
											settings.language || "en",
										)}
										isCurrent={nextPrayer.name === "Fajr"}
										horizontalView={settings.horizontalView}
										className={
											settings.dimPreviousPrayers && isPast(prayerTimes.fajr)
												? "opacity-40"
												: undefined
										}
									/>
									<WidgetPrayerCard
										name="Dhuhr"
										time={formatTimeDisplay(
											prayerTimes.dhuhr,
											settings.timeFormat24h ?? true,
											settings.language || "en",
										)}
										isCurrent={nextPrayer.name === "Dhuhr"}
										horizontalView={settings.horizontalView}
										className={
											settings.dimPreviousPrayers && isPast(prayerTimes.dhuhr)
												? "opacity-40"
												: undefined
										}
									/>
									<WidgetPrayerCard
										name="Asr"
										time={formatTimeDisplay(
											prayerTimes.asr,
											settings.timeFormat24h ?? true,
											settings.language || "en",
										)}
										isCurrent={nextPrayer.name === "Asr"}
										horizontalView={settings.horizontalView}
										className={
											settings.dimPreviousPrayers && isPast(prayerTimes.asr)
												? "opacity-40"
												: undefined
										}
									/>
									<WidgetPrayerCard
										name="Maghrib"
										time={formatTimeDisplay(
											prayerTimes.maghrib,
											settings.timeFormat24h ?? true,
											settings.language || "en",
										)}
										isCurrent={nextPrayer.name === "Maghrib"}
										horizontalView={settings.horizontalView}
										className={
											settings.dimPreviousPrayers && isPast(prayerTimes.maghrib)
												? "opacity-40"
												: undefined
										}
									/>
									<WidgetPrayerCard
										name="Isha"
										time={formatTimeDisplay(
											prayerTimes.isha,
											settings.timeFormat24h ?? true,
											settings.language || "en",
										)}
										isCurrent={nextPrayer.name === "Isha"}
										horizontalView={settings.horizontalView}
										className={
											settings.dimPreviousPrayers && isPast(prayerTimes.isha)
												? "opacity-40"
												: undefined
										}
									/>
								</div>
							)}
						</div>
					) : null}

					{settings.showTicker && (
						<div className="mt-8">
							<MinimalTicker
								prayerTimes={prayerTimes}
								intervalMs={settings.tickerIntervalMs ?? 5000}
							/>
						</div>
					)}
				</div>
			</div>
		</TranslationProvider>
	);
}
