"use client";

import { Bell, Calculator, Monitor, Settings } from "lucide-react";
import { useState } from "react";
import type { SettingsDialogProps } from "@/features/settings";
import {
	AzanTab,
	CalculationTab,
	DisplayTab,
	GeneralTab,
} from "@/features/settings";
import { useTranslation } from "@/shared/lib/hooks";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export function SettingsDialog({
	settings,
	onSettingsChange,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
}: SettingsDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = controlledOnOpenChange ?? setUncontrolledOpen;
	const { t } = useTranslation();

	const tt = (key: string, fallback: string) => {
		const v = t(key);
		return v === key ? fallback : v;
	};

	const generalLabel = tt("settings.general", "General");
	const displayLabel = tt("settings.displayOptions", "Display");
	const calculationLabel = tt("settings.calculation", "Calculation");
	const azanLabel = tt("settings.azan", "Azan");

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent className="max-h-[90vh] w-[960px] max-w-[98vw] overflow-y-auto overflow-x-hidden p-6">
				<DialogHeader>
					<DialogTitle>{tt("settings.title", "Settings")}</DialogTitle>
				</DialogHeader>
				<Tabs className="w-full" defaultValue="General">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="General">
							<Settings className="size-4" />
							{generalLabel}
						</TabsTrigger>
						<TabsTrigger value="Display">
							<Monitor className="size-4" />
							{displayLabel}
						</TabsTrigger>
						<TabsTrigger value="Azan">
							<Bell className="size-4" />
							{azanLabel}
						</TabsTrigger>
						<TabsTrigger value="Calculation">
							<Calculator className="size-4" />
							{calculationLabel}
						</TabsTrigger>
					</TabsList>
					<TabsContent value="General">
						<GeneralTab
							onSettingsChange={onSettingsChange}
							settings={settings}
							t={t}
						/>
					</TabsContent>
					<TabsContent value="Display">
						<DisplayTab
							onSettingsChange={onSettingsChange}
							settings={settings}
							t={t}
						/>
					</TabsContent>
					<TabsContent value="Azan">
						<AzanTab
							onSettingsChange={onSettingsChange}
							settings={settings}
							t={t}
						/>
					</TabsContent>
					<TabsContent value="Calculation">
						<CalculationTab
							onSettingsChange={onSettingsChange}
							settings={settings}
							t={t}
						/>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
