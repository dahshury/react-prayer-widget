import { MinusIcon, PlusIcon } from "lucide-react";
import {
	CounterMinusButton as CounterMinusButtonPrimitive,
	CounterNumber as CounterNumberPrimitive,
	CounterPlusButton as CounterPlusButtonPrimitive,
	Counter as CounterPrimitive,
	type CounterProps as CounterPropsPrimitive,
} from "@/components/animate-ui/primitives/animate/counter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CounterProps = Omit<CounterPropsPrimitive, "children" | "asChild">;

function Counter({ className, ...props }: CounterProps) {
	return (
		<CounterPrimitive
			className={cn("flex items-center p-1 border rounded-lg", className)}
			{...props}
		>
			<CounterMinusButtonPrimitive asChild>
				<Button size="icon" variant="ghost" className="rounded-sm">
					<MinusIcon className="size-4" />
				</Button>
			</CounterMinusButtonPrimitive>
			<CounterNumberPrimitive className="px-2.5" />
			<CounterPlusButtonPrimitive asChild>
				<Button size="icon" variant="ghost" className="rounded-sm">
					<PlusIcon className="size-4" />
				</Button>
			</CounterPlusButtonPrimitive>
		</CounterPrimitive>
	);
}

export { Counter, type CounterProps };
