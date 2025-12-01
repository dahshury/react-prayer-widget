import Color from "color";
import { Pipette } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
	ColorPicker,
	ColorPickerAlpha,
	ColorPickerEyeDropper,
	ColorPickerHue,
	ColorPickerOutput,
	ColorPickerSelection,
} from "@/shared/ui/shadcn-io/color-picker";

type ColorPickerGroupProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	ariaLabel?: string;
};

export function ColorPickerGroup({
	label,
	value,
	onChange,
	ariaLabel,
}: ColorPickerGroupProps) {
	const safeHex = (val: unknown) => {
		try {
			const c = Array.isArray(val)
				? Color.rgb(
						val as [number, number, number] | [number, number, number, number]
					)
				: Color(String(val || "#ffffff"));
			return c.hex().toLowerCase();
		} catch {
			return "#ffffff";
		}
	};

	return (
		<div className="flex items-center gap-2 px-2">
			<Label className="whitespace-nowrap text-sm">{label}</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						aria-label={ariaLabel || `Pick ${label} color`}
						className="flex h-8 w-8 items-center justify-center rounded-md p-0"
						style={{ backgroundColor: value || "#ffffff" }}
						type="button"
						variant="outline"
					>
						<Pipette className="h-3.5 w-3.5 opacity-80" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-80">
					<ColorPicker
						onChange={(val) => onChange(safeHex(val))}
						value={value || "#ffffff"}
					>
						<ColorPickerSelection className="h-28" />
						<div className="flex items-center gap-4">
							<ColorPickerEyeDropper />
							<div className="grid w-full gap-1">
								<ColorPickerHue />
								<ColorPickerAlpha />
							</div>
						</div>
						<div className="flex items-center gap-2">
							<ColorPickerOutput />
						</div>
					</ColorPicker>
				</PopoverContent>
			</Popover>
		</div>
	);
}
