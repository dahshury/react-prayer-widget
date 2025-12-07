"use client";

import { Columns, Image, Layout, Palette, Rows, Type } from "lucide-react";
import { AVAILABLE_BACKGROUNDS } from "@/shared/lib/backgrounds";
import { AVAILABLE_FONTS } from "@/shared/lib/fonts";
import { cn } from "@/shared/lib/utils";
import { Combobox } from "@/shared/ui/combobox";
import { Input } from "@/shared/ui/input";
import { Toolbar as KToolbar } from "@/shared/ui/kokonutui/toolbar";
import { Label } from "@/shared/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { ColorPickerGroup } from "../color-picker-group";

type PrayerGridSettings = {
	cardBackground?: string;
	cardBackgroundOpacity?: number;
	otherCardSize?: "xxs" | "xs" | "sm" | "md" | "lg";
	dimPreviousPrayers?: boolean;
	horizontalView?: boolean;
	timeFormat24h?: boolean;
	language?: "en" | "ar";
	prayerNameColor?: string;
	prayerTimeColor?: string;
	prayerCountdownColor?: string;
	prayerFont?: string;
	timeFont?: string;
};

type PrayerGridDisplayTabProps = {
	settings: PrayerGridSettings;
	onSettingsChange: (settings: Partial<PrayerGridSettings>) => void;
	t: (key: string) => string;
};

const OPACITY_SLIDER_MAX = 100;
const OPACITY_SLIDER_MIN = 0;
const OPACITY_SCALE_FACTOR = 100;
const MAX_OPACITY = 1;

function clampOpacity(raw: number): number {
	return Math.min(OPACITY_SLIDER_MAX, Math.max(OPACITY_SLIDER_MIN, raw));
}

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
	description?: string;
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

function LayoutSection({
	settings,
	onSettingsChange,
	t,
}: PrayerGridDisplayTabProps) {
	return (
		<Section
			icon={Layout}
			title={t("settings.layoutSizing") || "Layout & Sizing"}
		>
			<SettingRow
				label={
					t("settings.otherCardsSize") !== "settings.otherCardsSize"
						? t("settings.otherCardsSize")
						: "Card size"
				}
			>
				<Select
					onValueChange={(value) =>
						onSettingsChange({
							otherCardSize: value as "xxs" | "xs" | "sm" | "md" | "lg",
						})
					}
					value={settings.otherCardSize || "sm"}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="xxs">
							{t("settings.sizeXxs") || "XXS (thinnest)"}
						</SelectItem>
						<SelectItem value="xs">{t("settings.sizeXs") || "XS"}</SelectItem>
						<SelectItem value="sm">{t("settings.sizeSm") || "SM"}</SelectItem>
						<SelectItem value="md">{t("settings.sizeMd") || "MD"}</SelectItem>
						<SelectItem value="lg">{t("settings.sizeLg") || "LG"}</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
		</Section>
	);
}

function ViewSection({
	settings,
	onSettingsChange,
	t,
}: PrayerGridDisplayTabProps) {
	return (
		<Section icon={Rows} title={t("settings.prayerCards") || "Prayer Cards"}>
			<SettingRow
				label={
					t("settings.viewType") !== "settings.viewType"
						? t("settings.viewType")
						: "View type"
				}
			>
				<KToolbar
					className="border-0 bg-transparent p-0"
					items={[
						{
							id: "default",
							title: t("settings.viewStacked") || "Stacked",
							icon: Rows,
						},
						{
							id: "non-vertical",
							title: t("settings.viewHorizontal") || "Horizontal",
							icon: Columns,
						},
					]}
					onSelect={(id) => {
						onSettingsChange({ horizontalView: id === "non-vertical" });
					}}
					selectedId={settings.horizontalView ? "non-vertical" : "default"}
					showNotifications={false}
					showToggle={false}
				/>
			</SettingRow>
			<SettingRow
				label={
					t("settings.dimPreviousPrayers") !== "settings.dimPreviousPrayers"
						? t("settings.dimPreviousPrayers")
						: "Dim previous prayers"
				}
			>
				<Switch
					checked={settings.dimPreviousPrayers ?? true}
					onCheckedChange={(checked) =>
						onSettingsChange({ dimPreviousPrayers: checked })
					}
				/>
			</SettingRow>
		</Section>
	);
}

function FontsSection({
	settings,
	onSettingsChange,
	t,
}: PrayerGridDisplayTabProps) {
	const fontOptions = AVAILABLE_FONTS.map((font) => ({
		value: font.value,
		label: font.label,
		fontFamily: font.value === "default" ? undefined : font.value,
	}));

	return (
		<Section icon={Type} title={t("settings.fonts") || "Fonts"}>
			<SettingRow
				label={
					t("settings.prayerFont") !== "settings.prayerFont"
						? t("settings.prayerFont")
						: "Prayer name font"
				}
			>
				<Combobox
					className="w-[200px]"
					emptyText={t("settings.noFontFound") || "No font found."}
					onValueChange={(value) => {
						let prayerFontValue: string | undefined;
						if (value === "default") {
							prayerFontValue = undefined;
						} else {
							prayerFontValue = value;
						}
						onSettingsChange({
							prayerFont: prayerFontValue,
						});
					}}
					options={fontOptions}
					placeholder={t("settings.selectFont") || "Select font..."}
					searchPlaceholder={t("settings.searchFonts") || "Search fonts..."}
					value={settings.prayerFont || "default"}
				/>
			</SettingRow>
			<SettingRow
				label={
					t("settings.timeFont") !== "settings.timeFont"
						? t("settings.timeFont")
						: "Prayer time font"
				}
			>
				<Combobox
					className="w-[200px]"
					emptyText="No font found."
					onValueChange={(value) => {
						let timeFontValue: string | undefined;
						if (value === "default") {
							timeFontValue = undefined;
						} else {
							timeFontValue = value;
						}
						onSettingsChange({
							timeFont: timeFontValue,
						});
					}}
					options={fontOptions}
					placeholder="Select font..."
					searchPlaceholder="Search fonts..."
					value={settings.timeFont || "default"}
				/>
			</SettingRow>
		</Section>
	);
}

function BackgroundsSection({
	settings,
	onSettingsChange,
	t,
}: PrayerGridDisplayTabProps) {
	const backgroundOptions = AVAILABLE_BACKGROUNDS.map((bg) => {
		let imageUrl: string | undefined;
		if (
			bg.value !== "default" &&
			(bg.value.startsWith("hr-") || bg.value.startsWith("vr-"))
		) {
			const prefix = bg.value.startsWith("hr-") ? "HR" : "VR";
			const num = bg.value.split("-")[1];
			imageUrl = `/backgrounds/${prefix}-${num}.jpg`;
		}
		return {
			value: bg.value,
			label: bg.label,
			imageUrl,
		};
	});

	const opacityPercent = Math.min(
		100,
		Math.round((settings.cardBackgroundOpacity ?? 1) * OPACITY_SCALE_FACTOR)
	);

	return (
		<Section
			icon={Image}
			title={t("settings.cardBackgrounds") || "Card Backgrounds"}
		>
			<SettingRow
				description={
					t("settings.chooseFromImageBackgrounds") ||
					"Choose from image backgrounds"
				}
				label={
					t("settings.cardBackground") !== "settings.cardBackground"
						? t("settings.cardBackground")
						: "Card background"
				}
			>
				<Combobox
					emptyText={t("settings.noBackgroundFound") || "No background found."}
					onValueChange={(value) => {
						let cardBackgroundValue: string | undefined;
						if (value === "default") {
							cardBackgroundValue = undefined;
						} else {
							cardBackgroundValue = value;
						}
						onSettingsChange({
							cardBackground: cardBackgroundValue,
						});
					}}
					options={backgroundOptions}
					placeholder={t("settings.selectBackground") || "Select background..."}
					searchPlaceholder={
						t("settings.searchBackgrounds") || "Search backgrounds..."
					}
					value={settings.cardBackground || "default"}
				/>
			</SettingRow>
			<SettingRow
				description={`${opacityPercent}%`}
				label={
					t("settings.cardBackgroundOpacity") !==
					"settings.cardBackgroundOpacity"
						? t("settings.cardBackgroundOpacity")
						: "Background opacity"
				}
			>
				<div className="w-[200px] space-y-2">
					<Input
						aria-label="Background opacity"
						className="h-2 w-full cursor-pointer appearance-none rounded-full border-0 bg-primary/25 p-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
						id="background-opacity-slider"
						max={OPACITY_SLIDER_MAX}
						min={OPACITY_SLIDER_MIN}
						onChange={(e) => {
							const raw = Number(e.target.value);
							let numValue = raw;
							if (Number.isNaN(raw)) {
								numValue = OPACITY_SLIDER_MIN;
							}
							const value = clampOpacity(numValue);
							const v =
								value === OPACITY_SLIDER_MAX
									? MAX_OPACITY
									: value / OPACITY_SCALE_FACTOR;
							onSettingsChange({ cardBackgroundOpacity: v });
						}}
						step={1}
						type="range"
						value={opacityPercent}
					/>
					<div className="flex justify-between text-muted-foreground text-xs">
						<span>0%</span>
						<span>100%</span>
					</div>
				</div>
			</SettingRow>
		</Section>
	);
}

function ColorPickersSection({
	settings,
	onSettingsChange,
	t,
}: PrayerGridDisplayTabProps) {
	return (
		<Section icon={Palette} title={t("settings.colors") || "Colors"}>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<ColorPickerGroup
					ariaLabel="Pick prayer name color"
					label={t("settings.prayerName") || "Prayer name"}
					onChange={(val) => onSettingsChange({ prayerNameColor: val })}
					value={settings.prayerNameColor || "#ffffff"}
				/>
				<ColorPickerGroup
					ariaLabel="Pick prayer time color"
					label={t("settings.prayerTime") || "Prayer time"}
					onChange={(val) => onSettingsChange({ prayerTimeColor: val })}
					value={settings.prayerTimeColor || "#ffffff"}
				/>
				<ColorPickerGroup
					ariaLabel="Pick countdown color"
					label={t("settings.countdown") || "Countdown"}
					onChange={(val) => onSettingsChange({ prayerCountdownColor: val })}
					value={settings.prayerCountdownColor || "#ffffff"}
				/>
			</div>
		</Section>
	);
}

export function PrayerGridDisplayTab({
	settings,
	onSettingsChange,
	t,
}: PrayerGridDisplayTabProps) {
	return (
		<div className="space-y-6">
			<LayoutSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<ViewSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<BackgroundsSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<FontsSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<ColorPickersSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
		</div>
	);
}
