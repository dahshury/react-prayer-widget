"use client";

import { Columns, Rows } from "lucide-react";
import { Card } from "@/shared/ui/card";
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
import { ColorPickerGroup } from "../components/color-picker-group";
import type { TabCommonProps } from "../types";

// Constants
const DEFAULT_TICKER_INTERVAL = 5000;

// Section: Layout settings (center/other card sizes + app width)
function LayoutSection({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
		<div className="space-y-2 rounded-lg border bg-muted/30 p-3">
			<div className="flex items-center justify-between gap-3">
				<Label className="text-sm">
					{t("settings.centerCardSize") !== "settings.centerCardSize"
						? t("settings.centerCardSize")
						: "Center card height"}
				</Label>
				<Select
					onValueChange={(value) =>
						onSettingsChange({
							nextCardSize: value as "xxs" | "xs" | "sm" | "md" | "lg",
						})
					}
					value={settings.nextCardSize || "md"}
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
					onValueChange={(value) =>
						onSettingsChange({
							otherCardSize: value as "xxs" | "xs" | "sm" | "md" | "lg",
						})
					}
					value={settings.otherCardSize || "sm"}
				>
					<SelectTrigger
						aria-disabled={!(settings.showOtherPrayers ?? true)}
						disabled={!(settings.showOtherPrayers ?? true)}
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
					value={settings.appWidth || "xl"}
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
	);
}

// Section: Other prayers visibility + view type
function OtherPrayersSection({
	settings,
	onSettingsChange,
	t,
}: TabCommonProps) {
	return (
		<div className="space-y-2 rounded-lg border bg-muted/30 p-3">
			<div className="flex items-center justify-between">
				<Label className="text-sm">{t("settings.showOtherPrayers")}</Label>
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
							{ id: "default", title: "Stacked", icon: Rows },
							{ id: "non-vertical", title: "View", icon: Columns },
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
			</div>
		</div>
	);
}

// Section: Display toggles (city, clock, date)
function DisplayTogglesSection({
	settings,
	onSettingsChange,
	t,
}: TabCommonProps) {
	return (
		<div className="space-y-2 rounded-lg border bg-muted/30 p-3">
			<div className="flex items-center justify-between">
				<Label className="text-sm">{t("settings.showCity")}</Label>
				<Switch
					checked={settings.showCity ?? true}
					onCheckedChange={(checked) => onSettingsChange({ showCity: checked })}
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
					onCheckedChange={(checked) => onSettingsChange({ showDate: checked })}
				/>
			</div>
		</div>
	);
}

// Section: Ticker settings
function TickerSection({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
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
					onValueChange={(value) =>
						onSettingsChange({
							tickerIntervalMs: Number.parseInt(value, 10),
						})
					}
					value={String(settings.tickerIntervalMs ?? DEFAULT_TICKER_INTERVAL)}
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
	);
}

// Section: Color pickers
function ColorPickersSection({ settings, onSettingsChange }: TabCommonProps) {
	return (
		<div className="rounded-lg border bg-muted/30 p-3">
			<div className="flex items-center gap-4 divide-x divide-border">
				<ColorPickerGroup
					ariaLabel="Pick prayer name color"
					label="Prayer name"
					onChange={(val) => onSettingsChange({ prayerNameColor: val })}
					value={settings.prayerNameColor || "#ffffff"}
				/>
				<ColorPickerGroup
					ariaLabel="Pick prayer time color"
					label="Prayer time"
					onChange={(val) => onSettingsChange({ prayerTimeColor: val })}
					value={settings.prayerTimeColor || "#ffffff"}
				/>
				<ColorPickerGroup
					ariaLabel="Pick azan color"
					label="Azan"
					onChange={(val) => onSettingsChange({ prayerCountdownColor: val })}
					value={settings.prayerCountdownColor || "#ffffff"}
				/>
			</div>
		</div>
	);
}

// Main component
export function DisplayTab({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
		<Card className="bg-background p-4 text-foreground">
			<div className="space-y-3">
				<div className="space-y-3">
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
					<ColorPickersSection
						onSettingsChange={onSettingsChange}
						settings={settings}
						t={t}
					/>
				</div>
			</div>
		</Card>
	);
}
