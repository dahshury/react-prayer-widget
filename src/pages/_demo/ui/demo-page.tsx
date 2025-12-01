"use client";

import { useCallback, useEffect, useState } from "react";
import {
	type ExtendedPrayerSettings,
	type Location,
	MinimalTicker,
	type NextPrayer,
	NextPrayerCard,
	PrayerGrid,
	type PrayerTimes,
	TopBar,
	TranslationProvider,
	WidgetPrayerCard,
	WidgetSettingsContext,
} from "react-prayer-widget";

/**
 * Demo page using ONLY package imports from react-prayer-widget
 * This demonstrates how external users would use the package
 */
export default function DemoPage() {
	// Initialize with a function to avoid SSR hydration issues
	const [currentTime, setCurrentTime] = useState(() => new Date());

	// Update time every second
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// Mock prayer times data
	const prayerTimes: PrayerTimes = {
		fajr: "05:30",
		sunrise: "06:45",
		dhuhr: "12:15",
		asr: "15:45",
		maghrib: "18:20",
		isha: "19:45",
		date: currentTime.toISOString().split("T")[0],
		hijri: "1446-07-14",
	};

	// Calculate next prayer (simplified logic for demo)
	const getNextPrayer = (): NextPrayer => {
		const now = currentTime;
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const currentMinutes = hours * 60 + minutes;

		const prayers = [
			{ name: "Fajr", time: "05:30", minutes: 5 * 60 + 30 },
			{ name: "Dhuhr", time: "12:15", minutes: 12 * 60 + 15 },
			{ name: "Asr", time: "15:45", minutes: 15 * 60 + 45 },
			{ name: "Maghrib", time: "18:20", minutes: 18 * 60 + 20 },
			{ name: "Isha", time: "19:45", minutes: 19 * 60 + 45 },
		];

		const nextPrayer =
			prayers.find((p) => p.minutes > currentMinutes) || prayers[0];
		const timeUntil = nextPrayer.minutes - currentMinutes;
		const progress = Math.max(0, Math.min(1, timeUntil / 120)); // Progress over 2 hours

		return {
			name: nextPrayer.name,
			time: nextPrayer.time,
			timeUntil: timeUntil > 0 ? timeUntil : timeUntil + 24 * 60,
			progress,
		};
	};

	const nextPrayer = getNextPrayer();
	const currentOrNextName = nextPrayer.name;

	// Mock settings state
	const [settings, setSettings] = useState<ExtendedPrayerSettings>({
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
	});

	// Mock location
	const location: Location = {
		latitude: 30.0444,
		longitude: 31.2357,
		city: "Cairo",
		country: "Egypt",
		countryCode: "EG",
	};

	// Handle settings changes
	const handleSettingsChange = useCallback(
		(newSettings: Partial<ExtendedPrayerSettings>) => {
			setSettings((prev) => ({ ...prev, ...newSettings }));
		},
		[]
	);

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

					{/* Section 1: Next Prayer Card with Settings Context */}
					<section className="space-y-4">
						<p className="text-center text-muted-foreground text-sm">
							Right-click on the card to open settings
						</p>
						<WidgetSettingsContext
							onSettingsChange={handleSettingsChange}
							settings={settings}
						>
							<div className="flex justify-center">
								<NextPrayerCard
									language={settings.language}
									nextPrayer={nextPrayer}
									nextSize={settings.nextCardSize || "lg"}
									timeFormat24h={settings.timeFormat24h}
								/>
							</div>
						</WidgetSettingsContext>
					</section>

					{/* Section 2: Prayer Grid (All Prayers) with Settings Context */}
					{settings.showOtherPrayers !== false && (
						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">Prayer Grid</h2>
							<p className="text-muted-foreground text-sm">
								Right-click on the grid to open settings. Change "Horizontal
								Prayer List" in settings to toggle layout.
							</p>
							<WidgetSettingsContext
								onSettingsChange={handleSettingsChange}
								settings={settings}
							>
								<PrayerGrid
									currentOrNextName={currentOrNextName}
									dimPreviousPrayers={settings.dimPreviousPrayers}
									horizontalView={settings.horizontalView}
									language={settings.language}
									prayerTimes={prayerTimes}
									size={settings.otherCardSize}
									timeFormat24h={settings.timeFormat24h}
									timezone={settings.timezone}
								/>
							</WidgetSettingsContext>
						</section>
					)}

					{/* Section 4: Minimal Ticker (with rotating azkar) */}
					{!!settings.showTicker && (
						<section className="space-y-4">
							<h2 className="font-semibold text-2xl">Minimal Ticker</h2>
							<p className="text-muted-foreground text-sm">
								The ticker automatically cycles through different azkar
								(remembrances) based on time of day.
							</p>
							<MinimalTicker
								intervalMs={settings.tickerIntervalMs || 5000}
								prayerTimes={prayerTimes}
							/>
						</section>
					)}

					{/* Section 5: Different Sizes */}
					<section className="space-y-4">
						<h2 className="font-semibold text-2xl">Different Sizes</h2>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<WidgetPrayerCard name="Fajr" size="xxs" time="05:30" />
							<WidgetPrayerCard name="Dhuhr" size="xs" time="12:15" />
							<WidgetPrayerCard name="Asr" size="sm" time="15:45" />
							<WidgetPrayerCard name="Maghrib" size="md" time="18:20" />
							<WidgetPrayerCard name="Isha" size="lg" time="19:45" />
						</div>
					</section>
				</div>
			</div>
		</TranslationProvider>
	);
}
