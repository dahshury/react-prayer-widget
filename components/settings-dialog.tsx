"use client";

import { Eye, MapPin, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	type Country,
	CountryDropdown,
} from "@/components/ui/country-dropdown";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RegionDropdown } from "@/components/ui/region-dropdown";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ExtendedPrayerSettings } from "@/hooks/use-prayer-times";
import { useTranslation } from "@/hooks/use-translation";
import {
	getCountryCodeFromTimezone,
	getCountryPrimaryTimezone,
	guessTimezoneFromCountryCode,
} from "@/lib/timezones";

interface SettingsDialogProps {
	settings: ExtendedPrayerSettings & {
		timezone?: string;
		countryCode?: string;
		cityCode?: string;
		locationError?: string;
		showOtherPrayers?: boolean;
		showCity?: boolean;
		showTicker?: boolean;
		showClock?: boolean;
		showDate?: boolean;
		horizontalView?: boolean;
		timeFormat24h?: boolean;
		dimPreviousPrayers?: boolean;
		language?: "en" | "ar";
		autoDetectTimezone?: boolean;
	};
	onSettingsChange: (
		settings: Partial<
			ExtendedPrayerSettings & {
				timezone?: string;
				countryCode?: string;
				cityCode?: string;
				locationError?: string;
				showOtherPrayers?: boolean;
				showCity?: boolean;
				showTicker?: boolean;
				showClock?: boolean;
				showDate?: boolean;
				horizontalView?: boolean;
				timeFormat24h?: boolean;
				dimPreviousPrayers?: boolean;
				language?: "en" | "ar";
				autoDetectTimezone?: boolean;
			}
		>,
	) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

const CALCULATION_METHODS = [
	{ value: 1, label: "University of Islamic Sciences, Karachi" },
	{ value: 2, label: "Islamic Society of North America (ISNA)" },
	{ value: 3, label: "Muslim World League" },
	{ value: 4, label: "Umm Al-Qura University, Makkah" },
	{ value: 5, label: "Egyptian General Authority of Survey" },
	{ value: 7, label: "Institute of Geophysics, University of Tehran" },
	{ value: 8, label: "Gulf Region" },
	{ value: 9, label: "Kuwait" },
	{ value: 10, label: "Qatar" },
	{ value: 11, label: "Majlis Ugama Islam Singapura, Singapore" },
	{ value: 12, label: "Union Organization islamic de France" },
	{ value: 13, label: "Diyanet İşleri Başkanlığı, Turkey" },
];

const ASR_METHODS = [
	{ value: 0, label: "Standard (Shafi, Maliki, Hanbali)" },
	{ value: 1, label: "Hanafi" },
];

export function SettingsDialog({
	settings,
	onSettingsChange,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
}: SettingsDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = controlledOnOpenChange ?? setUncontrolledOpen;
	const { t } = useTranslation();

	const updateOffset = (
		prayer: keyof ExtendedPrayerSettings,
		delta: number,
	) => {
		const currentValue = settings[prayer] as number;
		const newValue = Math.max(-30, Math.min(30, currentValue + delta));
		onSettingsChange({ [prayer]: newValue });
	};

	// OffsetControl is declared below file-level to satisfy lint rule

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t("settings.title")}</DialogTitle>
				</DialogHeader>

				<div className="space-y-5">
					{/* General */}
					<Card className="p-4">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Label className="text-base font-semibold">General</Label>
							</div>
							<div className="grid grid-cols-1 gap-3">
								<div className="space-y-2">
									<Label className="text-sm">{t("settings.language")}</Label>
									<Select
										value={settings.language || "en"}
										onValueChange={(value) =>
											onSettingsChange({ language: value as "en" | "ar" })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="en">English</SelectItem>
											<SelectItem value="ar">العربية</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center justify-between">
									<Label className="text-sm">
										{t("settings.timeFormat24h")}
									</Label>
									<Switch
										checked={settings.timeFormat24h ?? true}
										onCheckedChange={(checked) =>
											onSettingsChange({ timeFormat24h: checked })
										}
									/>
								</div>
							</div>
						</div>
					</Card>

					{/* Location */}
					<Card className="p-4">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								<Label className="text-base font-semibold">
									{t("settings.locationTimezone")}
								</Label>
							</div>
							<div>
								<div className="grid grid-cols-1 gap-3">
									<div className="flex items-center justify-between">
										<Label className="text-sm">
											{t("settings.autoDetectTimezone") ||
												"Auto-detect timezone"}
										</Label>
										<Switch
											checked={settings.autoDetectTimezone ?? false}
											onCheckedChange={(checked) => {
												if (checked) {
													const sysTz =
														Intl.DateTimeFormat().resolvedOptions().timeZone;
													onSettingsChange({
														autoDetectTimezone: true,
														timezone: sysTz,
														countryCode: undefined,
														city: undefined,
														locationError: undefined,
													});
												} else {
													onSettingsChange({ autoDetectTimezone: false });
												}
											}}
										/>
									</div>
									{settings.locationError && (
										<div className="text-xs text-destructive/90">
											{t("settings.locationPermissionDenied")}
										</div>
									)}
									<div className="space-y-1.5">
										<Label className="text-xs mb-1 block">Country</Label>
										<CountryDropdown
											disabled={settings.autoDetectTimezone === true}
											onChange={(country: Country) => {
												const tz =
													getCountryPrimaryTimezone(country.alpha2) ||
													guessTimezoneFromCountryCode(country.alpha2);
												onSettingsChange({
													timezone: tz || settings.timezone || "Asia/Mecca",
													countryCode: country.alpha2,
													city: undefined,
												});
											}}
											selectedAlpha2={(() => {
												const tz = settings.timezone || "Asia/Mecca";
												const code = getCountryCodeFromTimezone(tz);
												return code || settings.countryCode || "SA";
											})()}
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-xs mb-1 block">City</Label>
										<RegionDropdown
											countryCode={
												settings.countryCode ||
												(() => {
													const tz = settings.timezone || "Asia/Mecca";
													return getCountryCodeFromTimezone(tz) || "SA";
												})()
											}
											value={settings.city}
											disabled={settings.autoDetectTimezone === true}
											onChange={(shortCode) => {
												onSettingsChange({ city: shortCode });
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* Display */}
					<Card className="p-4">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Eye className="h-4 w-4" />
								<Label className="text-base font-semibold">
									{t("settings.displayOptions")}
								</Label>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-sm">
										{t("settings.horizontalPrayerList")}
									</Label>
									<Switch
										checked={settings.horizontalView ?? false}
										onCheckedChange={(checked) =>
											onSettingsChange({ horizontalView: checked })
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<Label className="text-sm">
										{t("settings.showOtherPrayers")}
									</Label>
									<Switch
										checked={settings.showOtherPrayers ?? true}
										onCheckedChange={(checked) =>
											onSettingsChange({ showOtherPrayers: checked })
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<Label className="text-sm">{t("settings.showCity")}</Label>
									<Switch
										checked={settings.showCity ?? true}
										onCheckedChange={(checked) =>
											onSettingsChange({ showCity: checked })
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<Label className="text-sm">{t("settings.showTicker")}</Label>
									<Switch
										checked={settings.showTicker ?? true}
										onCheckedChange={(checked) =>
											onSettingsChange({ showTicker: checked })
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<Label className="text-sm">
										{t("settings.showClock") || "Show Clock"}
									</Label>
									<Switch
										checked={settings.showClock ?? true}
										onCheckedChange={(checked) =>
											onSettingsChange({ showClock: checked })
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<Label className="text-sm">{t("settings.showDate")}</Label>
									<Switch
										checked={settings.showDate ?? true}
										onCheckedChange={(checked) =>
											onSettingsChange({ showDate: checked })
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<Label className="text-sm">
										{t("settings.dimPreviousPrayers")}
									</Label>
									<Switch
										checked={settings.dimPreviousPrayers ?? true}
										onCheckedChange={(checked) =>
											onSettingsChange({ dimPreviousPrayers: checked })
										}
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-sm">
										{t("settings.tickerSpeed") || "Ticker change interval"}
									</Label>
									<Select
										value={String(settings.tickerIntervalMs ?? 5000)}
										onValueChange={(value) =>
											onSettingsChange({
												tickerIntervalMs: Number.parseInt(value, 10),
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="3000">3s</SelectItem>
											<SelectItem value="5000">5s</SelectItem>
											<SelectItem value="8000">8s</SelectItem>
											<SelectItem value="10000">10s</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</Card>

					{/* Calculation */}
					<Card className="p-4">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Label className="text-base font-semibold">Calculation</Label>
							</div>
							<div className="space-y-3">
								<div className="space-y-2">
									<Label>{t("settings.calculationMethod")}</Label>
									<Select
										value={settings.calculationMethod.toString()}
										onValueChange={(value) =>
											onSettingsChange({
												calculationMethod: Number.parseInt(value, 10),
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{CALCULATION_METHODS.map((method) => (
												<SelectItem
													key={method.value}
													value={method.value.toString()}
												>
													{method.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label>{t("settings.asrCalculation")}</Label>
									<Select
										value={settings.asrMethod.toString()}
										onValueChange={(value) =>
											onSettingsChange({
												asrMethod: Number.parseInt(value, 10),
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{ASR_METHODS.map((method) => (
												<SelectItem
													key={method.value}
													value={method.value.toString()}
												>
													{method.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</Card>

					{/* Time Adjustments */}
					<Card className="p-2">
						<div className="space-y-2">
							<Label className="text-sm font-semibold">
								{t("settings.timeAdjustments")}
							</Label>
							<p className="text-xs text-muted-foreground">
								{t("settings.timeAdjustmentsHelp")}
							</p>

							<div className="space-y-2">
								<OffsetControl
									label="Fajr"
									value={settings.fajrOffset}
									onChange={(delta) => updateOffset("fajrOffset", delta)}
								/>
								<OffsetControl
									label="Dhuhr"
									value={settings.dhuhrOffset}
									onChange={(delta) => updateOffset("dhuhrOffset", delta)}
								/>
								<OffsetControl
									label="Asr"
									value={settings.asrOffset}
									onChange={(delta) => updateOffset("asrOffset", delta)}
								/>
								<OffsetControl
									label="Maghrib"
									value={settings.maghribOffset}
									onChange={(delta) => updateOffset("maghribOffset", delta)}
								/>
								<OffsetControl
									label="Isha"
									value={settings.ishaOffset}
									onChange={(delta) => updateOffset("ishaOffset", delta)}
								/>
							</div>
						</div>
					</Card>

					{/* Instant-apply settings: removed explicit Done button */}
				</div>
			</DialogContent>
		</Dialog>
	);
}

function OffsetControl({
	label,
	value,
	onChange,
}: {
	label: string;
	value: number;
	onChange: (delta: number) => void;
}) {
	return (
		<div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
			<Label className="text-xs font-medium">{label}</Label>
			<div className="flex items-center gap-1.5">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onChange(-1)}
					disabled={value <= -30}
					className="h-6 w-6 p-0"
				>
					<Minus className="h-3 w-3" />
				</Button>
				<span className="min-w-[2.25rem] text-center text-xs font-mono">
					{value > 0 ? "+" : ""}
					{value}
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={() => onChange(1)}
					disabled={value >= 30}
					className="h-6 w-6 p-0"
				>
					<Plus className="h-3 w-3" />
				</Button>
			</div>
		</div>
	);
}
