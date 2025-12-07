"use client";

import {
	Columns,
	Eye,
	Image,
	Layout,
	MessageSquare,
	Palette,
	Rows,
	Type,
} from "lucide-react";
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
import type { TabCommonProps } from "../../model/types";
import { ColorPickerGroup } from "../color-picker-group";

const DEFAULT_TICKER_INTERVAL = 5000;

type CardSize = "xxs" | "xs" | "sm" | "md" | "lg";
type AppWidth = "xxs" | "xs" | "md" | "lg" | "xl" | "2xl" | "3xl";

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

function SizeSelectItems({ t }: { t: (key: string) => string }) {
	return (
		<>
			<SelectItem value="xxs">
				{t("settings.sizeXxs") || "XXS (thinnest)"}
			</SelectItem>
			<SelectItem value="xs">{t("settings.sizeXs") || "XS"}</SelectItem>
			<SelectItem value="sm">{t("settings.sizeSm") || "SM"}</SelectItem>
			<SelectItem value="md">{t("settings.sizeMd") || "MD"}</SelectItem>
			<SelectItem value="lg">{t("settings.sizeLg") || "LG"}</SelectItem>
		</>
	);
}

function CardSizeSelect({
	value,
	onChange,
	disabled,
	t,
}: {
	value: CardSize;
	onChange: (value: CardSize) => void;
	disabled?: boolean;
	t: (key: string) => string;
}) {
	return (
		<Select
			disabled={disabled}
			onValueChange={(val) => onChange(val as CardSize)}
			value={value}
		>
			<SelectTrigger aria-disabled={disabled} className="w-[180px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SizeSelectItems t={t} />
			</SelectContent>
		</Select>
	);
}

function AppWidthSelectItems({ t }: { t: (key: string) => string }) {
	return (
		<>
			<SelectItem value="xxs">
				{t("settings.appWidthXxs") || "Ultra compact (xxs)"}
			</SelectItem>
			<SelectItem value="xs">
				{t("settings.appWidthXs") || "Extra compact (xs)"}
			</SelectItem>
			<SelectItem value="md">
				{t("settings.appWidthMd") || "Narrow (md)"}
			</SelectItem>
			<SelectItem value="lg">
				{t("settings.appWidthLg") || "Compact (lg)"}
			</SelectItem>
			<SelectItem value="xl">
				{t("settings.appWidthXl") || "Comfort (xl)"}
			</SelectItem>
			<SelectItem value="2xl">
				{t("settings.appWidth2xl") || "Wide (2xl)"}
			</SelectItem>
			<SelectItem value="3xl">
				{t("settings.appWidth3xl") || "Extra wide (3xl)"}
			</SelectItem>
		</>
	);
}

function handleAppWidthChange(
	value: string,
	settings: TabCommonProps["settings"],
	onSettingsChange: TabCommonProps["onSettingsChange"]
) {
	const v = value as AppWidth;
	const narrow = v === "xs" || v === "xxs";
	onSettingsChange({
		appWidth: v,
		showOtherPrayers: narrow ? false : (settings.showOtherPrayers ?? true),
	});
}

function LayoutSection({ settings, onSettingsChange, t }: TabCommonProps) {
	const showOtherPrayers = settings.showOtherPrayers ?? true;
	const otherCardsDescription = showOtherPrayers
		? undefined
		: t("settings.enableShowOtherPrayersHint") ||
			"Enable 'Show other prayers' to use this setting";

	return (
		<Section
			icon={Layout}
			title={t("settings.layoutSizing") || "Layout & Sizing"}
		>
			<SettingRow
				label={
					t("settings.centerCardSize") !== "settings.centerCardSize"
						? t("settings.centerCardSize")
						: "Center card height"
				}
			>
				<CardSizeSelect
					onChange={(val) => onSettingsChange({ nextCardSize: val })}
					t={t}
					value={settings.nextCardSize || "md"}
				/>
			</SettingRow>
			<SettingRow
				description={otherCardsDescription}
				label={
					t("settings.otherCardsSize") !== "settings.otherCardsSize"
						? t("settings.otherCardsSize")
						: "Other cards height"
				}
			>
				<CardSizeSelect
					disabled={!showOtherPrayers}
					onChange={(val) => onSettingsChange({ otherCardSize: val })}
					t={t}
					value={settings.otherCardSize || "sm"}
				/>
			</SettingRow>
			<SettingRow
				label={
					t("settings.appWidth") !== "settings.appWidth"
						? t("settings.appWidth")
						: "App width"
				}
			>
				<Select
					onValueChange={(value) =>
						handleAppWidthChange(value, settings, onSettingsChange)
					}
					value={settings.appWidth || "xl"}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<AppWidthSelectItems t={t} />
					</SelectContent>
				</Select>
			</SettingRow>
		</Section>
	);
}

function OtherPrayersSection({
	settings,
	onSettingsChange,
	t,
}: TabCommonProps) {
	return (
		<Section icon={Rows} title={t("settings.prayerCards") || "Prayer Cards"}>
			<SettingRow
				label={t("settings.showOtherPrayers") || "Show other prayers"}
			>
				<Switch
					checked={settings.showOtherPrayers ?? true}
					onCheckedChange={(checked) =>
						onSettingsChange({ showOtherPrayers: checked })
					}
				/>
			</SettingRow>
			<SettingRow
				description={
					(settings.showOtherPrayers ?? true)
						? undefined
						: t("settings.enableShowOtherPrayersHint") ||
							"Enable 'Show other prayers' to use this setting"
				}
				label={
					t("settings.viewType") !== "settings.viewType"
						? t("settings.viewType")
						: "View type"
				}
			>
				<div
					aria-disabled={!(settings.showOtherPrayers ?? true)}
					className={
						(settings.showOtherPrayers ?? true)
							? ""
							: "pointer-events-none opacity-50"
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
							if (!(settings.showOtherPrayers ?? true)) {
								return;
							}
							onSettingsChange({ horizontalView: id === "non-vertical" });
						}}
						selectedId={settings.horizontalView ? "non-vertical" : "default"}
						showNotifications={false}
						showToggle={false}
					/>
				</div>
			</SettingRow>
		</Section>
	);
}

function DisplayTogglesSection({
	settings,
	onSettingsChange,
	t,
}: TabCommonProps) {
	return (
		<Section icon={Eye} title={t("settings.visibility") || "Visibility"}>
			<SettingRow label={t("settings.showCity") || "Show city"}>
				<Switch
					checked={settings.showCity ?? true}
					onCheckedChange={(checked) => onSettingsChange({ showCity: checked })}
				/>
			</SettingRow>
			<SettingRow label={t("settings.showClock") || "Show clock"}>
				<Switch
					checked={settings.showClock ?? true}
					onCheckedChange={(checked) =>
						onSettingsChange({ showClock: checked })
					}
				/>
			</SettingRow>
			<SettingRow label={t("settings.showDate") || "Show date"}>
				<Switch
					checked={settings.showDate ?? true}
					onCheckedChange={(checked) => onSettingsChange({ showDate: checked })}
				/>
			</SettingRow>
		</Section>
	);
}

function TickerSection({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
		<Section icon={MessageSquare} title={t("settings.ticker") || "Ticker"}>
			<SettingRow label={t("settings.showTicker") || "Show ticker"}>
				<Switch
					checked={settings.showTicker ?? true}
					onCheckedChange={(checked) =>
						onSettingsChange({ showTicker: checked })
					}
				/>
			</SettingRow>
			<SettingRow
				description={
					(settings.showTicker ?? true)
						? undefined
						: t("settings.enableShowTickerHint") ||
							"Enable 'Show ticker' to use this setting"
				}
				label={t("settings.tickerSpeed") || "Ticker change interval"}
			>
				<Select
					disabled={!(settings.showTicker ?? true)}
					onValueChange={(value) =>
						onSettingsChange({
							tickerIntervalMs: Number.parseInt(value, 10),
						})
					}
					value={String(settings.tickerIntervalMs ?? DEFAULT_TICKER_INTERVAL)}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="3000">
							{t("settings.tickerInterval3") || "3 seconds"}
						</SelectItem>
						<SelectItem value="5000">
							{t("settings.tickerInterval5") || "5 seconds"}
						</SelectItem>
						<SelectItem value="8000">
							{t("settings.tickerInterval8") || "8 seconds"}
						</SelectItem>
						<SelectItem value="10000">
							{t("settings.tickerInterval10") || "10 seconds"}
						</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
		</Section>
	);
}

function FontsSection({ settings, onSettingsChange, t }: TabCommonProps) {
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

const OPACITY_SLIDER_MAX = 100;
const OPACITY_SLIDER_MIN = 0;
const OPACITY_SCALE_FACTOR = 100;
const MAX_OPACITY = 1;

function clampOpacity(raw: number): number {
	return Math.min(OPACITY_SLIDER_MAX, Math.max(OPACITY_SLIDER_MIN, raw));
}

function BackgroundsSection({ settings, onSettingsChange, t }: TabCommonProps) {
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
}: TabCommonProps) {
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
					ariaLabel="Pick azan color"
					label={t("settings.countdown") || "Countdown"}
					onChange={(val) => onSettingsChange({ prayerCountdownColor: val })}
					value={settings.prayerCountdownColor || "#ffffff"}
				/>
			</div>
		</Section>
	);
}

export function DisplayTab({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
		<div className="space-y-6">
			<LayoutSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<OtherPrayersSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<DisplayTogglesSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<TickerSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<FontsSection
				onSettingsChange={onSettingsChange}
				settings={settings}
				t={t}
			/>
			<BackgroundsSection
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
