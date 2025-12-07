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
import { cn } from "@/shared/lib/utils";
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

	const triggerClass =
		"flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-all " +
		"data-[state=active]:border-amber-400/50 data-[state=active]:bg-amber-500/10 data-[state=active]:text-foreground " +
		"data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground/80";

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent
				className={cn(
					"max-h-[90vh] w-[960px] max-w-[98vw] overflow-y-auto overflow-x-hidden",
					"rounded-2xl border border-amber-400/20 bg-gradient-to-br from-background via-muted/40 to-background",
					"p-6 shadow-[0_18px_48px_rgba(17,24,39,0.2)] backdrop-blur-md"
				)}
			>
				<DialogHeader className="pb-4">
					<DialogTitle className="font-semibold text-lg">
						{tt("settings.title", "Settings")}
					</DialogTitle>
				</DialogHeader>
				<Tabs className="w-full" defaultValue="General">
					<TabsList className="grid w-full grid-cols-4 gap-2 rounded-xl border border-muted/40 bg-muted/30 p-1 shadow-inner">
						<TabsTrigger className={triggerClass} value="General">
							<Settings className="h-4 w-4 shrink-0" />
							{generalLabel}
						</TabsTrigger>
						<TabsTrigger className={triggerClass} value="Display">
							<Monitor className="h-4 w-4 shrink-0" />
							{displayLabel}
						</TabsTrigger>
						<TabsTrigger className={triggerClass} value="Azan">
							<Bell className="h-4 w-4 shrink-0" />
							{azanLabel}
						</TabsTrigger>
						<TabsTrigger className={triggerClass} value="Calculation">
							<Calculator className="h-4 w-4 shrink-0" />
							{calculationLabel}
						</TabsTrigger>
					</TabsList>
					<TabsContent className="mt-6" value="General">
						<GeneralTab
							onSettingsChange={onSettingsChange}
							settings={settings}
							t={t}
						/>
					</TabsContent>
					<TabsContent className="mt-6" value="Display">
						<DisplayTab
							onSettingsChange={onSettingsChange}
							settings={settings}
							t={t}
						/>
					</TabsContent>
					<TabsContent className="mt-6" value="Azan">
						<AzanTab
							onSettingsChange={onSettingsChange}
							settings={settings}
							t={t}
						/>
					</TabsContent>
					<TabsContent className="mt-6" value="Calculation">
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
