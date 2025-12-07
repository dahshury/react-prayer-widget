"use client";

import { Calculator, Clock } from "lucide-react";
import type { AsrMethodId, CalculationMethodId } from "@/entities/prayer/model";
import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { ASR_METHODS, CALCULATION_METHODS } from "../../config/constants";
import type { TabCommonProps } from "../../model/types";
import { OffsetControl } from "../offset-control";

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

export function CalculationTab({
	settings,
	onSettingsChange,
	t,
}: TabCommonProps) {
	return (
		<div className="space-y-6">
			<Section
				icon={Calculator}
				title={t("settings.calculationMethod") || "Calculation Methods"}
			>
				<SettingRow
					description="Method used to calculate prayer times"
					label={t("settings.calculationMethod") || "Calculation method"}
				>
					<Select
						onValueChange={(value) => {
							const method = Number.parseInt(value, 10) as CalculationMethodId;
							onSettingsChange({ calculationMethod: method });
						}}
						value={settings.calculationMethod.toString()}
					>
						<SelectTrigger className="w-[280px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{CALCULATION_METHODS.map((method) => (
								<SelectItem key={method.value} value={method.value.toString()}>
									{t(`settings.calculationMethodNames.${method.tKey}`) !==
									`settings.calculationMethodNames.${method.tKey}`
										? t(`settings.calculationMethodNames.${method.tKey}`)
										: method.fallback}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</SettingRow>
				<SettingRow
					description="Method for calculating Asr prayer time"
					label={t("settings.asrCalculation") || "Asr calculation"}
				>
					<Select
						onValueChange={(value) => {
							const method = Number.parseInt(value, 10) as AsrMethodId;
							onSettingsChange({ asrMethod: method });
						}}
						value={settings.asrMethod.toString()}
					>
						<SelectTrigger className="w-[280px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ASR_METHODS.map((method) => (
								<SelectItem key={method.value} value={method.value.toString()}>
									{t(`settings.asrMethods.${method.tKey}`) !==
									`settings.asrMethods.${method.tKey}`
										? t(`settings.asrMethods.${method.tKey}`)
										: method.fallback}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</SettingRow>
			</Section>

			<Section
				icon={Clock}
				title={t("settings.timeAdjustments") || "Time Adjustments"}
			>
				<div className="space-y-2">
					<p className="text-muted-foreground text-xs">
						{t("settings.timeAdjustmentsHelp") ||
							"Adjust prayer times by minutes. Use + to add time, - to subtract."}
					</p>
					<div className="space-y-3 rounded-lg border border-muted/30 bg-muted/10 p-4">
						<OffsetControl
							label="Fajr"
							onChange={(d) =>
								onSettingsChange({
									fajrOffset: (settings.fajrOffset || 0) + d,
								})
							}
							value={settings.fajrOffset}
						/>
						<OffsetControl
							label="Dhuhr"
							onChange={(d) =>
								onSettingsChange({
									dhuhrOffset: (settings.dhuhrOffset || 0) + d,
								})
							}
							value={settings.dhuhrOffset}
						/>
						<OffsetControl
							label="Asr"
							onChange={(d) =>
								onSettingsChange({ asrOffset: (settings.asrOffset || 0) + d })
							}
							value={settings.asrOffset}
						/>
						<OffsetControl
							label="Maghrib"
							onChange={(d) =>
								onSettingsChange({
									maghribOffset: (settings.maghribOffset || 0) + d,
								})
							}
							value={settings.maghribOffset}
						/>
						<OffsetControl
							label="Isha"
							onChange={(d) =>
								onSettingsChange({
									ishaOffset: (settings.ishaOffset || 0) + d,
								})
							}
							value={settings.ishaOffset}
						/>
					</div>
				</div>
			</Section>
		</div>
	);
}
