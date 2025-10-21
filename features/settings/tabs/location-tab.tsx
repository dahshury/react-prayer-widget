"use client";

import { CircleAlert } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { type Country, CountryDropdown } from "@/shared/ui/country-dropdown";
import { Label } from "@/shared/ui/label";
import { RegionDropdown } from "@/shared/ui/region-dropdown";
import { Switch } from "@/shared/ui/switch";
import { useLocationDetection } from "../hooks/use-location-detection";
import type { TabCommonProps } from "../types";

export function LocationTab({ settings, onSettingsChange, t }: TabCommonProps) {
	const locationDetection = useLocationDetection();

	return (
		<Card className="bg-background p-4 text-foreground">
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
									if (checked) {
										// Optimistically show ON, then snap back OFF on failure
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
								}}
							/>
						</div>
						{settings.locationError ? (
							<div className="rounded-md border border-red-500/50 px-4 py-3 text-red-600">
								<p className="text-sm">
									<CircleAlert
										aria-hidden="true"
										className="-mt-0.5 me-3 inline-flex opacity-60"
										size={16}
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
										const tz = locationDetection.getTimezoneForCountry(
											country.alpha2
										);
										onSettingsChange({
											timezone: tz || settings.timezone || "Asia/Mecca",
											countryCode: country.alpha2,
											city: undefined,
											cityCode: undefined,
										});
									}}
									selectedAlpha2={(() =>
										locationDetection.getCountryCodeFromSettings(settings) ||
										(undefined as unknown as string))()}
								/>
							</div>
						</div>
						<div className="flex items-center justify-between gap-3">
							<Label className="text-sm">City</Label>
							<div className="w-[320px]">
								<RegionDropdown
									countryCode={
										locationDetection.getCountryCodeFromSettings(settings) ||
										undefined
									}
									disabled={settings.autoDetectTimezone === true}
									displayOverride={
										settings.cityCode ? undefined : settings.city
									}
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
									value={settings.cityCode}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
