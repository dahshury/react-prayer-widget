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
import type { SettingsDialogProps } from "../model/types";
import { SettingsDialog } from "./settings-dialog";

type SettingsContextValue = {
	onSettingsChange: SettingsDialogProps["onSettingsChange"];
	settings: SettingsDialogProps["settings"];
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useWidgetSettings() {
	const context = useContext(SettingsContext);
	return context;
}

type WidgetSettingsContextProps = {
	children: ReactNode;
	settings: SettingsDialogProps["settings"];
	onSettingsChange: SettingsDialogProps["onSettingsChange"];
	customDialog?: React.ComponentType<{
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		settings: SettingsDialogProps["settings"];
		onSettingsChange: SettingsDialogProps["onSettingsChange"];
	}>;
};

export function WidgetSettingsContext({
	children,
	settings,
	onSettingsChange,
	customDialog: CustomDialog,
}: WidgetSettingsContextProps) {
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
	const DialogComponent = CustomDialog || SettingsDialog;
	return (
		<SettingsContext.Provider value={{ onSettingsChange, settings }}>
			<ContextMenu>
				<ContextMenuTrigger className="w-full">
					<div style={styleVars as CSSProperties}>{children}</div>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem onSelect={handleOpen}>Settings…</ContextMenuItem>
				</ContextMenuContent>
				<DialogComponent
					onOpenChange={setOpen}
					onSettingsChange={onSettingsChange}
					open={open}
					settings={settings}
				/>
			</ContextMenu>
		</SettingsContext.Provider>
	);
}
