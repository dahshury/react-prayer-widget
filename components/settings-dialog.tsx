"use client";

import Color from "color";
import countryRegionDataJson from "country-region-data/dist/data-umd";
import {
	CircleAlert,
	Columns,
	Minus,
	Pause,
	Pipette,
	Plus,
	Rows,
	Volume2,
} from "lucide-react";
import { useRef, useState } from "react";
import {
	Tabs,
	TabsContent,
	TabsContents,
	TabsList,
	TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import {
	CounterMinusButton as CounterMinusButtonPrimitive,
	CounterNumber as CounterNumberPrimitive,
	CounterPlusButton as CounterPlusButtonPrimitive,
	Counter as CounterPrimitive,
} from "@/components/animate-ui/primitives/animate/counter";
import { Toolbar as KToolbar } from "@/components/kokonutui/toolbar";
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
import CompactFileUploader from "@/components/ui/file-uploader";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RegionDropdown } from "@/components/ui/region-dropdown";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ColorPicker,
	ColorPickerAlpha,
	ColorPickerEyeDropper,
	ColorPickerHue,
	ColorPickerOutput,
	ColorPickerSelection,
} from "@/components/ui/shadcn-io/color-picker";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
// import type { ExtendedPrayerSettings } from "@/hooks/use-prayer-times";
import { useTranslation } from "@/hooks/use-translation";
import {
	getAzanSource,
	getCustomAzanGlobalName,
	getCustomAzanName,
	type PrayerName,
	removeCustomAzanFile,
	removeCustomAzanFileGlobal,
	storeCustomAzanFile,
	storeCustomAzanFileGlobal,
} from "@/lib/azan";
import { getCurrentLocation } from "@/lib/prayer-api";
import {
	getCountryCodeFromTimezone,
	getCountryPrimaryTimezone,
	guessTimezoneFromCountryCode,
} from "@/lib/timezones";
import type { AllSettings } from "@/types/settings";

type CRRegion = { name: string; shortCode: string };
type CRCountry = { countryShortCode: string; regions?: CRRegion[] };
type NavigatorWithPermissions = Navigator & {
	permissions?: {
		query: (q: { name: PermissionName }) => Promise<PermissionStatus>;
	};
};

interface SettingsDialogProps {
	settings: AllSettings;
	onSettingsChange: (settings: Partial<AllSettings>) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

const CALCULATION_METHODS = [
	{ value: 1, tKey: "1", fallback: "University of Islamic Sciences, Karachi" },
	{ value: 2, tKey: "2", fallback: "Islamic Society of North America (ISNA)" },
	{ value: 3, tKey: "3", fallback: "Muslim World League" },
	{ value: 4, tKey: "4", fallback: "Umm Al-Qura University, Makkah" },
	{ value: 5, tKey: "5", fallback: "Egyptian General Authority of Survey" },
	{
		value: 7,
		tKey: "7",
		fallback: "Institute of Geophysics, University of Tehran",
	},
	{ value: 8, tKey: "8", fallback: "Gulf Region" },
	{ value: 9, tKey: "9", fallback: "Kuwait" },
	{ value: 10, tKey: "10", fallback: "Qatar" },
	{
		value: 11,
		tKey: "11",
		fallback: "Majlis Ugama Islam Singapura, Singapore",
	},
	{ value: 12, tKey: "12", fallback: "Union Organization islamic de France" },
	{ value: 13, tKey: "13", fallback: "Diyanet İşleri Başkanlığı, Turkey" },
];

const ASR_METHODS = [
	{ value: 0, tKey: "standard", fallback: "Standard (Shafi, Maliki, Hanbali)" },
	{ value: 1, tKey: "hanafi", fallback: "Hanafi" },
];

interface TabCommonProps {
	settings: AllSettings;
	onSettingsChange: (settings: Partial<AllSettings>) => void;
	t: (key: string) => string;
}

function GeneralTab({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
		<Card className="p-4 bg-background text-foreground">
			<div className="space-y-3">
				<div className="grid grid-cols-1 gap-3">
					<div className="flex items-center justify-between gap-3">
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
						<Label className="text-sm">{t("settings.timeFormat24h")}</Label>
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
	);
}

function LocationTab({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
		<Card className="p-4 bg-background text-foreground">
			<div className="space-y-3">
				<div>
					<div className="grid grid-cols-1 gap-3">
						<div className="flex items-center justify-between">
							<Label className="text-sm">
								{t("settings.autoDetectTimezone") || "Auto-detect timezone"}
							</Label>
							<Switch
								checked={settings.autoDetectTimezone ?? false}
								onCheckedChange={async (checked) => {
									const applyMakkahFallback = () => {
										let makkahCode: string | undefined;
										try {
											const sa = (countryRegionDataJson as CRCountry[]).find(
												(c) => c.countryShortCode === "SA",
											);
											const match = sa?.regions?.find(
												(r: CRRegion) =>
													typeof r?.name === "string" &&
													r.name.toLowerCase().includes("makkah"),
											);
											makkahCode = match?.shortCode;
										} catch {
											// ignore
										}
										onSettingsChange({
											autoDetectTimezone: false,
											timezone: "Asia/Mecca",
											countryCode: "SA",
											city: "Makkah Al-Mukarramah",
											cityCode: makkahCode,
											locationError: "geolocation_failed",
										});
									};
									if (checked) {
										// Optimistically show ON, then snap back OFF on failure
										onSettingsChange({
											autoDetectTimezone: true,
											locationError: undefined,
										});
										console.log("🔍 Starting location detection...");

										try {
											// Pre-check permission to avoid throwing inside geolocation callback
											if (
												typeof navigator !== "undefined" &&
												"permissions" in navigator
											) {
												try {
													const perms = (navigator as NavigatorWithPermissions)
														.permissions;
													if (perms && typeof perms.query === "function") {
														const status = await perms.query({
															name: "geolocation" as PermissionName,
														});
														console.log("🔐 Permission status:", status.state);
														if (status.state === "denied") {
															console.log(
																"❌ Permission denied, falling back to Makkah",
															);
															applyMakkahFallback();
															return;
														}
													}
												} catch (e) {
													console.log("⚠️ Permission check error:", e);
												}
											}

											console.log("📍 Getting current location...");
											const detected = await getCurrentLocation(
												settings.language || "en",
												{ strict: false },
											);
											console.log("🌍 Detected location:", detected);

											const sysTz =
												Intl.DateTimeFormat().resolvedOptions().timeZone ||
												"Asia/Mecca";
											console.log("🕐 System timezone:", sysTz);

											// Find matching region code for the detected city
											let cityCode: string | undefined;
											let cityName: string | undefined = detected.city;

											if (detected.countryCode && detected.city) {
												try {
													const country = (
														countryRegionDataJson as CRCountry[]
													).find(
														(c) => c.countryShortCode === detected.countryCode,
													);

													if (country?.regions) {
														const lowerCity = detected.city.toLowerCase();
														// Try exact match first
														let matchedRegion = country.regions.find(
															(r: CRRegion) =>
																r.name.toLowerCase() === lowerCity,
														);

														// If no exact match, try partial match
														if (!matchedRegion) {
															matchedRegion = country.regions.find(
																(r: CRRegion) =>
																	r.name.toLowerCase().includes(lowerCity) ||
																	lowerCity.includes(r.name.toLowerCase()),
															);
														}

														if (matchedRegion) {
															cityCode = matchedRegion.shortCode;
															cityName = matchedRegion.name;
															console.log(
																"✅ Mapped city:",
																cityName,
																"->",
																cityCode,
															);
														}
													}
												} catch (e) {
													console.warn(
														"❌ Failed to match city to region code:",
														e,
													);
												}
											}

											const finalSettings = {
												autoDetectTimezone: true,
												timezone: sysTz,
												countryCode: detected.countryCode || undefined,
												city: cityName || detected.city || undefined,
												cityCode: cityCode,
												locationError: undefined,
											};
											console.log("📝 Final settings to apply:", finalSettings);

											onSettingsChange(finalSettings);
										} catch (e) {
											console.log("💥 Location detection failed:", e);
											applyMakkahFallback();
										}
									} else {
										console.log("🔄 Auto-detect disabled");
										onSettingsChange({ autoDetectTimezone: false });
									}
								}}
							/>
						</div>
						{settings.locationError ? (
							<div className="rounded-md border border-red-500/50 px-4 py-3 text-red-600">
								<p className="text-sm">
									<CircleAlert
										className="me-3 -mt-0.5 inline-flex opacity-60"
										size={16}
										aria-hidden="true"
									/>
									{t("settings.locationPermissionDenied") ||
										"Location/Timezone detection failed. Defaulting to Makkah, Saudi Arabia."}
								</p>
							</div>
						) : null}
						<div className="flex items-center justify-between gap-3">
							<Label className="text-sm">Country</Label>
							<div className="w-[320px]">
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
											cityCode: undefined,
										});
									}}
									selectedAlpha2={(() => {
										// Prefer detected/explicit country code first
										if (settings.countryCode) return settings.countryCode;
										const tz = settings.timezone;
										if (!tz) return undefined as unknown as string;
										const code = getCountryCodeFromTimezone(tz);
										return (code || undefined) as unknown as string;
									})()}
								/>
							</div>
						</div>
						<div className="flex items-center justify-between gap-3">
							<Label className="text-sm">City</Label>
							<div className="w-[320px]">
								<RegionDropdown
									countryCode={(() => {
										if (settings.countryCode) return settings.countryCode;
										const tz = settings.timezone;
										if (!tz) return undefined;
										return getCountryCodeFromTimezone(tz);
									})()}
									value={settings.cityCode}
									disabled={settings.autoDetectTimezone === true}
									onChange={(shortCode, name) => {
										onSettingsChange({ cityCode: shortCode, city: name });
									}}
									preferredName={
										// Use detected city name when auto-detect is on and no cityCode is set
										settings.autoDetectTimezone &&
										!settings.cityCode &&
										settings.city
											? settings.city
											: "Makkah"
									}
									displayOverride={
										!settings.cityCode ? settings.city : undefined
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}

function DisplayTab({ settings, onSettingsChange, t }: TabCommonProps) {
	const safeHex = (val: unknown) => {
		try {
			const c = Array.isArray(val)
				? Color.rgb(
						val as [number, number, number] | [number, number, number, number],
					)
				: Color(String(val || "#ffffff"));
			return c.hex().toLowerCase();
		} catch {
			return "#ffffff";
		}
	};
	return (
		<Card className="p-4 bg-background text-foreground">
			<div className="space-y-3">
				<div className="space-y-3">
					{/* Layout group: center/other card size + app width */}
					<div className="space-y-2 rounded-lg border bg-muted/30 p-3">
						<div className="flex items-center justify-between gap-3">
							<Label className="text-sm">
								{t("settings.centerCardSize") !== "settings.centerCardSize"
									? t("settings.centerCardSize")
									: "Center card height"}
							</Label>
							<Select
								value={settings.nextCardSize || "md"}
								onValueChange={(value) =>
									onSettingsChange({
										nextCardSize: value as "xxs" | "xs" | "sm" | "md" | "lg",
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="xxs">XXS (thinnest)</SelectItem>
									<SelectItem value="xs">XS</SelectItem>
									<SelectItem value="sm">SM</SelectItem>
									<SelectItem value="md">MD</SelectItem>
									<SelectItem value="lg">LG</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center justify-between gap-3">
							<Label className="text-sm">
								{t("settings.otherCardsSize") !== "settings.otherCardsSize"
									? t("settings.otherCardsSize")
									: "Other cards height"}
							</Label>
							<Select
								value={settings.otherCardSize || "sm"}
								onValueChange={(value) =>
									onSettingsChange({
										otherCardSize: value as "xxs" | "xs" | "sm" | "md" | "lg",
									})
								}
							>
								<SelectTrigger
									disabled={!(settings.showOtherPrayers ?? true)}
									aria-disabled={!(settings.showOtherPrayers ?? true)}
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="xxs">XXS (thinnest)</SelectItem>
									<SelectItem value="xs">XS</SelectItem>
									<SelectItem value="sm">SM</SelectItem>
									<SelectItem value="md">MD</SelectItem>
									<SelectItem value="lg">LG</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center justify-between gap-3">
							<Label className="text-sm">
								{t("settings.appWidth") !== "settings.appWidth"
									? t("settings.appWidth")
									: "App width"}
							</Label>
							<Select
								value={settings.appWidth || "xl"}
								onValueChange={(value) => {
									const v = value as
										| "xxs"
										| "xs"
										| "md"
										| "lg"
										| "xl"
										| "2xl"
										| "3xl";
									const narrow = v === "xs" || v === "xxs";
									onSettingsChange({
										appWidth: v,
										showOtherPrayers: narrow
											? false
											: (settings.showOtherPrayers ?? true),
									});
								}}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="xxs">Ultra compact (xxs)</SelectItem>
									<SelectItem value="xs">Extra compact (xs)</SelectItem>
									<SelectItem value="md">Narrow (md)</SelectItem>
									<SelectItem value="lg">Compact (lg)</SelectItem>
									<SelectItem value="xl">Comfort (xl)</SelectItem>
									<SelectItem value="2xl">Wide (2xl)</SelectItem>
									<SelectItem value="3xl">Extra wide (3xl)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Other prayers: toggle + view type */}
					<div className="space-y-2 rounded-lg border bg-muted/30 p-3">
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
							<Label className="text-sm">
								{t("settings.viewType") !== "settings.viewType"
									? t("settings.viewType")
									: "View type"}
							</Label>
							<div
								className={
									!(settings.showOtherPrayers ?? true)
										? "pointer-events-none opacity-50"
										: ""
								}
								aria-disabled={!(settings.showOtherPrayers ?? true)}
							>
								<KToolbar
									className="p-0 border-0 bg-transparent"
									items={[
										{ id: "default", title: "Stacked", icon: Rows },
										{ id: "non-vertical", title: "View", icon: Columns },
									]}
									selectedId={
										settings.horizontalView ? "non-vertical" : "default"
									}
									onSelect={(id) => {
										if (!(settings.showOtherPrayers ?? true)) return;
										onSettingsChange({ horizontalView: id === "non-vertical" });
									}}
									showToggle={false}
									showNotifications={false}
								/>
							</div>
						</div>
					</div>

					{/* City/Clock/Date group */}
					<div className="space-y-2 rounded-lg border bg-muted/30 p-3">
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
					</div>

					{/* Ticker: toggle + interval */}
					<div className="space-y-2 rounded-lg border bg-muted/30 p-3">
						<div className="flex items-center justify-between">
							<Label className="text-sm">{t("settings.showTicker")}</Label>
							<Switch
								checked={settings.showTicker ?? true}
								onCheckedChange={(checked) =>
									onSettingsChange({ showTicker: checked })
								}
							/>
						</div>
						<div className="flex items-center justify-between gap-3">
							<Label className="text-sm">
								{t("settings.tickerSpeed") || "Ticker change interval"}
							</Label>
							<Select
								disabled={!(settings.showTicker ?? true)}
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

					<div className="rounded-lg border bg-muted/30 p-3">
						<div className="flex items-center gap-4 divide-x divide-border">
							<div className="flex items-center gap-2 px-2">
								<Label className="text-sm whitespace-nowrap">Prayer name</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="h-8 w-8 rounded-md p-0 flex items-center justify-center"
											style={{
												backgroundColor: settings.prayerNameColor || "#ffffff",
											}}
											aria-label="Pick prayer name color"
										>
											<Pipette className="h-3.5 w-3.5 opacity-80" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-80">
										<ColorPicker
											value={settings.prayerNameColor || "#ffffff"}
											onChange={(val) =>
												onSettingsChange({ prayerNameColor: safeHex(val) })
											}
										>
											<ColorPickerSelection className="h-28" />
											<div className="flex items-center gap-4">
												<ColorPickerEyeDropper />
												<div className="grid w-full gap-1">
													<ColorPickerHue />
													<ColorPickerAlpha />
												</div>
											</div>
											<div className="flex items-center gap-2">
												<ColorPickerOutput />
											</div>
										</ColorPicker>
									</PopoverContent>
								</Popover>
							</div>
							<div className="flex items-center gap-2 px-2">
								<Label className="text-sm whitespace-nowrap">Prayer time</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="h-8 w-8 rounded-md p-0 flex items-center justify-center"
											style={{
												backgroundColor: settings.prayerTimeColor || "#ffffff",
											}}
											aria-label="Pick prayer time color"
										>
											<Pipette className="h-3.5 w-3.5 opacity-80" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-80">
										<ColorPicker
											value={settings.prayerTimeColor || "#ffffff"}
											onChange={(val) =>
												onSettingsChange({ prayerTimeColor: safeHex(val) })
											}
										>
											<ColorPickerSelection className="h-28" />
											<div className="flex items-center gap-4">
												<ColorPickerEyeDropper />
												<div className="grid w-full gap-1">
													<ColorPickerHue />
													<ColorPickerAlpha />
												</div>
											</div>
											<div className="flex items-center gap-2">
												<ColorPickerOutput />
											</div>
										</ColorPicker>
									</PopoverContent>
								</Popover>
							</div>
							<div className="flex items-center gap-2 px-2">
								<Label className="text-sm whitespace-nowrap">Azan</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="h-8 w-8 rounded-md p-0 flex items-center justify-center"
											style={{
												backgroundColor:
													settings.prayerCountdownColor || "#ffffff",
											}}
											aria-label="Pick azan color"
										>
											<Pipette className="h-3.5 w-3.5 opacity-80" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-80">
										<ColorPicker
											value={settings.prayerCountdownColor || "#ffffff"}
											onChange={(val) =>
												onSettingsChange({ prayerCountdownColor: safeHex(val) })
											}
										>
											<ColorPickerSelection className="h-28" />
											<div className="flex items-center gap-4">
												<ColorPickerEyeDropper />
												<div className="grid w-full gap-1">
													<ColorPickerHue />
													<ColorPickerAlpha />
												</div>
											</div>
											<div className="flex items-center gap-2">
												<ColorPickerOutput />
											</div>
										</ColorPicker>
									</PopoverContent>
								</Popover>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}

function CalculationTab({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
		<Card className="p-4 bg-background text-foreground">
			<div className="space-y-3">
				<div className="space-y-3">
					<div className="flex items-center justify-between gap-3">
						<Label className="text-sm">{t("settings.calculationMethod")}</Label>
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
										{t(`settings.calculationMethodNames.${method.tKey}`) !==
										`settings.calculationMethodNames.${method.tKey}`
											? t(`settings.calculationMethodNames.${method.tKey}`)
											: method.fallback}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center justify-between gap-3">
						<Label className="text-sm">{t("settings.asrCalculation")}</Label>
						<Select
							value={settings.asrMethod.toString()}
							onValueChange={(value) =>
								onSettingsChange({ asrMethod: Number.parseInt(value, 10) })
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
										{t(`settings.asrMethods.${method.tKey}`) !==
										`settings.asrMethods.${method.tKey}`
											? t(`settings.asrMethods.${method.tKey}`)
											: method.fallback}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label className="text-sm font-semibold">
							{t("settings.timeAdjustments")}
						</Label>
						<p className="text-xs text-muted-foreground">
							{t("settings.timeAdjustmentsHelp")}
						</p>
						<div
							className="space-y-1 rounded-md p-2"
							style={{ backgroundColor: "#161921" }}
						>
							<OffsetControl
								unstyled
								label="Fajr"
								value={settings.fajrOffset}
								onChange={(d) =>
									onSettingsChange({
										fajrOffset: (settings.fajrOffset || 0) + d,
									})
								}
							/>
							<OffsetControl
								unstyled
								label="Dhuhr"
								value={settings.dhuhrOffset}
								onChange={(d) =>
									onSettingsChange({
										dhuhrOffset: (settings.dhuhrOffset || 0) + d,
									})
								}
							/>
							<OffsetControl
								unstyled
								label="Asr"
								value={settings.asrOffset}
								onChange={(d) =>
									onSettingsChange({ asrOffset: (settings.asrOffset || 0) + d })
								}
							/>
							<OffsetControl
								unstyled
								label="Maghrib"
								value={settings.maghribOffset}
								onChange={(d) =>
									onSettingsChange({
										maghribOffset: (settings.maghribOffset || 0) + d,
									})
								}
							/>
							<OffsetControl
								unstyled
								label="Isha"
								value={settings.ishaOffset}
								onChange={(d) =>
									onSettingsChange({
										ishaOffset: (settings.ishaOffset || 0) + d,
									})
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}

function AzanTab({ settings, onSettingsChange }: TabCommonProps) {
	const { t } = useTranslation();
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [previewingKey, setPreviewingKey] = useState<string | null>(null);
	const ensureAudio = () => {
		if (!audioRef.current) audioRef.current = new Audio();
		audioRef.current.volume = Math.min(
			1,
			Math.max(0, settings.azanVolume ?? 1),
		);
		// Ensure we clear preview state when audio finishes
		audioRef.current.onended = () => {
			setPreviewingKey(null);
		};
		return audioRef.current;
	};
	const stopAudio = () => {
		if (!audioRef.current) return;
		try {
			audioRef.current.pause();
		} catch {}
		try {
			audioRef.current.currentTime = 0;
		} catch {}
	};
	const playSrc = (src: string | null, key: string) => {
		if (!src) return;
		const audio = ensureAudio();
		try {
			audio.pause();
			audio.currentTime = 0;
		} catch {}
		if (audio.src !== src) audio.src = src;
		void audio
			.play()
			.then(() => setPreviewingKey(key))
			.catch(() => {});
	};
	const togglePreviewGlobal = () => {
		if (settings.azanPerPrayer) return;
		const key = `global`;
		if (previewingKey === key) {
			setPreviewingKey(null);
			stopAudio();
			return;
		}
		const choice = settings.azanGlobalChoice || "default";
		const src = getAzanSource(choice, "Dhuhr");
		playSrc(src, key);
	};
	const prayers: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
	const handleUpload = async (p: PrayerName, file: File) => {
		const { name } = await storeCustomAzanFile(p, file);
		onSettingsChange({
			azanByPrayer: { ...(settings.azanByPrayer || {}), [p]: `custom:${p}` },
			azanCustomNames: { ...(settings.azanCustomNames || {}), [p]: name },
		});
		// Auto preview uploaded file for that prayer
		if ((settings.azanPerPrayer ?? false) && settings.azanEnabled !== false) {
			setPreviewingKey(null);
			stopAudio();
			const src = getAzanSource(`custom:${p}`, p);
			playSrc(src, `prayer:${p}`);
		}
	};
	const handleRemove = (p: PrayerName) => {
		removeCustomAzanFile(p);
		const next = { ...(settings.azanByPrayer || {}) };
		delete next[p];
		const nextNames = { ...(settings.azanCustomNames || {}) };
		delete nextNames[p];
		onSettingsChange({ azanByPrayer: next, azanCustomNames: nextNames });
	};
	return (
		<Card className="p-4 bg-background text-foreground">
			<div className="space-y-3">
				<div className="space-y-2 rounded-lg border bg-muted/30 p-3">
					<div className="flex items-center justify-between">
						<Label className="text-sm">
							{t("azan.enable") || "Enable Azan"}
						</Label>
						<Switch
							checked={settings.azanEnabled ?? true}
							onCheckedChange={(checked) => {
								if (!checked) {
									setPreviewingKey(null);
									stopAudio();
								}
								onSettingsChange({ azanEnabled: checked });
							}}
						/>
					</div>
					<div
						className={`${
							settings.azanEnabled === false
								? "opacity-50 pointer-events-none "
								: ""
						}flex items-center justify-between gap-3`}
					>
						<Label className="text-sm">{t("azan.volume") || "Volume"}</Label>
						<div className="w-[280px]">
							<Slider
								value={[Math.round((settings.azanVolume ?? 1) * 100)]}
								min={0}
								max={100}
								onValueChange={(vals) => {
									const v = (vals?.[0] ?? 100) / 100;
									onSettingsChange({ azanVolume: v });
									if (audioRef.current)
										audioRef.current.volume = Math.min(1, Math.max(0, v));
								}}
							/>
						</div>
					</div>
				</div>

				<div
					className={`${
						settings.azanEnabled === false
							? "opacity-50 pointer-events-none "
							: ""
					}space-y-2 rounded-lg border bg-muted/30 p-3`}
				>
					<div className="flex items-center justify-between gap-3">
						<Label className="text-sm">{t("azan.type") || "Azan type"}</Label>
						<div className="flex items-center gap-2">
							<Select
								value={
									settings.azanGlobalChoice && settings.azanGlobalChoice !== ""
										? settings.azanGlobalChoice
										: "default"
								}
								onValueChange={(v) => {
									const next = v || "default";
									onSettingsChange({ azanGlobalChoice: next });
									// Restart preview with newly selected type when applicable
									setPreviewingKey(null);
									stopAudio();
									if (
										!settings.azanPerPrayer &&
										settings.azanEnabled !== false
									) {
										const src = getAzanSource(next, "Dhuhr");
										playSrc(src, "global");
									}
								}}
							>
								<SelectTrigger
									className={`${
										settings.azanPerPrayer
											? "pointer-events-none opacity-50"
											: ""
									} w-[220px]`}
									aria-disabled={settings.azanPerPrayer === true}
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="default">
										{t("azan.full") || "Full"}
									</SelectItem>
									<SelectItem value="short">
										{t("azan.short") || "Short"}
									</SelectItem>
									<SelectItem value="beep">
										{t("azan.beepOnly") || "Beep only"}
									</SelectItem>
									{(() => {
										const gName =
											settings.azanGlobalCustomName ||
											getCustomAzanGlobalName();
										return gName ? (
											<SelectItem value="custom:global">{gName}</SelectItem>
										) : null;
									})()}
								</SelectContent>
							</Select>
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={
									settings.azanPerPrayer || settings.azanEnabled === false
								}
								onClick={togglePreviewGlobal}
								aria-label="Preview azan"
							>
								{previewingKey === "global" ? (
									<Pause className="h-4 w-4" />
								) : (
									<Volume2 className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>
					<div className="flex items-center justify-between gap-3">
						<Label className="text-sm">
							{t("azan.customOverride") || "Custom (overrides all)"}
						</Label>
						<div className="w-[260px] sm:w-[300px] max-w-full min-w-0">
							<CompactFileUploader
								accept={[
									"audio/mpeg",
									"audio/mp3",
									"audio/wav",
									"audio/x-wav",
									"audio/webm",
									"audio/ogg",
								]}
								onSelect={async (file) => {
									const res = await storeCustomAzanFileGlobal(file);
									onSettingsChange({
										azanGlobalChoice: "custom:global",
										azanGlobalCustomName: res.name,
									});
									// Immediately preview the uploaded global custom
									setPreviewingKey(null);
									stopAudio();
									if (
										!settings.azanPerPrayer &&
										settings.azanEnabled !== false
									) {
										const src = getAzanSource("custom:global", "Dhuhr");
										playSrc(src, "global");
									}
								}}
								onRemove={() => {
									removeCustomAzanFileGlobal();
									onSettingsChange({
										azanGlobalChoice: "default",
										azanGlobalCustomName: undefined,
									});
									// Stop any ongoing global preview
									if (previewingKey === "global") {
										setPreviewingKey(null);
										stopAudio();
									}
								}}
								disabled={
									settings.azanPerPrayer || settings.azanEnabled === false
								}
								className="w-full"
							/>
							{settings.azanGlobalCustomName || getCustomAzanGlobalName() ? (
								<div className="text-xs text-muted-foreground mt-1 truncate">
									{t("azan.selected") || "Selected:"}{" "}
									{settings.azanGlobalCustomName || getCustomAzanGlobalName()}
								</div>
							) : null}
						</div>
					</div>
				</div>

				<div
					className={`${
						settings.azanEnabled === false
							? "opacity-50 pointer-events-none "
							: ""
					}space-y-2 rounded-lg border bg-muted/30 p-3`}
				>
					<div className="flex items-center justify-between">
						<Label className="text-sm font-semibold">
							{t("azan.perPrayer") || "Per‑prayer"}
						</Label>
						<Switch
							checked={settings.azanPerPrayer ?? false}
							onCheckedChange={(checked) => {
								if (!checked) {
									setPreviewingKey(null);
									stopAudio();
								}
								onSettingsChange({ azanPerPrayer: checked });
							}}
						/>
					</div>
					<div className="grid grid-cols-1 gap-3">
						{prayers.map((p) => {
							const customName =
								settings.azanCustomNames?.[p] || getCustomAzanName(p);
							const globalName =
								settings.azanGlobalCustomName || getCustomAzanGlobalName();
							const value =
								settings.azanByPrayer?.[p] ||
								(p === "Fajr" ? "fajr" : "default");
							const disabled = !(settings.azanPerPrayer ?? false);
							const allDisabled = !(settings.azanEnabled ?? true);
							return (
								<div key={p} className="flex items-start justify-between gap-3">
									<Label className="text-sm w-20 pt-2">{p}</Label>
									<div className="flex-1 flex flex-col gap-2">
										<div className="flex items-center gap-3 flex-wrap">
											<Select
												value={String(value)}
												onValueChange={(v) => {
													onSettingsChange({
														azanByPrayer: {
															...(settings.azanByPrayer || {}),
															[p]: v,
														},
													});
													// Restart preview for this specific prayer with new type
													setPreviewingKey(null);
													stopAudio();
													if (
														(settings.azanPerPrayer ?? false) &&
														settings.azanEnabled !== false
													) {
														const src = getAzanSource(v, p);
														playSrc(src, `prayer:${p}`);
													}
												}}
											>
												<SelectTrigger
													className={`${
														disabled || allDisabled
															? "pointer-events-none opacity-50"
															: ""
													} w-[220px]`}
													aria-disabled={disabled || allDisabled}
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="default">
														{t("azan.full") || "Full"}
													</SelectItem>
													<SelectItem value="short">
														{t("azan.short") || "Short"}
													</SelectItem>
													<SelectItem value="beep">
														{t("azan.beepOnly") || "Beep only"}
													</SelectItem>
													<SelectItem value={`custom:${p}`}>
														{customName ||
															t("azan.customFile") ||
															"Custom file"}
													</SelectItem>
													{globalName ? (
														<SelectItem value="custom:global">
															{globalName}
														</SelectItem>
													) : null}
												</SelectContent>
											</Select>
											<Button
												type="button"
												variant="outline"
												size="sm"
												disabled={
													allDisabled || !(settings.azanPerPrayer ?? false)
												}
												onClick={() => {
													const key = `prayer:${p}`;
													if (previewingKey === key) {
														setPreviewingKey(null);
														stopAudio();
														return;
													}
													const effectiveChoice = settings.azanPerPrayer
														? settings.azanByPrayer?.[p] || "default"
														: settings.azanGlobalChoice || "default";
													const src = getAzanSource(effectiveChoice, p);
													playSrc(src, key);
												}}
												aria-label={`Preview ${p} azan`}
											>
												{previewingKey === `prayer:${p}` ? (
													<Pause className="h-4 w-4" />
												) : (
													<Volume2 className="h-4 w-4" />
												)}
											</Button>
											<div
												className={`${
													disabled || allDisabled
														? "pointer-events-none opacity-50"
														: ""
												} w-[260px] sm:w-[300px] max-w-full min-w-0`}
												aria-disabled={disabled || allDisabled}
											>
												<CompactFileUploader
													accept={[
														"audio/mpeg",
														"audio/mp3",
														"audio/wav",
														"audio/x-wav",
														"audio/webm",
														"audio/ogg",
													]}
													onSelect={(file) => void handleUpload(p, file)}
													onRemove={() => handleRemove(p)}
													disabled={allDisabled || disabled}
													className="w-full"
												/>
												{customName ? (
													<div className="text-xs text-muted-foreground mt-1">
														{t("azan.selected") || "Selected:"} {customName}
													</div>
												) : null}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Card>
	);
}

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

	const tt = (key: string, fallback: string) => {
		const v = t(key);
		return v === key ? fallback : v;
	};

	const generalLabel = tt("settings.general", "General");
	const locationLabel = tt("settings.locationTimezone", "Location");
	const displayLabel = tt("settings.displayOptions", "Display");
	const calculationLabel = tt("settings.calculation", "Calculation");
	const azanLabel = tt("settings.azan", "Azan");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="w-[960px] max-w-[98vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
				<DialogHeader>
					<DialogTitle>{tt("settings.title", "Settings")}</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue="General" className="w-full">
					<div className="w-full flex justify-center">
						<TabsList>
							<TabsTrigger value="General">{generalLabel}</TabsTrigger>
							<TabsTrigger value="Location">{locationLabel}</TabsTrigger>
							<TabsTrigger value="Display">{displayLabel}</TabsTrigger>
							<TabsTrigger value="Azan">{azanLabel}</TabsTrigger>
							<TabsTrigger value="Calculation">{calculationLabel}</TabsTrigger>
						</TabsList>
					</div>
					<TabsContents className="mt-3">
						<TabsContent value="General">
							<GeneralTab
								settings={settings}
								onSettingsChange={onSettingsChange}
								t={t}
							/>
						</TabsContent>
						<TabsContent value="Location">
							<LocationTab
								settings={settings}
								onSettingsChange={onSettingsChange}
								t={t}
							/>
						</TabsContent>
						<TabsContent value="Display">
							<DisplayTab
								settings={settings}
								onSettingsChange={onSettingsChange}
								t={t}
							/>
						</TabsContent>
						<TabsContent value="Azan">
							<AzanTab
								settings={settings}
								onSettingsChange={onSettingsChange}
								t={t}
							/>
						</TabsContent>
						<TabsContent value="Calculation">
							<CalculationTab
								settings={settings}
								onSettingsChange={onSettingsChange}
								t={t}
							/>
						</TabsContent>
					</TabsContents>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}

function OffsetControl({
	label,
	value,
	onChange,
	unstyled,
	className,
}: {
	label: string;
	value: number;
	onChange: (delta: number) => void;
	unstyled?: boolean;
	className?: string;
}) {
	const rowClass = `${"flex items-center justify-between p-2"}${unstyled ? "" : " bg-muted/50 rounded-md"}${className ? ` ${className}` : ""}`;
	return (
		<div className={rowClass}>
			<Label className="text-xs font-medium">{label}</Label>
			<CounterPrimitive
				className="flex items-center gap-1.5"
				value={value}
				onValueChange={(next) => {
					if (next < -30 || next > 30) return;
					const delta = next - value;
					if (delta !== 0) onChange(delta);
				}}
			>
				<CounterMinusButtonPrimitive asChild>
					<Button
						variant="outline"
						size="sm"
						disabled={value <= -30}
						className="h-6 w-6 p-0"
						type="button"
					>
						<Minus className="h-3 w-3" />
					</Button>
				</CounterMinusButtonPrimitive>
				<span className="min-w-[2.25rem] text-center text-xs font-mono">
					{value > 0 ? "+" : ""}
					<CounterNumberPrimitive />
				</span>
				<CounterPlusButtonPrimitive asChild>
					<Button
						variant="outline"
						size="sm"
						disabled={value >= 30}
						className="h-6 w-6 p-0"
						type="button"
					>
						<Plus className="h-3 w-3" />
					</Button>
				</CounterPlusButtonPrimitive>
			</CounterPrimitive>
		</div>
	);
}
