"use client";

import Color from "color";
import { PipetteIcon } from "lucide-react";
import { Slider } from "radix-ui";
import {
	type ComponentProps,
	createContext,
	type HTMLAttributes,
	memo,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";

// HSL Color constants
const HSL_MAX_SATURATION = 100; // Saturation max value
const HSL_MAX_LIGHTNESS = 100; // Lightness max value
const HSL_DEFAULT_LIGHTNESS = 50; // Default lightness (50% = medium)
const ALPHA_MAX = 100; // Alpha percentage max
const FULL_ALPHA = 1; // Full opacity in decimal form (0-1)
const ALMOST_ZERO_THRESHOLD = 0.01; // Threshold for considering value as zero
const LIGHTNESS_RANGE = 50; // Range for lightness calculation (0-50)

type ColorPickerContextValue = {
	hue: number;
	saturation: number;
	lightness: number;
	alpha: number;
	mode: string;
	setHue: (hue: number) => void;
	setSaturation: (saturation: number) => void;
	setLightness: (lightness: number) => void;
	setAlpha: (alpha: number) => void;
	setMode: (mode: string) => void;
};

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
	undefined
);

export const useColorPicker = () => {
	const context = useContext(ColorPickerContext);

	if (!context) {
		throw new Error("useColorPicker must be used within a ColorPickerProvider");
	}

	return context;
};

export type ColorPickerProps = HTMLAttributes<HTMLDivElement> & {
	value?: Parameters<typeof Color>[0];
	defaultValue?: Parameters<typeof Color>[0];
	onChange?: (value: Parameters<typeof Color.rgb>[0]) => void;
};

export const ColorPicker = ({
	value,
	defaultValue = "#000000",
	onChange,
	className,
	...props
}: ColorPickerProps) => {
	const resolveHsl = (input: Parameters<typeof Color>[0]) => {
		try {
			return Color(input).hsl();
		} catch {
			return Color(defaultValue).hsl();
		}
	};

	const initial = resolveHsl(value ?? defaultValue);
	const [hue, setHue] = useState<number>(initial.hue() || 0);
	const [saturation, setSaturation] = useState<number>(
		initial.saturationl() || HSL_MAX_SATURATION
	);
	const [lightness, setLightness] = useState<number>(
		initial.lightness() || HSL_DEFAULT_LIGHTNESS
	);
	const [alpha, setAlpha] = useState<number>(
		Math.round((initial.alpha() ?? FULL_ALPHA) * ALPHA_MAX)
	);
	const [mode, setMode] = useState("hex");

	// Update color when controlled value changes
	useEffect(() => {
		if (value === undefined || value === null) {
			return;
		}
		try {
			const c = Color(value as Parameters<typeof Color>[0]).hsl();
			const nextHue = c.hue() || 0;
			const nextSat = c.saturationl() || 0;
			const nextLight = c.lightness() || 0;
			const nextAlpha = Math.round((c.alpha() ?? FULL_ALPHA) * ALPHA_MAX);
			setHue(nextHue);
			setSaturation(nextSat);
			setLightness(nextLight);
			setAlpha(nextAlpha);
		} catch {
			/* ignore invalid value */
		}
	}, [value]);

	// Notify parent of changes
	useEffect(() => {
		if (onChange) {
			const color = Color.hsl(hue, saturation, lightness).alpha(
				alpha / ALPHA_MAX
			);
			const rgba = color.rgb().array();

			onChange([rgba[0], rgba[1], rgba[2], alpha / ALPHA_MAX]);
		}
	}, [hue, saturation, lightness, alpha, onChange]);

	return (
		<ColorPickerContext.Provider
			value={{
				hue,
				saturation,
				lightness,
				alpha,
				mode,
				setHue,
				setSaturation,
				setLightness,
				setAlpha,
				setMode,
			}}
		>
			<div
				className={cn("flex size-full flex-col gap-4", className)}
				{...props}
			/>
		</ColorPickerContext.Provider>
	);
};

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = memo(
	({ className, ...props }: ColorPickerSelectionProps) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const [isDragging, setIsDragging] = useState(false);
		const [positionX, setPositionX] = useState(0);
		const [positionY, setPositionY] = useState(0);
		const { hue, saturation, lightness, setSaturation, setLightness } =
			useColorPicker();

		const backgroundGradient = useMemo(
			() => `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`,
			[hue]
		);

		const handlePointerMove = useCallback(
			(event: PointerEvent) => {
				if (!(isDragging && containerRef.current)) {
					return;
				}
				const rect = containerRef.current.getBoundingClientRect();
				const x = Math.max(
					0,
					Math.min(1, (event.clientX - rect.left) / rect.width)
				);
				const y = Math.min(1, (event.clientY - rect.top) / rect.height);
				setPositionX(x);
				setPositionY(y);
				setSaturation(x * HSL_MAX_SATURATION);
				const topLightness =
					x < ALMOST_ZERO_THRESHOLD
						? HSL_MAX_LIGHTNESS
						: HSL_DEFAULT_LIGHTNESS + LIGHTNESS_RANGE * (1 - x);
				const calculatedLightness = topLightness * (1 - y);

				setLightness(calculatedLightness);
			},
			[isDragging, setSaturation, setLightness]
		);

		useEffect(() => {
			const handlePointerUp = () => setIsDragging(false);

			if (isDragging) {
				window.addEventListener("pointermove", handlePointerMove);
				window.addEventListener("pointerup", handlePointerUp);
			}

			return () => {
				window.removeEventListener("pointermove", handlePointerMove);
				window.removeEventListener("pointerup", handlePointerUp);
			};
		}, [isDragging, handlePointerMove]);

		// Sync knob position to current saturation/lightness when not dragging
		useEffect(() => {
			if (isDragging) {
				return;
			}
			const x = Math.max(
				0,
				Math.min(1, (saturation ?? 0) / HSL_MAX_SATURATION)
			);
			const denom = HSL_MAX_LIGHTNESS - LIGHTNESS_RANGE * x;
			const ratio = denom > 0 ? (lightness ?? 0) / denom : 0;
			const y = 1 - Math.max(0, Math.min(1, ratio));
			setPositionX(x);
			setPositionY(y);
		}, [saturation, lightness, isDragging]);

		return (
			<div
				className={cn("relative size-full cursor-crosshair rounded", className)}
				onPointerDown={(e) => {
					e.preventDefault();
					setIsDragging(true);
					handlePointerMove(e.nativeEvent);
				}}
				ref={containerRef}
				style={{
					background: backgroundGradient,
				}}
				{...props}
			>
				<div
					className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
					style={{
						left: `${positionX * HSL_MAX_SATURATION}%`,
						top: `${positionY * HSL_MAX_SATURATION}%`,
						boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
					}}
				/>
			</div>
		);
	}
);

ColorPickerSelection.displayName = "ColorPickerSelection";

export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerHue = ({
	className,
	...props
}: ColorPickerHueProps) => {
	const { hue, setHue } = useColorPicker();

	return (
		<Slider.Root
			className={cn("relative flex h-4 w-full touch-none", className)}
			max={360}
			onValueChange={([newHue]) => setHue(newHue)}
			step={1}
			value={[hue]}
			{...props}
		>
			<Slider.Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
				<Slider.Range className="absolute h-full" />
			</Slider.Track>
			<Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
		</Slider.Root>
	);
};

export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;

export const ColorPickerAlpha = ({
	className,
	...props
}: ColorPickerAlphaProps) => {
	const { alpha, setAlpha } = useColorPicker();

	return (
		<Slider.Root
			className={cn("relative flex h-4 w-full touch-none", className)}
			max={100}
			onValueChange={([newAlpha]) => setAlpha(newAlpha)}
			step={1}
			value={[alpha]}
			{...props}
		>
			<Slider.Track
				className="relative my-0.5 h-3 w-full grow rounded-full"
				style={{
					background:
						'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center',
				}}
			>
				<div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-black/50" />
				<Slider.Range className="absolute h-full rounded-full bg-transparent" />
			</Slider.Track>
			<Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
		</Slider.Root>
	);
};

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;

export const ColorPickerEyeDropper = ({
	className,
	...props
}: ColorPickerEyeDropperProps) => {
	const { setHue, setSaturation, setLightness, setAlpha } = useColorPicker();

	const handleEyeDropper = async () => {
		try {
			// @ts-expect-error - EyeDropper API is experimental
			const eyeDropper = new EyeDropper();
			const result = await eyeDropper.open();
			const color = Color(result.sRGBHex);
			const [h, s, l] = color.hsl().array();

			setHue(h);
			setSaturation(s);
			setLightness(l);
			setAlpha(ALPHA_MAX);
		} catch {
			/* ignore invalid color format */
		}
	};

	return (
		<Button
			className={cn("shrink-0 text-muted-foreground", className)}
			onClick={handleEyeDropper}
			size="icon"
			type="button"
			variant="outline"
			{...props}
		>
			<PipetteIcon size={16} />
		</Button>
	);
};

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;

const formats = ["hex", "rgb", "css", "hsl"];

export const ColorPickerOutput = ({
	className,
	...props
}: ColorPickerOutputProps) => {
	const { mode, setMode } = useColorPicker();

	return (
		<Select onValueChange={setMode} value={mode}>
			<SelectTrigger className="h-8 w-20 shrink-0 text-xs" {...props}>
				<SelectValue placeholder="Mode" />
			</SelectTrigger>
			<SelectContent>
				{formats.map((format) => (
					<SelectItem className="text-xs" key={format} value={format}>
						{format.toUpperCase()}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

type PercentageInputProps = ComponentProps<typeof Input>;

const PercentageInput = ({ className, ...props }: PercentageInputProps) => (
	<div className="relative">
		<Input
			readOnly
			type="text"
			{...props}
			className={cn(
				"h-8 w-[3.25rem] rounded-l-none bg-secondary px-2 text-xs shadow-none",
				className
			)}
		/>
		<span className="-translate-y-1/2 absolute top-1/2 right-2 text-muted-foreground text-xs">
			%
		</span>
	</div>
);

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerFormat = ({
	className,
	...props
}: ColorPickerFormatProps) => {
	const { hue, saturation, lightness, alpha, mode } = useColorPicker();
	const color = Color.hsl(hue, saturation, lightness, alpha / ALPHA_MAX);

	if (mode === "hex") {
		const hex = color.hex();

		return (
			<div
				className={cn(
					"-space-x-px relative flex w-full items-center rounded-md shadow-sm",
					className
				)}
				{...props}
			>
				<Input
					className="h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none"
					readOnly
					type="text"
					value={hex}
				/>
				<PercentageInput value={alpha} />
			</div>
		);
	}

	if (mode === "rgb") {
		const rgb = color
			.rgb()
			.array()
			.map((value) => Math.round(value));

		return (
			<div
				className={cn(
					"-space-x-px flex items-center rounded-md shadow-sm",
					className
				)}
				{...props}
			>
				{rgb.map((value, index) => (
					<Input
						className={cn(
							"h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none",
							!!index && "rounded-l-none",
							className
						)}
						key={`rgb-${index}-${value}`}
						readOnly
						type="text"
						value={value}
					/>
				))}
				<PercentageInput value={alpha} />
			</div>
		);
	}

	if (mode === "css") {
		const rgb = color
			.rgb()
			.array()
			.map((value) => Math.round(value));

		return (
			<div className={cn("w-full rounded-md shadow-sm", className)} {...props}>
				<Input
					className="h-8 w-full bg-secondary px-2 text-xs shadow-none"
					readOnly
					type="text"
					value={`rgba(${rgb.join(", ")}, ${alpha}%)`}
					{...props}
				/>
			</div>
		);
	}

	if (mode === "hsl") {
		const hsl = color
			.hsl()
			.array()
			.map((value) => Math.round(value));

		return (
			<div
				className={cn(
					"-space-x-px flex items-center rounded-md shadow-sm",
					className
				)}
				{...props}
			>
				{hsl.map((value, index) => (
					<Input
						className={cn(
							"h-8 rounded-r-none bg-secondary px-2 text-xs shadow-none",
							!!index && "rounded-l-none",
							className
						)}
						key={`hsl-${index}-${value}`}
						readOnly
						type="text"
						value={value}
					/>
				))}
				<PercentageInput value={alpha} />
			</div>
		);
	}

	return null;
};
