"use client";

import { type HTMLMotionProps, motion, type Transition } from "motion/react";
import type * as React from "react";
import { useControlledState } from "@/shared/lib/hooks";
import { getStrictContext } from "@/shared/lib/react";
import {
	Slot,
	type WithAsChild,
} from "@/shared/ui/animate/primitives/animate/slot";
import {
	SlidingNumber,
	type SlidingNumberProps,
} from "@/shared/ui/animate/primitives/texts/sliding-number";

type CounterContextType = {
	value: number;
	setValue: (value: number) => void;
};

const [CounterProvider, useCounter] =
	getStrictContext<CounterContextType>("CounterContext");

type BaseCounterProps = HTMLMotionProps<"div"> & {
	children: React.ReactNode;
	transition?: Transition;
};

type CounterControlProps = {
	value?: number;
	defaultValue?: number;
	onValueChange?: (value: number) => void;
};

type CounterProps = WithAsChild<BaseCounterProps & CounterControlProps>;

function Counter({
	value,
	defaultValue = 0,
	onValueChange,
	transition = { type: "spring", bounce: 0, stiffness: 300, damping: 30 },
	asChild = false,
	...props
}: CounterProps) {
	const [number, setNumber] = useControlledState({
		value,
		defaultValue,
		onChange: onValueChange,
	});

	const Component = asChild ? Slot : motion.div;

	return (
		<CounterProvider value={{ value: number, setValue: setNumber }}>
			<Component
				data-slot="counter"
				layout
				transition={transition}
				{...props}
			/>
		</CounterProvider>
	);
}

type CounterMinusButtonProps = WithAsChild<HTMLMotionProps<"button">>;

const CounterMinusButton = ({
	onClick,
	asChild = false,
	...props
}: CounterMinusButtonProps) => {
	const { setValue, value } = useCounter();

	if (asChild) {
		const { asChild: _ignoreAsChild, ...restAsChild } = props as Omit<
			HTMLMotionProps<"button">,
			"children"
		> & { children?: React.ReactElement } & { asChild?: boolean };
		return (
			<Slot
				data-slot="counter-minus-button"
				onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
					setValue(value - 1);
					onClick?.(e);
				}}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				{...(restAsChild as import("./slot").SlotProps<HTMLButtonElement>)}
			/>
		);
	}

	const { asChild: _ignore, ...rest } = props as HTMLMotionProps<"button"> & {
		asChild?: boolean;
	};
	return (
		<motion.button
			data-slot="counter-minus-button"
			onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
				setValue(value - 1);
				onClick?.(e);
			}}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			{...rest}
		/>
	);
};

type CounterPlusButtonProps = WithAsChild<HTMLMotionProps<"button">>;

const CounterPlusButton = ({
	onClick,
	asChild = false,
	...props
}: CounterPlusButtonProps) => {
	const { setValue, value } = useCounter();

	if (asChild) {
		const { asChild: _ignoreAsChild, ...restAsChild } = props as Omit<
			HTMLMotionProps<"button">,
			"children"
		> & { children?: React.ReactElement } & { asChild?: boolean };
		return (
			<Slot
				data-slot="counter-plus-button"
				onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
					setValue(value + 1);
					onClick?.(e);
				}}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				{...(restAsChild as import("./slot").SlotProps<HTMLButtonElement>)}
			/>
		);
	}

	const { asChild: _ignore, ...rest } = props as HTMLMotionProps<"button"> & {
		asChild?: boolean;
	};
	return (
		<motion.button
			data-slot="counter-plus-button"
			onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
				setValue(value + 1);
				onClick?.(e);
			}}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			{...rest}
		/>
	);
};

type CounterNumberProps = Omit<SlidingNumberProps, "number">;

const CounterNumber = (props: CounterNumberProps) => {
	const { value } = useCounter();

	return <SlidingNumber data-slot="counter-number" number={value} {...props} />;
};

export {
	Counter,
	CounterMinusButton,
	CounterPlusButton,
	CounterNumber,
	type CounterProps,
	type CounterMinusButtonProps,
	type CounterPlusButtonProps,
	type CounterContextType,
};
