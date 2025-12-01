"use client";

/**
 * @author: @dorian_baffier
 * @description: Liquid Glass Card
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import {
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type KeyboardEvent,
	type MouseEvent,
	type ReactNode,
	type RefObject,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useState,
} from "react";
import { cn } from "@/shared/lib/utils";

const liquidbuttonVariants = cva(
	"inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-[color,box-shadow] transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-transparent text-primary transition duration-300 hover:scale-105",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 px-4 text-xs has-[>svg]:px-4",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				xl: "h-12 rounded-md px-8 has-[>svg]:px-6",
				xxl: "h-14 rounded-md px-10 has-[>svg]:px-8",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "xxl",
		},
	}
);

interface LiquidButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof liquidbuttonVariants> {
	asChild?: boolean;
}

function ButtonGlassFilter() {
	const filterId = useId();
	return (
		<svg className="hidden">
			<title>Glass Effect Filter</title>
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					height="100%"
					id={filterId}
					width="100%"
					x="0%"
					y="0%"
				>
					<feTurbulence
						baseFrequency="0.05 0.05"
						numOctaves="1"
						result="turbulence"
						seed="1"
						type="fractalNoise"
					/>
					<feGaussianBlur
						in="turbulence"
						result="blurredNoise"
						stdDeviation="2"
					/>
					<feDisplacementMap
						in="SourceGraphic"
						in2="blurredNoise"
						result="displaced"
						scale="70"
						xChannelSelector="R"
						yChannelSelector="B"
					/>
					<feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
					<feComposite in="finalBlur" in2="finalBlur" operator="over" />
				</filter>
			</defs>
		</svg>
	);
}

const LiquidButton = ({
	className,
	variant,
	size,
	asChild = false,
	children,
	ref,
	...props
}: LiquidButtonProps & { ref?: RefObject<HTMLButtonElement> }) => {
	const filterId = useId();
	const buttonClassName = cn(
		"relative",
		liquidbuttonVariants({ variant, size, className })
	);

	const glassOverlay = (
		<>
			<div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
			<div
				className="-z-10 absolute top-0 left-0 isolate h-full w-full overflow-hidden rounded-md"
				style={{ backdropFilter: `url("#${filterId}")` }}
			/>
			<div className="pointer-events-none z-10">{children}</div>
			<ButtonGlassFilter />
		</>
	);

	if (asChild) {
		const slotProps = { ...props, ref } as React.ComponentProps<typeof Slot>;
		return (
			<Slot className={buttonClassName} data-slot="button" {...slotProps}>
				{glassOverlay}
			</Slot>
		);
	}

	return (
		<button className={buttonClassName} data-slot="button" ref={ref} {...props}>
			{glassOverlay}
		</button>
	);
};

LiquidButton.displayName = "LiquidButton";

const cardVariants = cva(
	"group relative overflow-hidden rounded-lg bg-background/20 transition-all duration-300",
	{
		variants: {
			variant: {
				default: "text-foreground backdrop-blur-[2px] hover:scale-[1.01]",
				primary:
					"bg-primary/5 text-foreground backdrop-blur-[2px] hover:bg-primary/5",
				destructive:
					"bg-destructive/5 text-foreground backdrop-blur-[2px] hover:bg-destructive/10",
				secondary:
					"bg-secondary/5 text-foreground backdrop-blur-[2px] hover:bg-secondary/10",
			},
			size: {
				default: "p-6",
				sm: "p-4",
				lg: "p-8",
				xl: "p-10",
			},
			hover: {
				default: "hover:scale-[1.02]",
				none: "",
				glow: "hover:shadow-lg hover:shadow-primary/20",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			hover: "default",
		},
	}
);

export interface LiquidGlassCardProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {
	asChild?: boolean;
	glassEffect?: boolean;
}

function GlassFilter() {
	const filterId = useId();

	return (
		<svg className="hidden">
			<title>Glass Effect Filter</title>
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					height="200%"
					id={filterId}
					width="200%"
					x="-50%"
					y="-50%"
				>
					<feTurbulence
						baseFrequency="0.05 0.05"
						numOctaves="1"
						result="turbulence"
						seed="1"
						type="fractalNoise"
					/>
					<feGaussianBlur
						in="turbulence"
						result="blurredNoise"
						stdDeviation="2"
					/>
					<feDisplacementMap
						in="SourceGraphic"
						in2="blurredNoise"
						result="displaced"
						scale="30"
						xChannelSelector="R"
						yChannelSelector="B"
					/>
					<feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
					<feComposite in="finalBlur" in2="finalBlur" operator="over" />
				</filter>
			</defs>
		</svg>
	);
}

// Card Header Component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	subtitle?: string;
	icon?: ReactNode;
}

function CardHeader({
	title,
	subtitle,
	icon,
	className,
	...props
}: CardHeaderProps) {
	return (
		<div
			className={cn("flex items-start justify-between gap-4", className)}
			{...props}
		>
			<div className="space-y-1.5">
				<h3 className="font-semibold text-foreground leading-none tracking-tight">
					{title}
				</h3>
				{!!subtitle && (
					<p className="text-muted-foreground/80 text-sm">{subtitle}</p>
				)}
			</div>
			{!!icon && <div className="text-muted-foreground/70">{icon}</div>}
		</div>
	);
}

// Card Content Component
function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("pt-6 text-foreground", className)} {...props} />;
}

const LiquidGlassCard = ({
	className,
	variant,
	size,
	hover,
	asChild = false,
	glassEffect = true,
	children,
	ref,
	...props
}: LiquidGlassCardProps & { ref?: RefObject<HTMLDivElement> }) => {
	const filterId = useId();
	const cardClassName = cn(
		"relative",
		cardVariants({ variant, size, hover, className })
	);

	const cardContent = (
		<>
			{/* Glass effect overlay */}
			<div className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-lg shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />

			{/* Glass filter effect */}
			{!!glassEffect && (
				<div
					className="-z-10 absolute inset-0 h-full w-full overflow-hidden rounded-lg"
					style={{ backdropFilter: `url("#${filterId}")` }}
				/>
			)}

			{/* Content */}
			<div className="relative z-10">{children}</div>

			{/* Shine effect on hover */}
			<div className="pointer-events-none absolute inset-0 z-20 rounded-lg bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:via-white/5" />

			{!!glassEffect && <GlassFilter />}
		</>
	);

	if (asChild) {
		const slotProps = { ...props, ref } as React.ComponentProps<typeof Slot>;
		return (
			<Slot className={cardClassName} {...slotProps}>
				{cardContent}
			</Slot>
		);
	}

	return (
		<div className={cardClassName} ref={ref} {...props}>
			{cardContent}
		</div>
	);
};

LiquidGlassCard.displayName = "LiquidGlassCard";

// Remove the hello text and fix the time display
export function NotificationCenter() {
	// Demo constants
	const DEMO_INITIAL_TIME = 45; // 45 seconds
	const DEMO_TOTAL_DURATION = 225; // 3:45 in seconds
	const SECOND_MS = 1000; // milliseconds per second
	const PERCENT_MULTIPLIER = 100; // for percentage calculation
	const SEEK_INTERVAL = 5; // seconds to seek forward/backward

	// Track current time and playing state
	const [isPlaying, setIsPlaying] = useState(true);
	const [currentTime, setCurrentTime] = useState(DEMO_INITIAL_TIME);
	const totalDuration = useMemo(() => DEMO_TOTAL_DURATION, []);

	// Format time in MM:SS
	const formatTime = useCallback((timeInSeconds: number) => {
		const minutes = Math.floor(timeInSeconds / 60);
		const seconds = Math.floor(timeInSeconds % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	}, []);

	// Calculate progress percentage
	const progress = (currentTime / totalDuration) * PERCENT_MULTIPLIER;

	// Update progress when playing
	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		if (isPlaying && currentTime < totalDuration) {
			intervalId = setInterval(() => {
				setCurrentTime((prev) => {
					if (prev >= totalDuration) {
						clearInterval(intervalId);
						setIsPlaying(false);
						return totalDuration;
					}
					return prev + 1;
				});
			}, SECOND_MS);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isPlaying, currentTime, totalDuration]);

	// Handle play/pause
	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	// Handle seek
	const handleSeek = (
		e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>
	) => {
		const bar = e.currentTarget.parentElement;
		if (!bar) {
			return;
		}

		const rect = bar.getBoundingClientRect();
		let percent: number;

		if ("clientX" in e) {
			// Mouse event
			const x = e.clientX - rect.left;
			percent = x / rect.width;
		} else {
			// Keyboard event
			switch (e.key) {
				case "ArrowLeft":
					percent = (currentTime - SEEK_INTERVAL) / totalDuration;
					break;
				case "ArrowRight":
					percent = (currentTime + SEEK_INTERVAL) / totalDuration;
					break;
				default:
					return;
			}
		}

		const newTime = percent * totalDuration;
		setCurrentTime(Math.min(Math.max(0, newTime), totalDuration));
	};

	return (
		<div className="w-full max-w-sm">
			<LiquidGlassCard className="relative z-30" hover="glow" variant="primary">
				<div className="flex items-start gap-4">
					{/* Profile Image */}
					<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
						<Image
							alt="Profile"
							className="h-full w-full object-cover"
							height={64}
							src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/portrait2-x5MjJSaQ9ed0HZrewEhH7TkZwjZ66K.jpeg"
							width={64}
						/>
						<div className="absolute inset-0 ring-1 ring-black/10 ring-inset dark:ring-white/10" />
					</div>

					<div className="flex-1">
						<CardHeader subtitle="Lofi Beats - Chill Mix" title="Now Playing" />
					</div>
				</div>

				<CardContent>
					{/* Progress Bar */}
					<div className="space-y-2">
						<div
							className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/50 dark:bg-zinc-800/50"
							role="presentation"
						>
							{/* Background gradient */}
							<div className="absolute inset-0 bg-gradient-to-r from-zinc-300/20 via-zinc-300/30 to-zinc-300/20 dark:from-white/5 dark:via-white/10 dark:to-white/5" />

							{/* Progress indicator */}
							<div
								className="absolute inset-y-0 left-0 flex bg-gradient-to-r from-black/50 via-black/50 to-black/50 transition-all duration-200 ease-out dark:from-white/80 dark:via-white/80 dark:to-white/80"
								style={{
									width: `${progress}%`,
								}}
							>
								{/* Shine effect */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/5" />
							</div>

							{/* Interactive seek button (invisible but functional) */}
							<button
								aria-label={`Seek to ${formatTime(currentTime)} of ${formatTime(totalDuration)}`}
								aria-valuemax={totalDuration}
								aria-valuemin={0}
								aria-valuenow={currentTime}
								className="absolute inset-0 h-full w-full cursor-pointer"
								onClick={handleSeek}
								onKeyDown={handleSeek}
								role="slider"
								type="button"
							/>
						</div>
						<div className="flex justify-between font-medium text-xs">
							<span className="text-zinc-600 tabular-nums dark:text-zinc-400">
								{formatTime(currentTime)}
							</span>
							<span className="text-zinc-600 tabular-nums dark:text-zinc-400">
								{formatTime(totalDuration)}
							</span>
						</div>
					</div>

					<div className="mt-6 flex items-center justify-center gap-6">
						<LiquidButton
							aria-label="Previous track"
							className="rounded-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
							size="icon"
							variant="default"
						>
							<ArrowLeft className="size-5" />
						</LiquidButton>
						<LiquidButton
							aria-label={isPlaying ? "Pause" : "Play"}
							className="rounded-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
							onClick={handlePlayPause}
							size="icon"
							variant="default"
						>
							{isPlaying ? (
								<Pause className="size-5" />
							) : (
								<Play className="size-5" />
							)}
						</LiquidButton>
						<LiquidButton
							aria-label="Next track"
							className="rounded-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
							size="icon"
							variant="default"
						>
							<ArrowRight className="size-5" />
						</LiquidButton>
					</div>
				</CardContent>
			</LiquidGlassCard>
		</div>
	);
}
