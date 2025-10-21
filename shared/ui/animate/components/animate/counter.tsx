import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	CounterMinusButton as CounterMinusButtonPrimitive,
	CounterNumber as CounterNumberPrimitive,
	CounterPlusButton as CounterPlusButtonPrimitive,
	Counter as CounterPrimitive,
	type CounterProps as CounterPropsPrimitive,
} from "@/shared/ui/animate/primitives/animate/counter";
import { Button } from "@/shared/ui/button";

type CounterProps = Omit<CounterPropsPrimitive, "children" | "asChild">;

function Counter({ className, ...props }: CounterProps) {
	return (
		<CounterPrimitive
			className={cn("flex items-center rounded-lg border p-1", className)}
			{...props}
		>
			<CounterMinusButtonPrimitive asChild>
				<Button className="rounded-sm" size="icon" variant="ghost">
					<MinusIcon className="size-4" />
				</Button>
			</CounterMinusButtonPrimitive>
			<CounterNumberPrimitive className="px-2.5" />
			<CounterPlusButtonPrimitive asChild>
				<Button className="rounded-sm" size="icon" variant="ghost">
					<PlusIcon className="size-4" />
				</Button>
			</CounterPlusButtonPrimitive>
		</CounterPrimitive>
	);
}

export { Counter, type CounterProps };
