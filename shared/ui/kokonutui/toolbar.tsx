"use client";

/**
 * @author: @dorian_baffier
 * @description: Toolbar
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import {
	Bell,
	CircleUserRound,
	Edit2,
	FileDown,
	Frame,
	Layers,
	Lock,
	type LucideIcon,
	MousePointer2,
	Move,
	Palette,
	Shapes,
	Share2,
	SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

export type ToolbarItem = {
	id: string;
	title: string;
	icon: LucideIcon;
	type?: never;
};

type ToolbarProps = {
	className?: string;
	activeColor?: string;
	onSearch?: (value: string) => void;
	/**
	 * Display mode: full toolbar with items, or only render the toggle button
	 */
	mode?: "full" | "toggleOnly";
	/** Provide custom items for the toolbar. Defaults to KokonutUI demo items. */
	items?: ToolbarItem[];
	/** Controlled selected id for toolbar items */
	selectedId?: string | null;
	/** Item select callback */
	onSelect?: (id: string | null) => void;
	/** Show the trailing toggle button */
	showToggle?: boolean;
	/** Show animated selection notification above the toolbar */
	showNotifications?: boolean;
	/**
	 * Controlled toggle state. If provided, component becomes controlled.
	 */
	toggled?: boolean;
	/**
	 * Uncontrolled initial toggle state.
	 */
	defaultToggled?: boolean;
	/**
	 * Called whenever toggle state changes.
	 */
	onToggledChange?: (value: boolean) => void;
	/**
	 * Labels and icons for toggle states
	 */
	toggleOffLabel?: ReactNode;
	toggleOnLabel?: ReactNode;
	toggleOffIcon?: ReactNode;
	toggleOnIcon?: ReactNode;
};

const buttonVariants = {
	initial: {
		gap: 0,
		paddingLeft: ".5rem",
		paddingRight: ".5rem",
	},
	animate: (isSelected: boolean) => ({
		gap: isSelected ? ".5rem" : 0,
		paddingLeft: isSelected ? "1rem" : ".5rem",
		paddingRight: isSelected ? "1rem" : ".5rem",
	}),
};

const spanVariants = {
	initial: { width: 0, opacity: 0 },
	animate: { width: "auto", opacity: 1 },
	exit: { width: 0, opacity: 0 },
};

const notificationVariants = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: -10 },
	exit: { opacity: 0, y: -20 },
};

const lineVariants = {
	initial: { scaleX: 0, x: "-50%" },
	animate: {
		scaleX: 1,
		x: "0%",
		transition: { duration: 0.2 },
	},
	exit: {
		scaleX: 0,
		x: "50%",
		transition: { duration: 0.2 },
	},
};

const transition = { type: "spring" as const, bounce: 0, duration: 0.4 };
const NOTIFICATION_DISPLAY_MS = 1500; // milliseconds to show notification

export function Toolbar({
	className,
	activeColor: _activeColor = "text-primary",
	onSearch: _onSearch,
	mode = "full",
	items,
	selectedId,
	onSelect,
	showToggle = true,
	showNotifications = true,
	toggled,
	defaultToggled,
	onToggledChange,
	toggleOffLabel = "Off",
	toggleOnLabel = "On",
	toggleOffIcon,
	toggleOnIcon,
}: ToolbarProps) {
	const [internalSelected, setInternalSelected] = useState<string | null>(
		"select"
	);
	const selected = selectedId !== undefined ? selectedId : internalSelected;
	const isControlled = typeof toggled === "boolean";
	const [internalToggled, setInternalToggled] = useState<boolean>(
		defaultToggled ?? false
	);
	const isToggled = isControlled ? (toggled as boolean) : internalToggled;
	const setIsToggled = (value: boolean) => {
		if (!isControlled) {
			setInternalToggled(value);
		}
		onToggledChange?.(value);
	};
	const [activeNotification, setActiveNotification] = useState<string | null>(
		null
	);
	const outsideClickRef = useRef(null);

	const toolbarItems: ToolbarItem[] = items ?? [
		{ id: "select", title: "Select", icon: MousePointer2 },
		{ id: "move", title: "Move", icon: Move },
		{ id: "shapes", title: "Shapes", icon: Shapes },
		{ id: "layers", title: "Layers", icon: Layers },
		{ id: "frame", title: "Frame", icon: Frame },
		{ id: "properties", title: "Properties", icon: SlidersHorizontal },
		{ id: "export", title: "Export", icon: FileDown },
		{ id: "share", title: "Share", icon: Share2 },
		{ id: "notifications", title: "Notifications", icon: Bell },
		{ id: "profile", title: "Profile", icon: CircleUserRound },
		{ id: "appearance", title: "Appearance", icon: Palette },
	];

	const handleItemClick = (itemId: string) => {
		const nextId = selected === itemId ? null : itemId;
		if (onSelect) {
			onSelect(nextId);
		} else {
			setInternalSelected(nextId);
		}
		setActiveNotification(itemId);
		setTimeout(() => setActiveNotification(null), NOTIFICATION_DISPLAY_MS);
	};

	return (
		<div className="space-y-2">
			<div
				className={cn(
					"relative flex items-center gap-3 p-2",
					"bg-background",
					"rounded-xl border",
					"transition-all duration-200",
					className
				)}
				ref={outsideClickRef}
			>
				{mode === "full" && showNotifications && (
					<AnimatePresence>
						{!!activeNotification && (
							<motion.div
								animate="animate"
								className="-top-8 -translate-x-1/2 absolute left-1/2 z-50 transform"
								exit="exit"
								initial="initial"
								transition={{ duration: 0.3 }}
								variants={
									notificationVariants as {
										initial: { opacity: number; y: number };
										animate: { opacity: number; y: number };
										exit: { opacity: number; y: number };
									}
								}
							>
								<div className="rounded-full bg-primary px-3 py-1 text-primary-foreground text-xs">
									{
										toolbarItems.find((item) => item.id === activeNotification)
											?.title
									}{" "}
									clicked!
								</div>
								<motion.div
									animate="animate"
									className="-bottom-1 absolute left-1/2 h-[2px] w-full origin-left bg-primary"
									exit="exit"
									initial="initial"
									variants={lineVariants}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				)}

				<div className="flex items-center gap-2">
					{mode === "full" &&
						toolbarItems.map((item) => (
							<motion.button
								animate="animate"
								className={cn(
									"relative flex items-center rounded-none px-3 py-2",
									"font-medium text-sm transition-colors duration-300",
									selected === item.id
										? "rounded-lg bg-[#1F9CFE] text-white"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								)}
								custom={selected === item.id}
								initial={false}
								key={item.id}
								onClick={() => handleItemClick(item.id)}
								transition={transition}
								variants={
									buttonVariants as {
										initial: {
											gap: number;
											paddingLeft: string;
											paddingRight: string;
										};
										animate: (isSelected: boolean) => {
											gap: string | number;
											paddingLeft: string;
											paddingRight: string;
										};
									}
								}
							>
								<item.icon
									className={cn(selected === item.id && "text-white")}
									size={16}
								/>
								<AnimatePresence initial={false}>
									{selected === item.id && (
										<motion.span
											animate="animate"
											className="overflow-hidden"
											exit="exit"
											initial="initial"
											transition={transition}
											variants={
												spanVariants as {
													initial: { width: number; opacity: number };
													animate: { width: string; opacity: number };
													exit: { width: number; opacity: number };
												}
											}
										>
											{item.title}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.button>
						))}

					{!!showToggle && (
						<motion.button
							className={cn(
								"flex items-center gap-2 px-4 py-2",
								"rounded-xl border shadow-sm transition-all duration-200",
								"hover:shadow-md active:border-primary/50",
								isToggled
									? [
											"bg-[#1F9CFE] text-white",
											"border-[#1F9CFE]/30",
											"hover:bg-[#1F9CFE]/90",
											"hover:border-[#1F9CFE]/40",
										]
									: [
											"bg-background text-muted-foreground",
											"border-border/30",
											"hover:bg-muted",
											"hover:text-foreground",
											"hover:border-border/40",
										]
							)}
							onClick={() => setIsToggled(!isToggled)}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							{isToggled
								? (toggleOnIcon ?? <Edit2 className="h-3.5 w-3.5" />)
								: (toggleOffIcon ?? <Lock className="h-3.5 w-3.5" />)}
							<span className="font-medium text-sm">
								{isToggled ? (toggleOnLabel ?? "") : (toggleOffLabel ?? "")}
							</span>
						</motion.button>
					)}
				</div>
			</div>
		</div>
	);
}
