"use client";

import { CircleAlert, Globe, MapPin } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { type Country, CountryDropdown } from "@/shared/ui/country-dropdown";
import { Label } from "@/shared/ui/label";
import { RegionDropdown } from "@/shared/ui/region-dropdown";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import type { TabCommonProps } from "../../model/types";
import { useLocationDetection } from "../../model/use-location-detection";

function Section({
	title,
	icon: Icon,
	children,
	className,
}: {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"space-y-4 rounded-xl border border-muted/40 bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 p-5 shadow-sm backdrop-blur-sm",
				className
			)}
		>
			<div className="flex items-center gap-2 border-muted/50 border-b pb-3">
				<Icon className="h-4 w-4 text-amber-400/80" />
				<h3 className="font-semibold text-foreground text-sm">{title}</h3>
			</div>
			<div className="space-y-4">{children}</div>
		</div>
	);
}

function SettingRow({
	label,
	children,
	description,
}: {
	label: string;
	children: React.ReactNode;
	description?: string | null;
}) {
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between gap-4">
				<div className="flex-1">
					<Label className="font-medium text-foreground text-sm">{label}</Label>
					{description ? (
						<p className="mt-0.5 text-muted-foreground text-xs">
							{description}
						</p>
					) : null}
				</div>
				<div className="shrink-0">{children}</div>
			</div>
		</div>
	);
}

function LanguageSection({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
		<Section icon={Globe} title={t("settings.language") || "Language & Format"}>
			<SettingRow label={t("settings.language") || "Language"}>
				<Select
					onValueChange={(value) =>
						onSettingsChange({ language: value as "en" | "ar" })
					}
					value={settings.language || "en"}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="en">English</SelectItem>
						<SelectItem value="ar">العربية</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingRow label={t("settings.timeFormat24h") || "24-hour Time"}>
				<Switch
					checked={settings.timeFormat24h ?? true}
					onCheckedChange={(checked) =>
						onSettingsChange({ timeFormat24h: checked })
					}
				/>
			</SettingRow>
		</Section>
	);
}

function LocationSection({
	settings,
	onSettingsChange,
	t,
	locationDetection,
	preferredCityName,
}: TabCommonProps & {
	locationDetection: ReturnType<typeof useLocationDetection>;
	preferredCityName: string;
}) {
	const handleAutoDetectChange = async (checked: boolean) => {
		if (checked) {
			onSettingsChange({
				autoDetectTimezone: true,
				locationError: undefined,
			});

			try {
				const result = await locationDetection.detectLocation(
					settings.language || "en"
				);
				onSettingsChange(result);
			} catch (_e) {
				onSettingsChange(locationDetection.applyMakkahFallback());
			}
		} else {
			onSettingsChange({ autoDetectTimezone: false });
		}
	};

	const handleCountryChange = (country: Country) => {
		const tz = locationDetection.getTimezoneForCountry(country.alpha2);
		onSettingsChange({
			timezone: tz || settings.timezone || "Asia/Mecca",
			countryCode: country.alpha2,
			city: undefined,
			cityCode: undefined,
		});
	};

	const handleCityChange = (shortCode: string, name: string) => {
		onSettingsChange({ cityCode: shortCode, city: name });
	};

	return (
		<Section
			icon={MapPin}
			title={t("settings.autoDetectTimezone") || "Location & Timezone"}
		>
			<SettingRow
				description="Automatically detect your location and timezone"
				label={t("settings.autoDetectTimezone") || "Auto-detect timezone"}
			>
				<Switch
					checked={settings.autoDetectTimezone ?? false}
					onCheckedChange={handleAutoDetectChange}
				/>
			</SettingRow>
			{settings.locationError ? (
				<div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
					<div className="flex items-start gap-2">
						<CircleAlert
							aria-hidden="true"
							className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
						/>
						<p className="text-red-600 text-sm dark:text-red-400">
							{t("settings.locationPermissionDenied") ||
								"Location permission denied. Auto-detect is off. Defaulting to Makkah Al-Mukarramah, Saudi Arabia."}
						</p>
					</div>
				</div>
			) : null}
			<SettingRow
				description={
					settings.autoDetectTimezone
						? "Disabled when auto-detect is enabled"
						: null
				}
				label="Country"
			>
				<div className="w-[280px]">
					<CountryDropdown
						disabled={settings.autoDetectTimezone === true}
						onChange={handleCountryChange}
						selectedAlpha2={(() =>
							locationDetection.getCountryCodeFromSettings(settings) ||
							(undefined as unknown as string))()}
					/>
				</div>
			</SettingRow>
			<SettingRow
				description={
					settings.autoDetectTimezone
						? "Disabled when auto-detect is enabled"
						: null
				}
				label="City"
			>
				<div className="w-[280px]">
					<RegionDropdown
						countryCode={
							locationDetection.getCountryCodeFromSettings(settings) ||
							undefined
						}
						disabled={settings.autoDetectTimezone === true}
						displayOverride={settings.cityCode ? undefined : settings.city}
						onChange={handleCityChange}
						preferredName={preferredCityName}
						value={settings.cityCode}
					/>
				</div>
			</SettingRow>
		</Section>
	);
}

export function GeneralTab({ settings, onSettingsChange, t }: TabCommonProps) {
	const locationDetection = useLocationDetection();
	const preferredCityName =
		settings.autoDetectTimezone && !settings.cityCode && settings.city
			? (settings.city ?? "Makkah")
			: "Makkah";

	return (
		<div className="space-y-6">
			<LanguageSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<LocationSection
				locationDetection={locationDetection}
				onSettingsChange={onSettingsChange}
				preferredCityName={preferredCityName}
				settings={settings}
				t={t}
			/>
		</div>
	);
}
