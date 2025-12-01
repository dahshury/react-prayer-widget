"use client";

import { AlertCircle } from "lucide-react";
import { useAzan, usePrayerTimes } from "@/features/prayer/model";
import {
	NextPrayerSection,
	PrayerCardsGrid,
	PrayerPageHeader,
	PrayerPageLoading,
	TickerSection,
	usePrayerPageState,
} from "@/features/prayer/ui";
import { WidgetSettingsContext } from "@/features/settings/ui";
import { TranslationProvider } from "@/shared/lib/hooks";
import { getResponsiveWidthClass, isPast } from "@/shared/lib/utils";
import { Alert, AlertDescription } from "@/shared/ui/alert";

/**
 * Prayer Times Application Page
 * Main component orchestrating the prayer times display with responsive layouts,
 * settings management, and real-time countdown updates.
 */
export default function PrayerTimesPage() {
	// Load all prayer data and settings
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

	// Initialize azan audio playback
	useAzan({ prayerTimes, settings });

	// Manage page-level state (responsive visibility, settings updates, etc.)
	const {
		updateSettingsDeferred,
		isFriday,
		isSmallScreen,
		otherPrayersVisible,
	} = usePrayerPageState(settings, currentTime, updateSettings);

	// Show error state
	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background p-4">
				<Alert className="max-w-md">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	// Render page with responsive width
	const containerClass = getResponsiveWidthClass(settings.appWidth || "xl");

	const contentElement =
		prayerTimes && nextPrayer ? (
			<div className="space-y-4">
				{/* Main prayer display with settings context */}
				<WidgetSettingsContext
					onSettingsChange={updateSettingsDeferred}
					settings={settings}
				>
					{/* Next prayer card section */}
					<NextPrayerSection
						isFriday={isFriday}
						isSmallScreen={isSmallScreen}
						nextPrayer={nextPrayer}
						otherPrayersVisible={otherPrayersVisible}
						prayerTimes={prayerTimes}
						settings={settings}
					/>

					{/* All prayer cards grid (Fajr, Dhuhr, Asr, Maghrib, Isha) */}
					{!!otherPrayersVisible && (
						<PrayerCardsGrid
							isFriday={isFriday}
							isPastTime={isPast}
							nextPrayerName={nextPrayer.name}
							onSettingsChange={updateSettingsDeferred}
							prayerTimes={prayerTimes}
							settings={settings}
						/>
					)}
				</WidgetSettingsContext>
			</div>
		) : null;

	return (
		<TranslationProvider language={settings.language || "en"}>
			<div className="min-h-screen bg-background">
				<div className={`mx-auto space-y-4 p-4 ${containerClass}`}>
					{/* Page header with date, time, and location */}
					<PrayerPageHeader
						currentTime={currentTime}
						location={location}
						settings={settings}
					/>

					{/* Loading skeleton state */}
					{!!loading && <PrayerPageLoading className="mb-2" />}
					{!loading && contentElement}

					{/* Bottom ticker when other prayers are visible */}
					{!!settings.showTicker && otherPrayersVisible && prayerTimes && (
						<TickerSection
							prayerTimes={prayerTimes}
							tickerIntervalMs={settings.tickerIntervalMs}
						/>
					)}
				</div>
			</div>
		</TranslationProvider>
	);
}
