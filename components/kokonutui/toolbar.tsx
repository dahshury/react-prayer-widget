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
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToolbarItem {
	id: string;
	title: string;
	icon: LucideIcon;
	type?: never;
}

interface ToolbarProps {
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
	toggleOffLabel?: React.ReactNode;
	toggleOnLabel?: React.ReactNode;
	toggleOffIcon?: React.ReactNode;
	toggleOnIcon?: React.ReactNode;
}

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
	const [internalSelected, setInternalSelected] = React.useState<string | null>(
		"select",
	);
	const selected = selectedId !== undefined ? selectedId : internalSelected;
	const isControlled = typeof toggled === "boolean";
	const [internalToggled, setInternalToggled] = React.useState<boolean>(
		defaultToggled ?? false,
	);
	const isToggled = isControlled ? (toggled as boolean) : internalToggled;
	const setIsToggled = (value: boolean) => {
		if (!isControlled) setInternalToggled(value);
		onToggledChange?.(value);
	};
	const [activeNotification, setActiveNotification] = React.useState<
		string | null
	>(null);
	const outsideClickRef = React.useRef(null);

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
		if (onSelect) onSelect(nextId);
		else setInternalSelected(nextId);
		setActiveNotification(itemId);
		setTimeout(() => setActiveNotification(null), 1500);
	};

	return (
		<div className="space-y-2">
			<div
				ref={outsideClickRef}
				className={cn(
					"flex items-center gap-3 p-2 relative",
					"bg-background",
					"border rounded-xl",
					"transition-all duration-200",
					className,
				)}
			>
				{mode === "full" && showNotifications && (
					<AnimatePresence>
						{activeNotification && (
							<motion.div
								variants={
									notificationVariants as {
										initial: { opacity: number; y: number };
										animate: { opacity: number; y: number };
										exit: { opacity: number; y: number };
									}
								}
								initial="initial"
								animate="animate"
								exit="exit"
								transition={{ duration: 0.3 }}
								className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-50"
							>
								<div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs">
									{
										toolbarItems.find((item) => item.id === activeNotification)
											?.title
									}{" "}
									clicked!
								</div>
								<motion.div
									variants={lineVariants}
									initial="initial"
									animate="animate"
									exit="exit"
									className="absolute -bottom-1 left-1/2 w-full h-[2px] bg-primary origin-left"
								/>
							</motion.div>
						)}
					</AnimatePresence>
				)}

				<div className="flex items-center gap-2">
					{mode === "full" &&
						toolbarItems.map((item) => (
							<motion.button
								key={item.id}
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
								initial={false}
								animate="animate"
								custom={selected === item.id}
								onClick={() => handleItemClick(item.id)}
								transition={transition}
								className={cn(
									"relative flex items-center rounded-none px-3 py-2",
									"text-sm font-medium transition-colors duration-300",
									selected === item.id
										? "bg-[#1F9CFE] text-white rounded-lg"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								<item.icon
									size={16}
									className={cn(selected === item.id && "text-white")}
								/>
								<AnimatePresence initial={false}>
									{selected === item.id && (
										<motion.span
											variants={
												spanVariants as {
													initial: { width: number; opacity: number };
													animate: { width: string; opacity: number };
													exit: { width: number; opacity: number };
												}
											}
											initial="initial"
											animate="animate"
											exit="exit"
											transition={transition}
											className="overflow-hidden"
										>
											{item.title}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.button>
						))}

					{showToggle && (
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => setIsToggled(!isToggled)}
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
										],
							)}
						>
							{isToggled
								? (toggleOnIcon ?? <Edit2 className="w-3.5 h-3.5" />)
								: (toggleOffIcon ?? <Lock className="w-3.5 h-3.5" />)}
							<span className="text-sm font-medium">
								{isToggled ? toggleOnLabel : toggleOffLabel}
							</span>
						</motion.button>
					)}
				</div>
			</div>
		</div>
	);
}
