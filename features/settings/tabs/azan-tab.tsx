"use client";

import { Pause, Volume2 } from "lucide-react";
import { useTranslation } from "@/shared/libs/hooks/use-translation";
import {
	getAzanSource,
	getCustomAzanGlobalName,
	getCustomAzanName,
	type PrayerName,
	removeCustomAzanFileGlobal,
} from "@/shared/libs/prayer/azan";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import CompactFileUploader from "@/shared/ui/file-uploader";
import { Label } from "@/shared/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import { useAzanPlayer } from "../hooks/use-azan-player";
import type { TabCommonProps } from "../types";

// Constants
const VOLUME_SLIDER_MAX = 100;
const VOLUME_SLIDER_MIN = 0;
const VOLUME_SCALE_FACTOR = 100;
const MAX_AUDIO_VOLUME = 1;
const MIN_AUDIO_VOLUME = 0;
const DEFAULT_FAJR_CHOICE = "fajr";
const DEFAULT_CHOICE = "default";
const SLIDER_WIDTH = 280;
const TRIGGER_WIDTH = 220;
const UPLOADER_WIDTH = 260;
const UPLOADER_WIDTH_SM = 300;

// Helper function: Check if azan is disabled
function isAzanDisabled(azanEnabled: boolean | undefined): boolean {
	return azanEnabled === false;
}

// Helper function: Handle global azan selection change
function handleGlobalAzanChange(
	choice: string,
	settings: TabCommonProps["settings"],
	onSettingsChange: TabCommonProps["onSettingsChange"],
	azanPlayer: ReturnType<typeof useAzanPlayer>
) {
	const next = choice || DEFAULT_CHOICE;
	onSettingsChange({ azanGlobalChoice: next });
	azanPlayer.setPreviewingKey(null);
	azanPlayer.stopAudio();
	if (!settings.azanPerPrayer && settings.azanEnabled !== false) {
		const src = getAzanSource(next, "Dhuhr");
		azanPlayer.playSrc(src, "global");
	}
}

// Helper function: Handle custom file upload for global azan
async function handleGlobalFileUpload(
	file: File,
	settings: TabCommonProps["settings"],
	onSettingsChange: TabCommonProps["onSettingsChange"],
	azanPlayer: ReturnType<typeof useAzanPlayer>
) {
	const { storeCustomAzanFileGlobal } = await import(
		"@/shared/libs/prayer/azan"
	);
	const res = await storeCustomAzanFileGlobal(file);
	onSettingsChange({
		azanGlobalChoice: "custom:global",
		azanGlobalCustomName: res.name,
	});
	azanPlayer.setPreviewingKey(null);
	azanPlayer.stopAudio();
	if (!settings.azanPerPrayer && settings.azanEnabled !== false) {
		const src = getAzanSource("custom:global", "Dhuhr");
		azanPlayer.playSrc(src, "global");
	}
}

// Helper component: Global Azan Select
function GlobalAzanSelect({
	settings,
	onSettingsChange,
	azanPlayer,
	t,
}: {
	settings: TabCommonProps["settings"];
	onSettingsChange: TabCommonProps["onSettingsChange"];
	azanPlayer: ReturnType<typeof useAzanPlayer>;
	t: (key: string) => string | null;
}) {
	const gName = settings.azanGlobalCustomName || getCustomAzanGlobalName();

	return (
		<Select
			onValueChange={(v) =>
				handleGlobalAzanChange(v, settings, onSettingsChange, azanPlayer)
			}
			value={
				settings.azanGlobalChoice && settings.azanGlobalChoice !== ""
					? settings.azanGlobalChoice
					: DEFAULT_CHOICE
			}
		>
			<SelectTrigger
				aria-disabled={settings.azanPerPrayer === true}
				className={`${
					settings.azanPerPrayer ? "pointer-events-none opacity-50" : ""
				} w-[${TRIGGER_WIDTH}px]`}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={DEFAULT_CHOICE}>
					{t("azan.full") || "Full"}
				</SelectItem>
				<SelectItem value="short">{t("azan.short") || "Short"}</SelectItem>
				<SelectItem value="beep">
					{t("azan.beepOnly") || "Beep only"}
				</SelectItem>
				{gName ? <SelectItem value="custom:global">{gName}</SelectItem> : null}
			</SelectContent>
		</Select>
	);
}

// Helper component: Global Azan Section
function GlobalAzanSection({
	settings,
	onSettingsChange,
	t,
	azanPlayer,
}: {
	settings: TabCommonProps["settings"];
	onSettingsChange: TabCommonProps["onSettingsChange"];
	t: (key: string) => string | null;
	azanPlayer: ReturnType<typeof useAzanPlayer>;
}) {
	const disabled = isAzanDisabled(settings.azanEnabled);

	return (
		<div
			className={`${
				disabled ? "pointer-events-none opacity-50" : ""
			}space-y-2 rounded-lg border bg-muted/30 p-3`}
		>
			{/* Global azan type section */}
			<div className="flex items-center justify-between gap-3">
				<Label className="text-sm">{t("azan.type") || "Azan type"}</Label>
				<div className="flex items-center gap-2">
					<GlobalAzanSelect
						azanPlayer={azanPlayer}
						onSettingsChange={onSettingsChange}
						settings={settings}
						t={t}
					/>
					<Button
						aria-label="Preview azan"
						disabled={settings.azanPerPrayer || settings.azanEnabled === false}
						onClick={azanPlayer.togglePreviewGlobal}
						size="sm"
						type="button"
						variant="outline"
					>
						{azanPlayer.previewingKey === "global" ? (
							<Pause className="h-4 w-4" />
						) : (
							<Volume2 className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>

			{/* Custom file upload section */}
			<div className="flex items-center justify-between gap-3">
				<Label className="text-sm">
					{t("azan.customOverride") || "Custom (overrides all)"}
				</Label>
				<div
					className={`w-[${UPLOADER_WIDTH}px] min-w-0 max-w-full sm:w-[${UPLOADER_WIDTH_SM}px]`}
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
						className="w-full"
						disabled={settings.azanPerPrayer || settings.azanEnabled === false}
						onRemove={() => {
							removeCustomAzanFileGlobal();
							onSettingsChange({
								azanGlobalChoice: DEFAULT_CHOICE,
								azanGlobalCustomName: undefined,
							});
							if (azanPlayer.previewingKey === "global") {
								azanPlayer.setPreviewingKey(null);
								azanPlayer.stopAudio();
							}
						}}
						onSelect={async (file) => {
							await handleGlobalFileUpload(
								file,
								settings,
								onSettingsChange,
								azanPlayer
							);
						}}
					/>
					{settings.azanGlobalCustomName || getCustomAzanGlobalName() ? (
						<div className="mt-1 truncate text-muted-foreground text-xs">
							{t("azan.selected") || "Selected:"}{" "}
							{settings.azanGlobalCustomName || getCustomAzanGlobalName()}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

export function AzanTab({ settings, onSettingsChange }: TabCommonProps) {
	const { t } = useTranslation();
	const azanPlayer = useAzanPlayer(settings);

	const prayers: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
	const azanDisabled = isAzanDisabled(settings.azanEnabled);

	return (
		<Card className="bg-background p-4 text-foreground">
			<div className="space-y-3">
				{/* Enable/Volume section */}
				<div className="space-y-2 rounded-lg border bg-muted/30 p-3">
					<div className="flex items-center justify-between">
						<Label className="text-sm">
							{t("azan.enable") || "Enable Azan"}
						</Label>
						<Switch
							checked={settings.azanEnabled ?? true}
							onCheckedChange={(checked) => {
								if (!checked) {
									azanPlayer.setPreviewingKey(null);
									azanPlayer.stopAudio();
								}
								onSettingsChange({ azanEnabled: checked });
							}}
						/>
					</div>
					<div
						className={`${
							azanDisabled ? "pointer-events-none opacity-50" : ""
						}flex items-center justify-between gap-3`}
					>
						<Label className="text-sm">{t("azan.volume") || "Volume"}</Label>
						<div className={`w-[${SLIDER_WIDTH}px]`}>
							<Slider
								max={VOLUME_SLIDER_MAX}
								min={VOLUME_SLIDER_MIN}
								onValueChange={(vals) => {
									const v =
										(vals?.[0] ?? VOLUME_SLIDER_MAX) / VOLUME_SCALE_FACTOR;
									onSettingsChange({ azanVolume: v });
									if (azanPlayer.audioRef.current) {
										azanPlayer.audioRef.current.volume = Math.min(
											MAX_AUDIO_VOLUME,
											Math.max(MIN_AUDIO_VOLUME, v)
										);
									}
								}}
								value={[
									Math.round((settings.azanVolume ?? 1) * VOLUME_SCALE_FACTOR),
								]}
							/>
						</div>
					</div>
				</div>

				{/* Global Azan Section */}
				<GlobalAzanSection
					azanPlayer={azanPlayer}
					onSettingsChange={onSettingsChange}
					settings={settings}
					t={t}
				/>

				{/* Per-Prayer Section */}
				<PerPrayerSection
					azanPlayer={azanPlayer}
					onSettingsChange={onSettingsChange}
					prayers={prayers}
					settings={settings}
					t={t}
				/>
			</div>
		</Card>
	);
}

// Helper component: Per-Prayer Azan Section
function PerPrayerSection({
	settings,
	onSettingsChange,
	t,
	azanPlayer,
	prayers,
}: {
	settings: TabCommonProps["settings"];
	onSettingsChange: TabCommonProps["onSettingsChange"];
	t: (key: string) => string | null;
	azanPlayer: ReturnType<typeof useAzanPlayer>;
	prayers: PrayerName[];
}) {
	const azanDisabled = isAzanDisabled(settings.azanEnabled);

	return (
		<div
			className={`${
				azanDisabled ? "pointer-events-none opacity-50" : ""
			}space-y-2 rounded-lg border bg-muted/30 p-3`}
		>
			<div className="flex items-center justify-between">
				<Label className="font-semibold text-sm">
					{t("azan.perPrayer") || "Per‑prayer"}
				</Label>
				<Switch
					checked={settings.azanPerPrayer ?? false}
					onCheckedChange={(checked) => {
						if (!checked) {
							azanPlayer.setPreviewingKey(null);
							azanPlayer.stopAudio();
						}
						onSettingsChange({ azanPerPrayer: checked });
					}}
				/>
			</div>
			<div className="grid grid-cols-1 gap-3">
				{prayers.map((p) => (
					<PrayerAzanControl
						azanDisabled={azanDisabled}
						azanPlayer={azanPlayer}
						key={p}
						onSettingsChange={onSettingsChange}
						prayer={p}
						settings={settings}
						t={t}
					/>
				))}
			</div>
		</div>
	);
}

// Helper function: Handle per-prayer azan selection change
function handlePrayerAzanChange(opts: {
	v: string;
	prayer: PrayerName;
	settings: TabCommonProps["settings"];
	onSettingsChange: TabCommonProps["onSettingsChange"];
	azanPlayer: ReturnType<typeof useAzanPlayer>;
}) {
	opts.onSettingsChange({
		azanByPrayer: {
			...(opts.settings.azanByPrayer || {}),
			[opts.prayer]: opts.v,
		},
	});
	opts.azanPlayer.setPreviewingKey(null);
	opts.azanPlayer.stopAudio();
	if (
		(opts.settings.azanPerPrayer ?? false) &&
		opts.settings.azanEnabled !== false
	) {
		const src = getAzanSource(opts.v, opts.prayer);
		opts.azanPlayer.playSrc(src, `prayer:${opts.prayer}`);
	}
}

// Helper function: Handle per-prayer preview button click
function handlePrayerPreviewClick(
	prayer: PrayerName,
	settings: TabCommonProps["settings"],
	azanPlayer: ReturnType<typeof useAzanPlayer>
) {
	const key = `prayer:${prayer}`;
	if (azanPlayer.previewingKey === key) {
		azanPlayer.setPreviewingKey(null);
		azanPlayer.stopAudio();
		return;
	}
	const effectiveChoice = settings.azanPerPrayer
		? settings.azanByPrayer?.[prayer] || DEFAULT_CHOICE
		: settings.azanGlobalChoice || DEFAULT_CHOICE;
	const src = getAzanSource(effectiveChoice, prayer);
	azanPlayer.playSrc(src, key);
}

// Helper component: Prayer Azan Select Section
function PrayerAzanSelect({
	prayer,
	value,
	customName,
	globalName,
	disabled,
	settings,
	onSettingsChange,
	azanPlayer,
	t,
}: {
	prayer: PrayerName;
	value: string;
	customName: string | undefined;
	globalName: string | undefined;
	disabled: boolean;
	settings: TabCommonProps["settings"];
	onSettingsChange: TabCommonProps["onSettingsChange"];
	azanPlayer: ReturnType<typeof useAzanPlayer>;
	t: (key: string) => string | null;
}) {
	return (
		<Select
			onValueChange={(v) =>
				handlePrayerAzanChange({
					v,
					prayer,
					settings,
					onSettingsChange,
					azanPlayer,
				})
			}
			value={String(value)}
		>
			<SelectTrigger
				aria-disabled={disabled}
				className={`${
					disabled ? "pointer-events-none opacity-50" : ""
				} w-[${TRIGGER_WIDTH}px]`}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={DEFAULT_CHOICE}>
					{t("azan.full") || "Full"}
				</SelectItem>
				<SelectItem value="short">{t("azan.short") || "Short"}</SelectItem>
				<SelectItem value="beep">
					{t("azan.beepOnly") || "Beep only"}
				</SelectItem>
				<SelectItem value={`custom:${prayer}`}>
					{customName || t("azan.customFile") || "Custom file"}
				</SelectItem>
				{globalName ? (
					<SelectItem value="custom:global">{globalName}</SelectItem>
				) : null}
			</SelectContent>
		</Select>
	);
}

// Helper component: Single Prayer Azan Control
function PrayerAzanControl({
	prayer,
	settings,
	onSettingsChange,
	azanPlayer,
	t,
	azanDisabled,
}: {
	prayer: PrayerName;
	settings: TabCommonProps["settings"];
	onSettingsChange: TabCommonProps["onSettingsChange"];
	azanPlayer: ReturnType<typeof useAzanPlayer>;
	t: (key: string) => string | null;
	azanDisabled: boolean;
}) {
	const customName =
		settings.azanCustomNames?.[prayer] || getCustomAzanName(prayer);
	const globalName = settings.azanGlobalCustomName || getCustomAzanGlobalName();
	const value =
		settings.azanByPrayer?.[prayer] ||
		(prayer === "Fajr" ? DEFAULT_FAJR_CHOICE : DEFAULT_CHOICE);
	const disabled = !(settings.azanPerPrayer ?? false);
	const allDisabled = azanDisabled;

	return (
		<div className="flex items-start justify-between gap-3">
			<Label className="w-20 pt-2 text-sm">{prayer}</Label>
			<div className="flex flex-1 flex-col gap-2">
				<div className="flex flex-wrap items-center gap-3">
					<PrayerAzanSelect
						azanPlayer={azanPlayer}
						customName={customName}
						disabled={disabled || allDisabled}
						globalName={globalName}
						onSettingsChange={onSettingsChange}
						prayer={prayer}
						settings={settings}
						t={t}
						value={value}
					/>
					<Button
						aria-label={`Preview ${prayer} azan`}
						disabled={allDisabled || !(settings.azanPerPrayer ?? false)}
						onClick={() =>
							handlePrayerPreviewClick(prayer, settings, azanPlayer)
						}
						size="sm"
						type="button"
						variant="outline"
					>
						{azanPlayer.previewingKey === `prayer:${prayer}` ? (
							<Pause className="h-4 w-4" />
						) : (
							<Volume2 className="h-4 w-4" />
						)}
					</Button>
					<div
						aria-disabled={disabled || allDisabled}
						className={`${
							disabled || allDisabled ? "pointer-events-none opacity-50" : ""
						} w-[${UPLOADER_WIDTH}px] min-w-0 max-w-full sm:w-[${UPLOADER_WIDTH_SM}px]`}
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
							className="w-full"
							disabled={allDisabled || disabled}
							onRemove={() => {
								const result = azanPlayer.handleRemove(prayer);
								onSettingsChange(result);
							}}
							onSelect={async (file) => {
								const result = await azanPlayer.handleUpload(prayer, file);
								onSettingsChange(result);
							}}
						/>
						{customName ? (
							<div className="mt-1 text-muted-foreground text-xs">
								{t("azan.selected") || "Selected:"} {customName}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
