"use client";

import { Bell, Music, Pause, Volume1, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/shared/lib/hooks";
import {
	getAzanSource,
	getCustomAzanGlobalName,
	getCustomAzanName,
	type PrayerName,
	removeCustomAzanFileGlobal,
	storeCustomAzanFileGlobal,
} from "@/shared/lib/prayer";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import CompactFileUploader from "@/shared/ui/file-uploader";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import type { TabCommonProps } from "../../model/types";
import { useAzanPlayer } from "../../model/use-azan-player";

const VOLUME_SLIDER_MAX = 100;
const VOLUME_SLIDER_MIN = 0;
const VOLUME_SCALE_FACTOR = 100;
const MAX_AUDIO_VOLUME = 1;
const DEFAULT_FAJR_CHOICE = "fajr";
const DEFAULT_CHOICE = "default";

function clampVolume(raw: number): number {
	return Math.min(VOLUME_SLIDER_MAX, Math.max(VOLUME_SLIDER_MIN, raw));
}

function isAzanDisabled(azanEnabled: boolean | undefined): boolean {
	return azanEnabled === false;
}

function Section({
	title,
	icon: Icon,
	children,
	className,
	disabled,
}: {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}) {
	return (
		<div
			className={cn(
				"space-y-4 rounded-xl border border-muted/40 bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 p-5 shadow-sm backdrop-blur-sm",
				disabled ? "pointer-events-none opacity-50" : null,
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

async function handleGlobalFileUpload(
	file: File,
	settings: TabCommonProps["settings"],
	onSettingsChange: TabCommonProps["onSettingsChange"],
	azanPlayer: ReturnType<typeof useAzanPlayer>
) {
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
	const azanValue =
		settings.azanGlobalChoice && settings.azanGlobalChoice !== ""
			? settings.azanGlobalChoice
			: (DEFAULT_CHOICE ?? "");
	return (
		<Select
			onValueChange={(v) =>
				handleGlobalAzanChange(v, settings, onSettingsChange, azanPlayer)
			}
			value={azanValue}
		>
			<SelectTrigger
				aria-disabled={settings.azanPerPrayer === true}
				className={cn(
					"w-[220px]",
					settings.azanPerPrayer ? "pointer-events-none opacity-50" : null
				)}
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
				className={cn(
					"w-[220px]",
					disabled ? "pointer-events-none opacity-50" : null
				)}
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
		<div className="space-y-3 rounded-lg border border-muted/30 bg-muted/10 p-4">
			<div className="flex items-center justify-between gap-3">
				<Label className="font-medium text-sm">{prayer}</Label>
				<div className="flex items-center gap-2">
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
				</div>
			</div>
			<div
				aria-disabled={disabled || allDisabled}
				className={cn(
					"w-full",
					disabled || allDisabled ? "pointer-events-none opacity-50" : null
				)}
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
					<div className="mt-1.5 text-muted-foreground text-xs">
						{t("azan.selected") || "Selected:"} {customName}
					</div>
				) : null}
			</div>
		</div>
	);
}

function VolumeSection({
	settings,
	onSettingsChange,
	azanPlayer,
	azanDisabled,
	t,
}: TabCommonProps & {
	azanPlayer: ReturnType<typeof useAzanPlayer>;
	azanDisabled: boolean;
}) {
	const volumePercent = Math.min(
		100,
		Math.round((settings.azanVolume ?? 1) * VOLUME_SCALE_FACTOR)
	);
	const [volumeValue, setVolumeValue] = useState<number>(volumePercent);

	useEffect(() => {
		setVolumeValue(volumePercent);
	}, [volumePercent]);

	const isZero = volumeValue === 0;
	const isLow = volumeValue > 0 && volumeValue < 30;

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = Number(e.target.value);
		let numValue = raw;
		if (Number.isNaN(raw)) {
			numValue = VOLUME_SLIDER_MIN;
		}
		const clampedValue = clampVolume(numValue);
		setVolumeValue(clampedValue);
		const v =
			clampedValue === VOLUME_SLIDER_MAX
				? MAX_AUDIO_VOLUME
				: clampedValue / VOLUME_SCALE_FACTOR;
		onSettingsChange({ azanVolume: v });
		if (azanPlayer.audioRef.current) {
			azanPlayer.audioRef.current.volume = v;
		}
	};

	return (
		<div
			className={cn(
				"space-y-3",
				azanDisabled ? "pointer-events-none opacity-50" : null
			)}
		>
			{isZero || isLow ? (
				<div
					className={cn(
						"rounded-lg border px-3 py-2 text-xs",
						isZero
							? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
							: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
					)}
				>
					{isZero
						? t("azan.volumeZeroWarning") ||
							"Volume is muted. Azan will not play"
						: t("azan.volumeLowWarning") || "Volume might be too low to hear"}
				</div>
			) : null}
			<SettingRow
				description={`${volumeValue}%`}
				label={t("azan.volume") || "Volume"}
			>
				<div className="w-[200px] space-y-2">
					<Input
						aria-label="Azan volume"
						className="h-2 w-full cursor-pointer appearance-none rounded-full border-0 bg-primary/25 p-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
						disabled={azanDisabled}
						id="azan-volume-slider"
						max={VOLUME_SLIDER_MAX}
						min={VOLUME_SLIDER_MIN}
						onChange={handleVolumeChange}
						step={1}
						type="range"
						value={volumeValue}
					/>
					<div className="flex justify-between text-muted-foreground text-xs">
						<span>0%</span>
						<span>100%</span>
					</div>
				</div>
			</SettingRow>
		</div>
	);
}

function EnableAzanSection({
	settings,
	onSettingsChange,
	azanPlayer,
	azanDisabled,
	t,
}: TabCommonProps & {
	azanPlayer: ReturnType<typeof useAzanPlayer>;
	azanDisabled: boolean;
}) {
	const handleEnableChange = (checked: boolean) => {
		if (!checked) {
			azanPlayer.setPreviewingKey(null);
			azanPlayer.stopAudio();
		}
		onSettingsChange({ azanEnabled: checked });
	};

	return (
		<Section icon={Bell} title={t("azan.enable") || "Azan Settings"}>
			<SettingRow label={t("azan.enable") || "Enable Azan"}>
				<Switch
					checked={settings.azanEnabled ?? true}
					onCheckedChange={handleEnableChange}
				/>
			</SettingRow>
			<VolumeSection
				azanDisabled={azanDisabled}
				azanPlayer={azanPlayer}
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
		</Section>
	);
}

function GlobalAzanSection({
	settings,
	onSettingsChange,
	azanPlayer,
	azanDisabled,
	t,
}: TabCommonProps & {
	azanPlayer: ReturnType<typeof useAzanPlayer>;
	azanDisabled: boolean;
}) {
	const handleGlobalFileRemove = () => {
		removeCustomAzanFileGlobal();
		onSettingsChange({
			azanGlobalChoice: DEFAULT_CHOICE,
			azanGlobalCustomName: undefined,
		});
		if (azanPlayer.previewingKey === "global") {
			azanPlayer.setPreviewingKey(null);
			azanPlayer.stopAudio();
		}
	};

	const handleGlobalFileSelect = async (file: File) => {
		await handleGlobalFileUpload(file, settings, onSettingsChange, azanPlayer);
	};

	return (
		<Section
			disabled={azanDisabled || settings.azanPerPrayer === true}
			icon={Music}
			title={t("azan.type") || "Global Azan"}
		>
			<SettingRow
				description={
					settings.azanPerPrayer
						? "Disabled when per-prayer mode is enabled"
						: null
				}
				label={t("azan.type") || "Azan type"}
			>
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
			</SettingRow>
			<SettingRow
				description={
					settings.azanPerPrayer
						? "Disabled when per-prayer mode is enabled"
						: null
				}
				label={t("azan.customOverride") || "Custom file (overrides all)"}
			>
				<div className="w-full max-w-[300px]">
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
						onRemove={handleGlobalFileRemove}
						onSelect={handleGlobalFileSelect}
					/>
					{settings.azanGlobalCustomName || getCustomAzanGlobalName() ? (
						<div className="mt-1.5 truncate text-muted-foreground text-xs">
							{t("azan.selected") || "Selected:"}{" "}
							{settings.azanGlobalCustomName || getCustomAzanGlobalName()}
						</div>
					) : null}
				</div>
			</SettingRow>
		</Section>
	);
}

function PerPrayerSection({
	settings,
	onSettingsChange,
	azanPlayer,
	azanDisabled,
	t,
	prayers,
}: TabCommonProps & {
	azanPlayer: ReturnType<typeof useAzanPlayer>;
	azanDisabled: boolean;
	prayers: PrayerName[];
}) {
	const handlePerPrayerChange = (checked: boolean) => {
		if (!checked) {
			azanPlayer.setPreviewingKey(null);
			azanPlayer.stopAudio();
		}
		onSettingsChange({ azanPerPrayer: checked });
	};

	return (
		<Section
			disabled={azanDisabled}
			icon={Volume1}
			title={t("azan.perPrayer") || "Per-Prayer Azan"}
		>
			<SettingRow
				description="Use different azan for each prayer"
				label={t("azan.perPrayer") || "Enable per-prayer mode"}
			>
				<Switch
					checked={settings.azanPerPrayer ?? false}
					onCheckedChange={handlePerPrayerChange}
				/>
			</SettingRow>
			{settings.azanPerPrayer ? (
				<div className="space-y-3 pt-2">
					{prayers.map((prayer) => (
						<PrayerAzanControl
							azanDisabled={azanDisabled}
							azanPlayer={azanPlayer}
							key={prayer}
							onSettingsChange={onSettingsChange}
							prayer={prayer}
							settings={settings}
							t={t}
						/>
					))}
				</div>
			) : null}
		</Section>
	);
}

export function AzanTab({ settings, onSettingsChange }: TabCommonProps) {
	const { t } = useTranslation();
	const azanPlayer = useAzanPlayer(settings);
	const prayers: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
	const azanDisabled = isAzanDisabled(settings.azanEnabled);

	return (
		<div className="space-y-6">
			<EnableAzanSection
				azanDisabled={azanDisabled}
				azanPlayer={azanPlayer}
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<GlobalAzanSection
				azanDisabled={azanDisabled}
				azanPlayer={azanPlayer}
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<PerPrayerSection
				azanDisabled={azanDisabled}
				azanPlayer={azanPlayer}
				onSettingsChange={onSettingsChange}
				prayers={prayers}
				settings={settings}
				t={t}
			/>
		</div>
	);
}
