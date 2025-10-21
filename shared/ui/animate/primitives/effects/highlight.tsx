"use client";

import { AnimatePresence, motion } from "motion/react";
import React, {
	type ElementType,
	type ReactElement,
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

import { cn } from "@/lib/utils";
import { HighlightContext } from "./highlight.context";
import type { Bounds, HighlightProps } from "./highlight.types";
import { HighlightItem } from "./highlight-item";

// Constants
const MS_TO_SECONDS = 1000;

function Highlight<T extends ElementType = "div">({
	ref,
	...props
}: HighlightProps<T>) {
	const {
		as: Component = "div",
		children,
		value,
		defaultValue,
		onValueChange,
		className,
		style,
		transition = { type: "spring", stiffness: 350, damping: 35 },
		hover = false,
		click = true,
		enabled = true,
		controlledItems,
		disabled = false,
		exitDelay = 200,
		mode = "children",
	} = props;

	const localRef = useRef<HTMLDivElement>(null);
	useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

	const [activeValue, setActiveValue] = useState<string | null>(
		value ?? defaultValue ?? null
	);
	const [boundsState, setBoundsState] = useState<Bounds | null>(null);
	const [activeClassNameState, setActiveClassNameState] = useState<string>("");

	const safeSetActiveValue = useCallback(
		(activeId: string | null) => {
			setActiveValue((prev) => (prev === activeId ? prev : activeId));
			if (activeId !== activeValue) {
				onValueChange?.(activeId);
			}
		},
		[activeValue, onValueChange]
	);

	const boundsOffset = (props as { boundsOffset?: Partial<Bounds> })
		?.boundsOffset ?? {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	};
	const containerClassName = (props as { containerClassName?: string })
		?.containerClassName;

	const safeSetBounds = useCallback(
		(bounds: DOMRect) => {
			if (!localRef.current) {
				return;
			}

			const containerRect = localRef.current.getBoundingClientRect();
			const newBounds: Bounds = {
				top: bounds.top - containerRect.top + (boundsOffset.top ?? 0),
				left: bounds.left - containerRect.left + (boundsOffset.left ?? 0),
				width: bounds.width + (boundsOffset.width ?? 0),
				height: bounds.height + (boundsOffset.height ?? 0),
			};

			setBoundsState((prev) => {
				if (
					prev &&
					prev.top === newBounds.top &&
					prev.left === newBounds.left &&
					prev.width === newBounds.width &&
					prev.height === newBounds.height
				) {
					return prev;
				}
				return newBounds;
			});
		},
		[boundsOffset]
	);

	const clearBounds = useCallback(() => {
		setBoundsState((prev) => (prev === null ? prev : null));
	}, []);

	useEffect(() => {
		if (value !== undefined) {
			setActiveValue(value);
		} else if (defaultValue !== undefined) {
			setActiveValue(defaultValue);
		}
	}, [value, defaultValue]);

	const id = useId();

	useEffect(() => {
		if (mode !== "parent") {
			return;
		}
		const container = localRef.current;
		if (!container) {
			return;
		}

		const onScroll = () => {
			if (!activeValue) {
				return;
			}
			const activeEl = container.querySelector<HTMLElement>(
				`[data-value="${activeValue}"][data-highlight="true"]`
			);
			if (activeEl) {
				safeSetBounds(activeEl.getBoundingClientRect());
			}
		};

		container.addEventListener("scroll", onScroll, { passive: true });
		return () => container.removeEventListener("scroll", onScroll);
	}, [mode, activeValue, safeSetBounds]);

	const render = useCallback(
		(itemChildren: ReactNode) => {
			if (mode === "parent") {
				return (
					<Component
						className={containerClassName}
						data-slot="motion-highlight-container"
						ref={localRef}
						style={{ position: "relative", zIndex: 1 }}
					>
						<AnimatePresence initial={false} mode="wait">
							{boundsState && (
								<motion.div
									animate={{
										top: boundsState.top,
										left: boundsState.left,
										width: boundsState.width,
										height: boundsState.height,
										opacity: 1,
									}}
									className={cn(className, activeClassNameState)}
									data-slot="motion-highlight"
									exit={{
										opacity: 0,
										transition: {
											...transition,
											delay:
												(transition?.delay ?? 0) +
												(exitDelay ?? 0) / MS_TO_SECONDS,
										},
									}}
									initial={{
										top: boundsState.top,
										left: boundsState.left,
										width: boundsState.width,
										height: boundsState.height,
										opacity: 0,
									}}
									style={{ position: "absolute", zIndex: 0, ...style }}
									transition={transition}
								/>
							)}
						</AnimatePresence>
						{itemChildren}
					</Component>
				);
			}

			return itemChildren;
		},
		[
			mode,
			Component,
			containerClassName,
			boundsState,
			transition,
			exitDelay,
			style,
			className,
			activeClassNameState,
		]
	);

	return (
		<HighlightContext.Provider
			value={{
				mode,
				activeValue,
				setActiveValue: safeSetActiveValue,
				id,
				hover,
				click,
				className,
				style,
				transition,
				disabled,
				enabled,
				exitDelay,
				setBounds: safeSetBounds,
				clearBounds,
				activeClassName: activeClassNameState,
				setActiveClassName: setActiveClassNameState,
				forceUpdateBounds: (props as { forceUpdateBounds?: boolean })
					?.forceUpdateBounds,
			}}
		>
			{(() => {
				if (!enabled) {
					return children;
				}

				if (controlledItems) {
					return render(children);
				}

				return render(
					React.Children.map(children, (child, index) => (
						<HighlightItem
							className={props?.itemsClassName}
							key={(child as ReactElement).key || index}
						>
							{child}
						</HighlightItem>
					))
				);
			})()}
		</HighlightContext.Provider>
	);
}

export { Highlight };
export { useHighlight } from "./highlight.context";
export type { HighlightItemProps, HighlightProps } from "./highlight.types";
export { HighlightItem } from "./highlight-item";
