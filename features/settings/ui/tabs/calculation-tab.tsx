"use client";

import type { AsrMethodId, CalculationMethodId } from "@/entities/prayer/model";
import { Card } from "@/shared/ui/card";
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

export function CalculationTab({
	settings,
	onSettingsChange,
	t,
}: TabCommonProps) {
	return (
		<Card className="bg-background p-4 text-foreground">
			<div className="space-y-3">
				<div className="space-y-3">
					<div className="flex items-center justify-between gap-3">
						<Label className="text-sm">{t("settings.calculationMethod")}</Label>
						<Select
							onValueChange={(value) => {
								const method = Number.parseInt(
									value,
									10
								) as CalculationMethodId;
								onSettingsChange({ calculationMethod: method });
							}}
							value={settings.calculationMethod.toString()}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CALCULATION_METHODS.map((method) => (
									<SelectItem
										key={method.value}
										value={method.value.toString()}
									>
										{t(`settings.calculationMethodNames.${method.tKey}`) !==
										`settings.calculationMethodNames.${method.tKey}`
											? t(`settings.calculationMethodNames.${method.tKey}`)
											: method.fallback}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center justify-between gap-3">
						<Label className="text-sm">{t("settings.asrCalculation")}</Label>
						<Select
							onValueChange={(value) => {
								const method = Number.parseInt(value, 10) as AsrMethodId;
								onSettingsChange({ asrMethod: method });
							}}
							value={settings.asrMethod.toString()}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{ASR_METHODS.map((method) => (
									<SelectItem
										key={method.value}
										value={method.value.toString()}
									>
										{t(`settings.asrMethods.${method.tKey}`) !==
										`settings.asrMethods.${method.tKey}`
											? t(`settings.asrMethods.${method.tKey}`)
											: method.fallback}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label className="font-semibold text-sm">
							{t("settings.timeAdjustments")}
						</Label>
						<p className="text-muted-foreground text-xs">
							{t("settings.timeAdjustmentsHelp")}
						</p>
						<div
							className="space-y-1 rounded-md p-2"
							style={{ backgroundColor: "#161921" }}
						>
							<OffsetControl
								label="Fajr"
								onChange={(d) =>
									onSettingsChange({
										fajrOffset: (settings.fajrOffset || 0) + d,
									})
								}
								unstyled
								value={settings.fajrOffset}
							/>
							<OffsetControl
								label="Dhuhr"
								onChange={(d) =>
									onSettingsChange({
										dhuhrOffset: (settings.dhuhrOffset || 0) + d,
									})
								}
								unstyled
								value={settings.dhuhrOffset}
							/>
							<OffsetControl
								label="Asr"
								onChange={(d) =>
									onSettingsChange({ asrOffset: (settings.asrOffset || 0) + d })
								}
								unstyled
								value={settings.asrOffset}
							/>
							<OffsetControl
								label="Maghrib"
								onChange={(d) =>
									onSettingsChange({
										maghribOffset: (settings.maghribOffset || 0) + d,
									})
								}
								unstyled
								value={settings.maghribOffset}
							/>
							<OffsetControl
								label="Isha"
								onChange={(d) =>
									onSettingsChange({
										ishaOffset: (settings.ishaOffset || 0) + d,
									})
								}
								unstyled
								value={settings.ishaOffset}
							/>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
