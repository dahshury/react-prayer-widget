"use client";

import { type HTMLMotionProps, motion, type Transition } from "motion/react";
import {
	Children,
	type ComponentProps,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import { getStrictContext } from "@/shared/libs/react/get-strict-context";
import {
	Slot,
	type WithAsChild,
} from "@/shared/ui/animate/primitives/animate/slot";
import {
	Highlight,
	HighlightItem,
	type HighlightItemProps,
	type HighlightProps,
} from "@/shared/ui/animate/primitives/effects/highlight";

type TabsContextType = {
	activeValue: string;
	handleValueChange: (value: string) => void;
	registerTrigger: (value: string, node: HTMLElement | null) => void;
};

const [TabsProvider, useTabs] =
	getStrictContext<TabsContextType>("TabsContext");

type BaseTabsProps = ComponentProps<"div"> & {
	children: ReactNode;
};

type UnControlledTabsProps = BaseTabsProps & {
	defaultValue?: string;
	value?: never;
	onValueChange?: never;
};

type ControlledTabsProps = BaseTabsProps & {
	value: string;
	onValueChange?: (value: string) => void;
	defaultValue?: never;
};

type TabsProps = UnControlledTabsProps | ControlledTabsProps;

function Tabs({
	defaultValue,
	value,
	onValueChange,
	children,
	...props
}: TabsProps) {
	const [activeValue, setActiveValue] = useState<string | undefined>(
		defaultValue
	);
	const triggersRef = useRef(new Map<string, HTMLElement>());
	const initialSet = useRef(false);
	const isControlled = value !== undefined;

	useEffect(() => {
		if (
			!isControlled &&
			activeValue === undefined &&
			triggersRef.current.size > 0 &&
			!initialSet.current
		) {
			const firstTab = triggersRef.current.keys().next().value as
				| string
				| undefined;
			if (firstTab !== undefined) {
				setActiveValue(firstTab);
				initialSet.current = true;
			}
		}
	}, [activeValue, isControlled]);

	const registerTrigger = useCallback(
		(val: string, node: HTMLElement | null) => {
			if (node) {
				triggersRef.current.set(val, node);
				if (!isControlled && activeValue === undefined && !initialSet.current) {
					setActiveValue(val);
					initialSet.current = true;
				}
			} else {
				triggersRef.current.delete(val);
			}
		},
		[activeValue, isControlled]
	);

	const handleValueChange = useCallback(
		(val: string) => {
			if (isControlled) {
				onValueChange?.(val);
			} else {
				setActiveValue(val);
			}
		},
		[isControlled, onValueChange]
	);

	return (
		<TabsProvider
			value={{
				activeValue: (value ?? activeValue) as string,
				handleValueChange,
				registerTrigger,
			}}
		>
			<div data-slot="tabs" {...props}>
				{children}
			</div>
		</TabsProvider>
	);
}

type TabsHighlightProps = Omit<HighlightProps, "controlledItems" | "value">;

function TabsHighlight({
	transition = { type: "spring", stiffness: 200, damping: 25 },
	...props
}: TabsHighlightProps) {
	const { activeValue } = useTabs();

	return (
		<Highlight
			click={false}
			controlledItems
			data-slot="tabs-highlight"
			transition={transition}
			value={activeValue}
			{...props}
		/>
	);
}

type TabsListProps = ComponentProps<"div"> & {
	children: ReactNode;
};

function TabsList(props: TabsListProps) {
	return <div data-slot="tabs-list" role="tablist" {...props} />;
}

type TabsHighlightItemProps = HighlightItemProps & {
	value: string;
};

function TabsHighlightItem(props: TabsHighlightItemProps) {
	return <HighlightItem data-slot="tabs-highlight-item" {...props} />;
}

type TabsTriggerProps = WithAsChild<
	{
		value: string;
		children: ReactNode;
	} & HTMLMotionProps<"button">
>;

function TabsTrigger({
	ref,
	value,
	asChild = false,
	...props
}: TabsTriggerProps) {
	const { activeValue, handleValueChange, registerTrigger } = useTabs();

	const localRef = useRef<HTMLButtonElement | null>(null);
	useImperativeHandle(ref, () => localRef.current as HTMLButtonElement);

	useEffect(() => {
		registerTrigger(value, localRef.current);
		return () => registerTrigger(value, null);
	}, [value, registerTrigger]);

	const Component = asChild ? Slot : motion.button;

	return (
		<Component
			data-slot="tabs-trigger"
			data-state={activeValue === value ? "active" : "inactive"}
			onClick={() => handleValueChange(value)}
			ref={localRef}
			role="tab"
			{...props}
		/>
	);
}

type TabsContentsProps = ComponentProps<"div"> & {
	children: ReactNode;
	transition?: Transition;
};

function TabsContents({
	children,
	style,
	transition = {
		type: "spring",
		stiffness: 300,
		damping: 32,
		bounce: 0,
		restDelta: 0.01,
	},
	...props
}: TabsContentsProps) {
	const { activeValue } = useTabs();
	const childrenArray = useMemo(() => Children.toArray(children), [children]);
	const activeIndex = useMemo(
		() =>
			childrenArray.findIndex(
				(child): child is ReactElement<{ value: string }> =>
					isValidElement(child) &&
					typeof child.props === "object" &&
					child.props !== null &&
					"value" in child.props &&
					child.props.value === activeValue
			),
		[childrenArray, activeValue]
	);

	return (
		<div
			data-slot="tabs-contents"
			style={{ overflow: "hidden", ...style }}
			{...props}
		>
			<motion.div
				animate={{ x: `${activeIndex * -100}%` }}
				style={{ display: "flex", marginInline: "-20px" }}
				transition={transition}
			>
				{childrenArray.map((child, index) => (
					<div
						key={(child as ReactElement).key || index}
						style={{ width: "100%", flexShrink: 0, paddingInline: "20px" }}
					>
						{child}
					</div>
				))}
			</motion.div>
		</div>
	);
}

type TabsContentProps = WithAsChild<
	{
		value: string;
		children: ReactNode;
	} & HTMLMotionProps<"div">
>;

function TabsContent({
	value,
	style,
	asChild = false,
	...props
}: TabsContentProps) {
	const { activeValue } = useTabs();
	const isActive = activeValue === value;

	const Component = asChild ? Slot : motion.div;

	return (
		<Component
			animate={{ filter: isActive ? "blur(0px)" : "blur(4px)" }}
			data-slot="tabs-content"
			exit={{ filter: "blur(0px)" }}
			initial={{ filter: "blur(0px)" }}
			role="tabpanel"
			style={{ overflow: "hidden", ...style }}
			transition={{ type: "spring", stiffness: 200, damping: 25 }}
			{...props}
		/>
	);
}

export {
	Tabs,
	TabsList,
	TabsHighlight,
	TabsHighlightItem,
	TabsTrigger,
	TabsContents,
	TabsContent,
	useTabs,
	type TabsProps,
	type TabsListProps,
	type TabsHighlightProps,
	type TabsHighlightItemProps,
	type TabsTriggerProps,
	type TabsContentsProps,
	type TabsContentProps,
	type TabsContextType,
};
