import { Card } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import type { TabCommonProps } from "../types";

export function GeneralTab({ settings, onSettingsChange, t }: TabCommonProps) {
	return (
		<Card className="bg-background p-4 text-foreground">
			<div className="space-y-3">
				<div className="grid grid-cols-1 gap-3">
					<div className="flex items-center justify-between gap-3">
						<Label className="text-sm">{t("settings.language")}</Label>
						<Select
							onValueChange={(value) =>
								onSettingsChange({ language: value as "en" | "ar" })
							}
							value={settings.language || "en"}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="en">English</SelectItem>
								<SelectItem value="ar">العربية</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center justify-between">
						<Label className="text-sm">{t("settings.timeFormat24h")}</Label>
						<Switch
							checked={settings.timeFormat24h ?? true}
							onCheckedChange={(checked) =>
								onSettingsChange({ timeFormat24h: checked })
							}
						/>
					</div>
				</div>
			</div>
		</Card>
	);
}
