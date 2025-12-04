"use client";

import { Tabs as TabsPrimitive } from "radix-ui";
import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	type ForwardRefExoticComponent,
	forwardRef,
	type RefAttributes,
} from "react";

import { cn } from "@/shared/lib/utils";

type TabsRootComponent = typeof TabsPrimitive.Root;
type TabsListElement = ElementRef<typeof TabsPrimitive.List>;
type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>;
type TabsListComponent = ForwardRefExoticComponent<
	TabsListProps & RefAttributes<TabsListElement>
>;
type TabsTriggerElement = ElementRef<typeof TabsPrimitive.Trigger>;
type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;
type TabsTriggerComponent = ForwardRefExoticComponent<
	TabsTriggerProps & RefAttributes<TabsTriggerElement>
>;
type TabsContentElement = ElementRef<typeof TabsPrimitive.Content>;
type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;
type TabsContentComponent = ForwardRefExoticComponent<
	TabsContentProps & RefAttributes<TabsContentElement>
>;

const Tabs: TabsRootComponent = TabsPrimitive.Root;

const TabsList: TabsListComponent = forwardRef<TabsListElement, TabsListProps>(
	({ className, ...props }, ref) => (
		<TabsPrimitive.List
			className={cn(
				"inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
				className
			)}
			ref={ref}
			{...props}
		/>
	)
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger: TabsTriggerComponent = forwardRef<
	TabsTriggerElement,
	TabsTriggerProps
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		className={cn(
			"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
			className
		)}
		ref={ref}
		{...props}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent: TabsContentComponent = forwardRef<
	TabsContentElement,
	TabsContentProps
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		className={cn(
			"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className
		)}
		ref={ref}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
