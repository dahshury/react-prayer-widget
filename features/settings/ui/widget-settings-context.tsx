"use client";

import {
	type CSSProperties,
	type ReactNode,
	useCallback,
	useMemo,
	useState,
} from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/shared/ui/context-menu";
import { SettingsDialog } from "./settings-dialog";

type WidgetSettingsContextProps = {
	children: ReactNode;
	settings: Parameters<typeof SettingsDialog>[0]["settings"];
	onSettingsChange: Parameters<typeof SettingsDialog>[0]["onSettingsChange"];
};

export function WidgetSettingsContext({
	children,
	settings,
	onSettingsChange,
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
	return (
		<ContextMenu>
			<ContextMenuTrigger className="w-full">
				<div style={styleVars as CSSProperties}>{children}</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={handleOpen}>Settings…</ContextMenuItem>
			</ContextMenuContent>
			<SettingsDialog
				onOpenChange={setOpen}
				onSettingsChange={onSettingsChange}
				open={open}
				settings={settings}
			/>
		</ContextMenu>
	);
}
