"use client";

import * as React from "react";
import { SettingsDialog } from "@/components/settings-dialog";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

type WidgetSettingsContextProps = {
	children: React.ReactNode;
	settings: Parameters<typeof SettingsDialog>[0]["settings"];
	onSettingsChange: Parameters<typeof SettingsDialog>[0]["onSettingsChange"];
};

export function WidgetSettingsContext({
	children,
	settings,
	onSettingsChange,
}: WidgetSettingsContextProps) {
	const [open, setOpen] = React.useState(false);
	const handleOpen = React.useCallback(() => {
		// Ensure context menu fully closes before opening dialog to avoid focus clashes
		requestAnimationFrame(() => {
			requestAnimationFrame(() => setOpen(true));
		});
	}, []);
	return (
		<ContextMenu>
			<ContextMenuTrigger className="w-full">
				<div>{children}</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onSelect={handleOpen}>Settings…</ContextMenuItem>
			</ContextMenuContent>
			<SettingsDialog
				settings={settings}
				onSettingsChange={onSettingsChange}
				open={open}
				onOpenChange={setOpen}
			/>
		</ContextMenu>
	);
}
