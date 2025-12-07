"use client";

import {
	type CSSProperties,
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/shared/ui/context-menu";
import {
	type PrayerGridSettings,
	PrayerGridSettingsDialog,
} from "./prayer-grid-settings-dialog";

type PrayerGridSettingsContextValue = {
	onSettingsChange: (settings: Partial<PrayerGridSettings>) => void;
	settings: PrayerGridSettings;
};

const PrayerGridSettingsContextValue =
	createContext<PrayerGridSettingsContextValue | null>(null);

export function usePrayerGridSettings() {
	const context = useContext(PrayerGridSettingsContextValue);
	return context;
}

type PrayerGridSettingsContextProps = {
	children: ReactNode;
	settings: PrayerGridSettings;
	onSettingsChange: (settings: Partial<PrayerGridSettings>) => void;
};

export function PrayerGridSettingsContext({
	children,
	settings,
	onSettingsChange,
}: PrayerGridSettingsContextProps) {
	const [open, setOpen] = useState(false);
	const handleOpen = useCallback(() => {
		// Ensure context menu fully closes before opening dialog to avoid focus clashes
		requestAnimationFrame(() => {
			requestAnimationFrame(() => setOpen(true));
		});
	}, []);
	const styleVars = useMemo(
		() => ({
			["--prayer-name-color" as unknown as string]:
				settings.prayerNameColor || "var(--foreground)",
			["--prayer-time-color" as unknown as string]:
				settings.prayerTimeColor || "var(--foreground)",
			["--prayer-countdown-color" as unknown as string]:
				settings.prayerCountdownColor || "#ffffff",
		}),
		[
			settings.prayerNameColor,
			settings.prayerTimeColor,
			settings.prayerCountdownColor,
		]
	);
	return (
		<PrayerGridSettingsContextValue.Provider
			value={{ onSettingsChange, settings }}
		>
			<ContextMenu>
				<ContextMenuTrigger className="w-full">
					<div style={styleVars as CSSProperties}>{children}</div>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onSelect={handleOpen}>Settings…</ContextMenuItem>
				</ContextMenuContent>
				<PrayerGridSettingsDialog
					onOpenChange={setOpen}
					onSettingsChange={onSettingsChange}
					open={open}
					settings={settings}
				/>
			</ContextMenu>
		</PrayerGridSettingsContextValue.Provider>
	);
}
