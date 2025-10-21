"use client";

import {
	type MotionValue,
	motion,
	type SpringOptions,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react";
import {
	type ComponentProps,
	Fragment,
	type Ref,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import useMeasure from "react-use-measure";

import {
	type UseIsInViewOptions,
	useIsInView,
} from "@/shared/libs/hooks/use-is-in-view";

// Constants for number display calculations
const MODULO_DIVISOR = 10; // Base 10 digits
const HALFWAY_OFFSET = 5; // Half of MODULO_DIVISOR, threshold for animation direction
const THOUSAND_SEPARATOR_INTERVAL = 3; // Every 3 digits

type SlidingNumberRollerProps = {
	prevValue: number;
	value: number;
	place: number;
	transition: SpringOptions;
	delay?: number;
};

function SlidingNumberRoller({
	prevValue,
	value,
	place,
	transition,
	delay = 0,
}: SlidingNumberRollerProps) {
	const startNumber = Math.floor(prevValue / place) % MODULO_DIVISOR;
	const targetNumber = Math.floor(value / place) % MODULO_DIVISOR;
	const animatedValue = useSpring(startNumber, transition);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			animatedValue.set(targetNumber);
		}, delay);
		return () => clearTimeout(timeoutId);
	}, [targetNumber, animatedValue, delay]);

	const [measureRef, { height }] = useMeasure();

	return (
		<span
			data-slot="sliding-number-roller"
			ref={measureRef}
			style={{
				position: "relative",
				display: "inline-block",
				width: "1ch",
				overflowX: "visible",
				overflowY: "clip",
				lineHeight: 1,
				fontVariantNumeric: "tabular-nums",
			}}
		>
			<span style={{ visibility: "hidden" }}>0</span>
			{Array.from({ length: MODULO_DIVISOR }, (_, i) => (
				<SlidingNumberDisplay
					height={height}
					key={i.toString()}
					motionValue={animatedValue}
					number={i}
					transition={transition}
				/>
			))}
		</span>
	);
}

type SlidingNumberDisplayProps = {
	motionValue: MotionValue<number>;
	number: number;
	height: number;
	transition: SpringOptions;
};

function SlidingNumberDisplay({
	motionValue,
	number,
	height,
	transition,
}: SlidingNumberDisplayProps) {
	const y = useTransform(motionValue, (latest) => {
		if (!height) {
			return 0;
		}
		const currentNumber = latest % MODULO_DIVISOR;
		const offset = (MODULO_DIVISOR + number - currentNumber) % MODULO_DIVISOR;
		let translateY = offset * height;
		if (offset > HALFWAY_OFFSET) {
			translateY -= MODULO_DIVISOR * height;
		}
		return translateY;
	});

	if (!height) {
		return (
			<span style={{ visibility: "hidden", position: "absolute" }}>
				{number}
			</span>
		);
	}

	return (
		<motion.span
			data-slot="sliding-number-display"
			style={{
				y,
				position: "absolute",
				inset: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
			transition={{ ...transition, type: "spring" }}
		>
			{number}
		</motion.span>
	);
}

type SlidingNumberProps = Omit<ComponentProps<"span">, "children"> & {
	number: number;
	fromNumber?: number;
	onNumberChange?: (number: number) => void;
	padStart?: boolean;
	decimalSeparator?: string;
	decimalPlaces?: number;
	thousandSeparator?: string;
	transition?: SpringOptions;
	delay?: number;
} & UseIsInViewOptions;

function SlidingNumber({
	ref,
	number,
	fromNumber,
	onNumberChange,
	inView = false,
	inViewMargin = "0px",
	inViewOnce = true,
	padStart = false,
	decimalSeparator = ".",
	decimalPlaces = 0,
	thousandSeparator,
	transition = { stiffness: 200, damping: 20, mass: 0.4 },
	delay = 0,
	...props
}: SlidingNumberProps) {
	const { ref: localRef, isInView } = useIsInView(ref as Ref<HTMLElement>, {
		inView,
		inViewOnce,
		inViewMargin,
	});

	const prevNumberRef = useRef<number>(0);

	const hasAnimated = fromNumber !== undefined;
	const motionVal = useMotionValue(fromNumber ?? 0);
	const springVal = useSpring(motionVal, { stiffness: 90, damping: 50 });

	useEffect(() => {
		if (!hasAnimated) {
			return;
		}
		const timeoutId = setTimeout(() => {
			if (isInView) {
				motionVal.set(number);
			}
		}, delay);
		return () => clearTimeout(timeoutId);
	}, [hasAnimated, isInView, number, motionVal, delay]);

	const [effectiveNumber, setEffectiveNumber] = useState(0);

	useEffect(() => {
		if (hasAnimated) {
			const inferredDecimals =
				typeof decimalPlaces === "number" && decimalPlaces >= 0
					? decimalPlaces
					: (() => {
							const s = String(number);
							const idx = s.indexOf(".");
							return idx >= 0 ? s.length - idx - 1 : 0;
						})();

			const factor = 10 ** inferredDecimals;

			const unsubscribe = springVal.on("change", (latest: number) => {
				const newValue =
					inferredDecimals > 0
						? Math.round(latest * factor) / factor
						: Math.round(latest);

				if (effectiveNumber !== newValue) {
					setEffectiveNumber(newValue);
					onNumberChange?.(newValue);
				}
			});
			return () => unsubscribe();
		}
		setEffectiveNumber(isInView ? Math.abs(Number(number)) : 0);
	}, [
		hasAnimated,
		springVal,
		isInView,
		number,
		decimalPlaces,
		onNumberChange,
		effectiveNumber,
	]);

	const formatNumber = useCallback(
		(num: number) =>
			decimalPlaces != null ? num.toFixed(decimalPlaces) : num.toString(),
		[decimalPlaces]
	);

	const numberStr = formatNumber(effectiveNumber);
	const [newIntStrRaw, newDecStrRaw = ""] = numberStr.split(".");

	const finalIntLength = padStart
		? Math.max(
				Math.floor(Math.abs(number)).toString().length,
				newIntStrRaw.length
			)
		: newIntStrRaw.length;

	const newIntStr = padStart
		? newIntStrRaw.padStart(finalIntLength, "0")
		: newIntStrRaw;

	const prevFormatted = formatNumber(prevNumberRef.current);
	const [prevIntStrRaw = "", prevDecStrRaw = ""] = prevFormatted.split(".");
	const prevIntStr = padStart
		? prevIntStrRaw.padStart(finalIntLength, "0")
		: prevIntStrRaw;

	const adjustedPrevInt = useMemo(
		() =>
			prevIntStr.length > finalIntLength
				? prevIntStr.slice(-finalIntLength)
				: prevIntStr.padStart(finalIntLength, "0"),
		[prevIntStr, finalIntLength]
	);

	const adjustedPrevDec = useMemo(() => {
		if (!newDecStrRaw) {
			return "";
		}
		return prevDecStrRaw.length > newDecStrRaw.length
			? prevDecStrRaw.slice(0, newDecStrRaw.length)
			: prevDecStrRaw.padEnd(newDecStrRaw.length, "0");
	}, [prevDecStrRaw, newDecStrRaw]);

	useEffect(() => {
		if (isInView) {
			prevNumberRef.current = effectiveNumber;
		}
	}, [effectiveNumber, isInView]);

	const intPlaces = useMemo(
		() =>
			Array.from(
				{ length: finalIntLength },
				(_, i) => MODULO_DIVISOR ** (finalIntLength - i - 1)
			),
		[finalIntLength]
	);
	const decPlaces = useMemo(
		() =>
			newDecStrRaw
				? Array.from(
						{ length: newDecStrRaw.length },
						(_, i) => MODULO_DIVISOR ** (newDecStrRaw.length - i - 1)
					)
				: [],
		[newDecStrRaw]
	);

	const newDecValue = newDecStrRaw ? Number.parseInt(newDecStrRaw, 10) : 0;
	const prevDecValue = adjustedPrevDec
		? Number.parseInt(adjustedPrevDec, 10)
		: 0;

	return (
		<span
			data-slot="sliding-number"
			ref={localRef}
			style={{
				display: "inline-flex",
				alignItems: "center",
			}}
			{...props}
		>
			{isInView && Number(number) < 0 && (
				<span style={{ marginRight: "0.25rem" }}>-</span>
			)}

			{intPlaces.map((place, idx) => {
				const digitsToRight = intPlaces.length - idx - 1;
				const isSeparatorPosition =
					typeof thousandSeparator !== "undefined" &&
					digitsToRight > 0 &&
					digitsToRight % THOUSAND_SEPARATOR_INTERVAL === 0;

				return (
					<Fragment key={`int-${place}`}>
						<SlidingNumberRoller
							place={place}
							prevValue={Number.parseInt(adjustedPrevInt, 10)}
							transition={transition}
							value={Number.parseInt(newIntStr ?? "0", 10)}
						/>
						{isSeparatorPosition && <span>{thousandSeparator}</span>}
					</Fragment>
				);
			})}

			{newDecStrRaw && (
				<>
					<span>{decimalSeparator}</span>
					{decPlaces.map((place) => (
						<SlidingNumberRoller
							delay={delay}
							key={`dec-${place}`}
							place={place}
							prevValue={prevDecValue}
							transition={transition}
							value={newDecValue}
						/>
					))}
				</>
			)}
		</span>
	);
}

export { SlidingNumber, type SlidingNumberProps };
