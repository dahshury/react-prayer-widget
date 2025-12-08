"use client";

import { useCallback, useEffect, useState } from "react";
import {
	computePrayerProgress,
	type ExtendedPrayerSettings,
	type Location,
	MinimalTicker,
	type NextPrayer,
	NextPrayerCard,
	PrayerGrid,
	type PrayerGridSettings,
	PrayerGridSettingsContext,
	type PrayerTimes,
	PrayerWidget,
	TopBar,
	TranslationProvider,
	useFontSettings,
	useSettingsPersistence,
	WidgetPrayerCard,
	WidgetSettingsContext,
} from "react-prayer-widget";

/**
 * Demo page demonstrating the react-prayer-widget package components
 * Note: Uses the actual built package to 100% simulate external usage
 */
export default function DemoPage() {
	// Initialize as null to avoid SSR/client time mismatch; set on mount
	const [currentTime, setCurrentTime] = useState<Date | null>(null);

	// Update time every second
	useEffect(() => {
		setCurrentTime(new Date());
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// Mock prayer times data (guard against null currentTime)
	const prayerTimes: PrayerTimes | null = currentTime
		? {
				fajr: "05:30",
				sunrise: "06:45",
				dhuhr: "12:15",
				asr: "15:45",
				maghrib: "18:20",
				isha: "19:45",
				date: currentTime.toISOString().split("T")[0],
				hijri: "1446-07-14",
			}
		: null;

	// Calculate next prayer using shared helper
	const getNextPrayer = (): NextPrayer | null => {
		if (!(currentTime && prayerTimes)) {
			return null;
		}
		const { next, progress, minutesUntilNext } = computePrayerProgress(
			prayerTimes,
			currentTime
		);

		return {
			name: next.name,
			time: next.time,
			timeUntil: minutesUntilNext,
			progress,
		};
	};

	const nextPrayer = getNextPrayer();
	const currentOrNextName = nextPrayer?.name;

	const { settings, setSettings: setSettingsRaw } = useSettingsPersistence({
		calculationMethod: 2,
		asrMethod: 1,
		fajrOffset: 0,
		dhuhrOffset: 0,
		asrOffset: 0,
		maghribOffset: 0,
		ishaOffset: 0,
		showOtherPrayers: true,
		showCity: true,
		showTicker: true,
		showDate: true,
		showClock: true,
		timeFormat24h: true,
		dimPreviousPrayers: true,
		horizontalView: false,
		language: "en",
		tickerIntervalMs: 5000,
		nextCardSize: "lg",
		otherCardSize: "sm",
		cardBackground: "default",
		prayerFont: "default",
		timeFont: "default",
	});

	// Separate settings state for standalone next prayer card
	const [standaloneCardSettings, setStandaloneCardSettings] =
		useState<ExtendedPrayerSettings>({
			calculationMethod: 2,
			asrMethod: 1,
			fajrOffset: 0,
			dhuhrOffset: 0,
			asrOffset: 0,
			maghribOffset: 0,
			ishaOffset: 0,
			cardBackground: "default",
			cardBackgroundOpacity: 0.7,
			nextCardSize: "lg",
			horizontalView: false,
			timeFormat24h: true,
			language: "en",
			prayerNameColor: "#ffffff",
			prayerTimeColor: "#ffffff",
			prayerCountdownColor: "#ffffff",
			prayerFont: "default",
			timeFont: "default",
		});

	// Separate settings state for prayer grid
	const [prayerGridSettings, setPrayerGridSettings] =
		useState<PrayerGridSettings>({
			cardBackground: "default",
			cardBackgroundOpacity: 0.7,
			otherCardSize: "sm",
			dimPreviousPrayers: true,
			horizontalView: false,
			timeFormat24h: true,
			language: "en",
			prayerNameColor: "#ffffff",
			prayerTimeColor: "#ffffff",
			prayerCountdownColor: "#ffffff",
			prayerFont: "default",
			timeFont: "default",
		});

	// Mock location
	const location: Location = {
		latitude: 30.0444,
		longitude: 31.2357,
		city: "Cairo",
		country: "Egypt",
		countryCode: "EG",
	};

	// Handle standalone card settings changes
	const handleStandaloneCardSettingsChange = useCallback(
		(newSettings: Partial<ExtendedPrayerSettings>) => {
			setStandaloneCardSettings((prev) => ({ ...prev, ...newSettings }));
		},
		[]
	);

	// Handle prayer grid settings changes
	const handlePrayerGridSettingsChange = useCallback(
		(newSettings: Partial<PrayerGridSettings>) => {
			setPrayerGridSettings((prev) => ({ ...prev, ...newSettings }));
		},
		[]
	);

	// Wrap setSettingsRaw to merge partial updates for PrayerWidget
	const setSettings = useCallback(
		(newSettings: Partial<ExtendedPrayerSettings>) => {
			setSettingsRaw((prev) => ({ ...prev, ...newSettings }));
		},
		[setSettingsRaw]
	);

	// Apply font settings to CSS variables
	useFontSettings(settings);

	if (!(currentTime && prayerTimes && nextPrayer && currentOrNextName)) {
		return (
			<div className="min-h-screen bg-background p-8">
				<div className="mx-auto max-w-6xl">
					<p className="text-muted-foreground text-sm">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<TranslationProvider language={settings.language || "en"}>
			<div className="min-h-screen bg-background p-8">
				<div className="mx-auto max-w-6xl space-y-12">
					{/* Header */}
					<div className="mb-8 text-center">
						<h1 className="mb-2 font-bold text-4xl">
							React Prayer Widget Demo
						</h1>
					</div>

					{/* Top Bar with Date, Time, and Location */}
					<div className="mb-6">
						<TopBar
							currentTime={currentTime}
							language={settings.language}
							location={location}
							showCity={settings.showCity}
							showClock={settings.showClock}
							showDate={settings.showDate}
							timeFormat24h={settings.timeFormat24h}
						/>
					</div>

					{/* Section 0: Next Prayer Card (standalone) */}
					<section className="space-y-4">
						<h2 className="text-center font-semibold text-2xl">
							Next Prayer Card (standalone)
						</h2>
						<p className="text-center text-muted-foreground text-sm">
							The top card showing the next prayer with countdown and progress.
							Right-click to open settings. These settings are independent from
							the main app settings.
						</p>
						<WidgetSettingsContext
							onSettingsChange={handleStandaloneCardSettingsChange}
							settings={standaloneCardSettings}
						>
							<NextPrayerCard
								cardBackground={standaloneCardSettings.cardBackground}
								cardBackgroundOpacity={
									standaloneCardSettings.cardBackgroundOpacity
								}
								horizontalView={standaloneCardSettings.horizontalView}
								language={standaloneCardSettings.language}
								maxWidth="3xl"
								nextPrayer={nextPrayer}
								nextSize={standaloneCardSettings.nextCardSize || "lg"}
								timeFormat24h={standaloneCardSettings.timeFormat24h}
							/>
						</WidgetSettingsContext>
					</section>

					{/* Section 1: All-in-one bundled widget (one import) */}
					<section className="space-y-4">
						<h2 className="text-center font-semibold text-2xl">
							All-in-one Prayer Widget (one import)
						</h2>
						<p className="text-center text-muted-foreground text-sm">
							Bundles next card, grid, ticker, fonts, and backgrounds.
							Right-click to open settings.
						</p>
						<PrayerWidget
							className="mx-auto max-w-4xl"
							maxWidth="3xl"
							onSettingsChange={setSettings}
							prayerTimes={prayerTimes}
							settings={settings}
						/>
					</section>

					{/* Section 2: Prayer Grid (All Prayers) with Standalone Settings Context */}
					{settings.showOtherPrayers !== false && (
						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">
								Prayer Grid (standalone)
							</h2>
							<p className="text-muted-foreground text-sm">
								Right-click on the grid to open its own settings. These settings
								are independent from the main app settings.
							</p>
							<PrayerGridSettingsContext
								onSettingsChange={handlePrayerGridSettingsChange}
								settings={prayerGridSettings}
							>
								<PrayerGrid
									cardBackground={prayerGridSettings.cardBackground}
									cardBackgroundOpacity={
										prayerGridSettings.cardBackgroundOpacity
									}
									currentOrNextName={currentOrNextName}
									dimPreviousPrayers={prayerGridSettings.dimPreviousPrayers}
									horizontalView={prayerGridSettings.horizontalView}
									language={prayerGridSettings.language}
									prayerTimes={prayerTimes}
									size={prayerGridSettings.otherCardSize}
									timeFormat24h={prayerGridSettings.timeFormat24h}
									timezone={settings.timezone}
								/>
							</PrayerGridSettingsContext>
						</section>
					)}

					{/* Section 4: Minimal Ticker (standalone) */}
					<section className="space-y-4">
						<h2 className="font-semibold text-2xl">
							Minimal Ticker (standalone)
						</h2>
						<p className="text-muted-foreground text-sm">
							The ticker automatically cycles through different azkar
							(remembrances) based on time of day.
						</p>
						<MinimalTicker
							intervalMs={settings.tickerIntervalMs ?? 5000}
							key={`standalone-ticker-${settings.tickerIntervalMs ?? 5000}`}
							prayerTimes={prayerTimes}
						/>
					</section>

					{/* Section 5: Different Sizes */}
					<section className="space-y-4">
						<h2 className="font-semibold text-2xl">Different Sizes</h2>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<WidgetPrayerCard
								cardBackground={settings.cardBackground}
								name="Fajr"
								size="xxs"
								time="05:30"
							/>
							<WidgetPrayerCard
								cardBackground={settings.cardBackground}
								name="Dhuhr"
								size="xs"
								time="12:15"
							/>
							<WidgetPrayerCard
								cardBackground={settings.cardBackground}
								name="Asr"
								size="sm"
								time="15:45"
							/>
							<WidgetPrayerCard
								cardBackground={settings.cardBackground}
								name="Maghrib"
								size="md"
								time="18:20"
							/>
							<WidgetPrayerCard
								cardBackground={settings.cardBackground}
								name="Isha"
								size="lg"
								time="19:45"
							/>
						</div>
					</section>
				</div>
			</div>
		</TranslationProvider>
	);
}
