"use client";

import { AnimatePresence, motion } from "motion/react";
import React, {
	type ElementType,
	type ReactElement,
	useEffect,
	useId,
	useImperativeHandle,
	useRef,
} from "react";

import { cn } from "@/shared/libs/utils/cn";
import { useHighlight } from "./highlight.context";
import type {
	Bounds,
	ExtendedChildProps,
	HighlightItemProps,
} from "./highlight.types";
import { getNonOverridingDataAttributes } from "./highlight.utils";

// Constants
const MS_TO_SECONDS = 1000;

// Helper component: Highlight background animation
function HighlightBackground({
	isActive,
	isDisabled,
	contextClassName,
	activeClassName,
	contextStyle,
	style,
	itemTransition,
	exitDelay,
	contextExitDelay,
	contextId,
}: {
	isActive: boolean;
	isDisabled: boolean;
	contextClassName: string | undefined;
	activeClassName: string | undefined;
	contextStyle: React.CSSProperties | undefined;
	style: React.CSSProperties | undefined;
	itemTransition: Record<string, unknown> | undefined;
	exitDelay: number | undefined;
	contextExitDelay: number | undefined;
	contextId: string;
}) {
	if (!isActive || isDisabled) {
		return null;
	}

	return (
		<motion.div
			animate={{ opacity: 1 }}
			className={cn(contextClassName, activeClassName)}
			data-slot="motion-highlight"
			exit={{
				opacity: 0,
				transition: {
					...itemTransition,
					delay:
						((itemTransition?.delay as number | undefined) ?? 0) +
						(exitDelay ?? contextExitDelay ?? 0) / MS_TO_SECONDS,
				},
			}}
			initial={{ opacity: 0 }}
			layoutId={`transition-background-${contextId}`}
			style={{
				position: "absolute",
				zIndex: 0,
				...contextStyle,
				...style,
			}}
			transition={itemTransition}
		/>
	);
}

// Helper: Build common event handlers
function buildCommonHandlers(opts: {
	hover: boolean;
	click: boolean;
	childValue: string;
	setActiveValue: (value: string | null) => void;
	element: ReactElement<ExtendedChildProps>;
}) {
	if (opts.hover) {
		return {
			onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
				opts.setActiveValue(opts.childValue);
				opts.element.props.onMouseEnter?.(e);
			},
			onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
				opts.setActiveValue(null);
				opts.element.props.onMouseLeave?.(e);
			},
		};
	}

	if (opts.click) {
		return {
			onClick: (e: React.MouseEvent<HTMLDivElement>) => {
				opts.setActiveValue(opts.childValue);
				opts.element.props.onClick?.(e);
			},
		};
	}

	return {};
}

function HighlightItem<T extends ElementType>({
	ref,
	as,
	children,
	id,
	value,
	className,
	style,
	transition,
	disabled = false,
	activeClassName,
	exitDelay,
	asChild = false,
	forceUpdateBounds,
	...props
}: HighlightItemProps<T>) {
	const itemId = useId();
	const {
		activeValue,
		setActiveValue,
		mode,
		setBounds,
		clearBounds,
		hover,
		click,
		enabled,
		className: contextClassName,
		style: contextStyle,
		transition: contextTransition,
		id: contextId,
		disabled: contextDisabled,
		exitDelay: contextExitDelay,
		forceUpdateBounds: contextForceUpdateBounds,
		setActiveClassName,
	} = useHighlight();

	const Component = as ?? "div";
	const element = children as ReactElement<ExtendedChildProps>;
	const childValue =
		id ?? value ?? element.props?.["data-value"] ?? element.props?.id ?? itemId;
	const isActive = activeValue === childValue;
	const isDisabled = disabled === undefined ? contextDisabled : disabled;
	const itemTransition = transition ?? contextTransition;

	const localRef = useRef<HTMLDivElement>(null);
	useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

	useEffect(() => {
		if (mode !== "parent") {
			return;
		}
		let rafId: number;
		let previousBounds: Bounds | null = null;
		const shouldUpdateBounds =
			forceUpdateBounds === true ||
			(contextForceUpdateBounds && forceUpdateBounds !== false);

		const updateBounds = () => {
			if (!localRef.current) {
				return;
			}

			const bounds = localRef.current.getBoundingClientRect();

			if (shouldUpdateBounds) {
				if (
					previousBounds &&
					previousBounds.top === bounds.top &&
					previousBounds.left === bounds.left &&
					previousBounds.width === bounds.width &&
					previousBounds.height === bounds.height
				) {
					rafId = requestAnimationFrame(updateBounds);
					return;
				}
				previousBounds = bounds;
				rafId = requestAnimationFrame(updateBounds);
			}

			setBounds(bounds);
		};

		if (isActive) {
			updateBounds();
			setActiveClassName(activeClassName ?? "");
		} else if (!activeValue) {
			clearBounds();
		}

		if (shouldUpdateBounds) {
			return () => cancelAnimationFrame(rafId);
		}
	}, [
		mode,
		isActive,
		activeValue,
		setBounds,
		clearBounds,
		activeClassName,
		setActiveClassName,
		forceUpdateBounds,
		contextForceUpdateBounds,
	]);

	if (!React.isValidElement(children)) {
		return children;
	}

	const dataAttributes = {
		"data-active": isActive ? "true" : "false",
		"aria-selected": isActive,
		"data-disabled": isDisabled,
		"data-value": childValue,
		"data-highlight": true,
	};

	const commonHandlers = buildCommonHandlers({
		hover,
		click,
		childValue,
		setActiveValue,
		element,
	});

	if (asChild) {
		if (mode === "children") {
			return React.cloneElement(
				element,
				{
					key: childValue,
					ref: localRef,
					className: cn("relative", element.props.className),
					...getNonOverridingDataAttributes(element, {
						...dataAttributes,
						"data-slot": "motion-highlight-item-container",
					}),
					...commonHandlers,
					...props,
				},
				<>
					<AnimatePresence initial={false} mode="wait">
						<HighlightBackground
							activeClassName={activeClassName}
							contextClassName={contextClassName}
							contextExitDelay={contextExitDelay}
							contextId={contextId}
							contextStyle={contextStyle}
							exitDelay={exitDelay}
							isActive={isActive}
							isDisabled={isDisabled}
							itemTransition={itemTransition}
							style={style}
						/>
					</AnimatePresence>

					<Component
						className={className}
						data-slot="motion-highlight-item"
						style={{ position: "relative", zIndex: 1 }}
						{...dataAttributes}
					>
						{children}
					</Component>
				</>
			);
		}

		return React.cloneElement(element, {
			ref: localRef,
			...getNonOverridingDataAttributes(element, {
				...dataAttributes,
				"data-slot": "motion-highlight-item",
			}),
			...commonHandlers,
		});
	}

	if (!enabled) {
		return (
			<Component {...dataAttributes} {...props}>
				{children}
			</Component>
		);
	}

	return (
		<Component
			className={cn(mode === "children" && "relative", className)}
			data-slot="motion-highlight-item-container"
			key={childValue}
			ref={localRef}
			{...dataAttributes}
			{...props}
			{...commonHandlers}
		>
			{mode === "children" && (
				<AnimatePresence initial={false} mode="wait">
					<HighlightBackground
						activeClassName={activeClassName}
						contextClassName={contextClassName}
						contextExitDelay={contextExitDelay}
						contextId={contextId}
						contextStyle={contextStyle}
						exitDelay={exitDelay}
						isActive={isActive}
						isDisabled={isDisabled}
						itemTransition={itemTransition}
						style={style}
					/>
				</AnimatePresence>
			)}
			{children}
		</Component>
	);
}

export { HighlightItem };
