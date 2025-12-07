"use client";

// biome-ignore lint/performance/noNamespaceImport: Radix UI components are designed as namespace exports
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import type * as React from "react";
import { useControlledState } from "@/shared/lib/hooks";
import { getStrictContext } from "@/shared/lib/react";
import {
	Highlight,
	HighlightItem,
	type HighlightItemProps,
	type HighlightProps,
} from "@/shared/ui/animate/primitives/effects/highlight";

type TabsContextType = {
	value: string | undefined;
	setValue: TabsProps["onValueChange"];
};

const [TabsProvider, useTabs] =
	getStrictContext<TabsContextType>("TabsContext");

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>;

function Tabs(props: TabsProps) {
	const [value, setValue] = useControlledState({
		value: props.value,
		defaultValue: props.defaultValue,
		onChange: props.onValueChange,
	});

	return (
		<TabsProvider value={{ value, setValue }}>
			<TabsPrimitive.Root
				data-slot="tabs"
				{...props}
				onValueChange={setValue}
			/>
		</TabsProvider>
	);
}

type TabsHighlightProps = Omit<HighlightProps, "controlledItems" | "value">;

function TabsHighlight({
	transition = { type: "spring", stiffness: 200, damping: 25 },
	...props
}: TabsHighlightProps) {
	const { value } = useTabs();

	return (
		<Highlight
			click={false}
			controlledItems
			data-slot="tabs-highlight"
			transition={transition}
			value={value}
			{...props}
		/>
	);
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;

function TabsList(props: TabsListProps) {
	return <TabsPrimitive.List data-slot="tabs-list" {...props} />;
}

type TabsHighlightItemProps = HighlightItemProps & {
	value: string;
};

function TabsHighlightItem(props: TabsHighlightItemProps) {
	return <HighlightItem data-slot="tabs-highlight-item" {...props} />;
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>;

function TabsTrigger(props: TabsTriggerProps) {
	return <TabsPrimitive.Trigger data-slot="tabs-trigger" {...props} />;
}

type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content> &
	HTMLMotionProps<"div">;

function TabsContent({
	value,
	forceMount,
	transition = { duration: 0.5, ease: "easeInOut" },
	...props
}: TabsContentProps) {
	return (
		<AnimatePresence mode="wait">
			<TabsPrimitive.Content asChild forceMount={forceMount} value={value}>
				<motion.div
					animate={{ opacity: 1, filter: "blur(0px)" }}
					data-slot="tabs-content"
					exit={{ opacity: 0, filter: "blur(4px)" }}
					initial={{ opacity: 0, filter: "blur(4px)" }}
					layout
					layoutDependency={value}
					transition={transition}
					{...props}
				/>
			</TabsPrimitive.Content>
		</AnimatePresence>
	);
}

type TabsContentsProps = HTMLMotionProps<"div"> & {
	children: React.ReactNode;
};

function TabsContents({
	transition = { type: "spring", stiffness: 200, damping: 30 },
	style,
	...props
}: TabsContentsProps) {
	const { value } = useTabs();

	return (
		<motion.div
			data-slot="tabs-contents"
			layout="size"
			layoutDependency={value}
			style={{ overflow: "hidden", ...style }}
			transition={{ layout: transition }}
			{...props}
		/>
	);
}

export {
	Tabs,
	TabsHighlight,
	TabsHighlightItem,
	TabsList,
	TabsTrigger,
	TabsContent,
	TabsContents,
	type TabsProps,
	type TabsHighlightProps,
	type TabsHighlightItemProps,
	type TabsListProps,
	type TabsTriggerProps,
	type TabsContentProps,
	type TabsContentsProps,
};
