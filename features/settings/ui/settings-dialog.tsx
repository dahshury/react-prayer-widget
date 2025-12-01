"use client";

import { useState } from "react";
import type { SettingsDialogProps } from "@/features/settings";
import {
	AzanTab,
	CalculationTab,
	DisplayTab,
	GeneralTab,
	LocationTab,
} from "@/features/settings";
import { useTranslation } from "@/shared/lib/hooks";
import {
	Tabs,
	TabsContent,
	TabsContents,
	TabsList,
	TabsTrigger,
} from "@/shared/ui/animate/variants/radix/tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";

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
	const locationLabel = tt("settings.locationTimezone", "Location");
	const displayLabel = tt("settings.displayOptions", "Display");
	const calculationLabel = tt("settings.calculation", "Calculation");
	const azanLabel = tt("settings.azan", "Azan");

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent className="max-h-[90vh] w-[960px] max-w-[98vw] overflow-y-auto overflow-x-hidden">
				<DialogHeader>
					<DialogTitle>{tt("settings.title", "Settings")}</DialogTitle>
				</DialogHeader>
				<Tabs className="w-full" defaultValue="General">
					<div className="flex w-full justify-center">
						<TabsList>
							<TabsTrigger value="General">{generalLabel}</TabsTrigger>
							<TabsTrigger value="Location">{locationLabel}</TabsTrigger>
							<TabsTrigger value="Display">{displayLabel}</TabsTrigger>
							<TabsTrigger value="Azan">{azanLabel}</TabsTrigger>
							<TabsTrigger value="Calculation">{calculationLabel}</TabsTrigger>
						</TabsList>
					</div>
					<TabsContents className="mt-3">
						<TabsContent value="General">
							<GeneralTab
								onSettingsChange={onSettingsChange}
								settings={settings}
								t={t}
							/>
						</TabsContent>
						<TabsContent value="Location">
							<LocationTab
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
					</TabsContents>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
