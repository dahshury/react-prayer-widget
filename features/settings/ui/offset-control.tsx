import { Minus, Plus } from "lucide-react";
import {
	CounterMinusButton as CounterMinusButtonPrimitive,
	CounterNumber as CounterNumberPrimitive,
	CounterPlusButton as CounterPlusButtonPrimitive,
	Counter as CounterPrimitive,
} from "@/shared/ui/animate/primitives/animate/counter";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";

const OFFSET_MIN = -30; // Minimum prayer time offset in minutes
const OFFSET_MAX = 30; // Maximum prayer time offset in minutes

type OffsetControlProps = {
	label: string;
	value: number;
	onChange: (delta: number) => void;
	unstyled?: boolean;
	className?: string;
};

export function OffsetControl({
	label,
	value,
	onChange,
	unstyled,
	className,
}: OffsetControlProps) {
	const rowClass = `${"flex items-center justify-between p-2"}${unstyled ? "" : " bg-muted/50 rounded-md"}${className ? ` ${className}` : ""}`;
	return (
		<div className={rowClass}>
			<Label className="font-medium text-xs">{label}</Label>
			<CounterPrimitive
				className="flex items-center gap-1.5"
				onValueChange={(next) => {
					if (next < OFFSET_MIN || next > OFFSET_MAX) {
						return;
					}
					const delta = next - value;
					if (delta !== 0) {
						onChange(delta);
					}
				}}
				value={value}
			>
				<CounterMinusButtonPrimitive asChild>
					<Button
						className="h-6 w-6 p-0"
						disabled={value <= OFFSET_MIN}
						size="sm"
						type="button"
						variant="outline"
					>
						<Minus className="h-3 w-3" />
					</Button>
				</CounterMinusButtonPrimitive>
				<span className="min-w-[2.25rem] text-center font-mono text-xs">
					{value > 0 ? "+" : ""}
					<CounterNumberPrimitive />
				</span>
				<CounterPlusButtonPrimitive asChild>
					<Button
						className="h-6 w-6 p-0"
						disabled={value >= OFFSET_MAX}
						size="sm"
						type="button"
						variant="outline"
					>
						<Plus className="h-3 w-3" />
					</Button>
				</CounterPlusButtonPrimitive>
			</CounterPrimitive>
		</div>
	);
}
