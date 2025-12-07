"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { PrayerTimes } from "@/entities/prayer";
import {
	getAzkarFromTranslations,
	getIslamicContentFromTranslations,
	type IslamicContent,
} from "@/shared/lib/prayer";
import { cn } from "@/shared/lib/utils";

type MinimalTickerProps = {
	className?: string;
	prayerTimes?: PrayerTimes | null;
	intervalMs?: number;
	/** Override the content pool completely */
	contentPool?: IslamicContent[];
	/** Hide the source line if false */
	showSource?: boolean;
	/** Class overrides */
	classes?: {
		container?: string;
		text?: string;
		source?: string;
	};
};

// Constants for time-based content selection
const MORNING_START_HOUR = 4; // Fajr time typically around 4 AM
const MORNING_END_HOUR = 12; // Before noon
const DEFAULT_TICKER_INTERVAL_MS = 5000; // 5 seconds

// Helper function to get random content from pool, avoiding the current one
function getRandomContentFromPool(
	pool: IslamicContent[],
	currentId: string,
	fallback: IslamicContent
): IslamicContent {
	if (pool.length === 0) {
		return fallback;
	}
	if (pool.length === 1) {
		return pool[0];
	}

	// Filter out current content to avoid showing same content back-to-back
	const availableContent = pool.filter((c) => c.id !== currentId);
	if (availableContent.length === 0) {
		// Fallback if all content is the same
		return pool[Math.floor(Math.random() * pool.length)];
	}

	const randomIndex = Math.floor(Math.random() * availableContent.length);
	return availableContent[randomIndex];
}

export function MinimalTicker({
	className,
	prayerTimes,
	intervalMs,
	contentPool,
	showSource = true,
	classes,
}: MinimalTickerProps) {
	const { i18n } = useTranslation();
	const locale = (i18n.language || "en") as "en" | "ar";
	const [islamicContent, setIslamicContent] = useState<IslamicContent[]>([]);
	const [azkar, setAzkar] = useState<{
		sabah: IslamicContent[];
		masaa: IslamicContent[];
		general: IslamicContent[];
	}>({ sabah: [], masaa: [], general: [] });
	const [isLoading, setIsLoading] = useState(true);

	const poolRef = useRef<IslamicContent[]>([]);
	const currentContentIdRef = useRef<string>("");
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Load content from translations
	useEffect(() => {
		async function loadContent() {
			setIsLoading(true);
			try {
				const [content, azkarData] = await Promise.all([
					getIslamicContentFromTranslations(locale),
					getAzkarFromTranslations(locale),
				]);
				setIslamicContent(content);
				setAzkar(azkarData);
			} catch (error) {
				console.error("Failed to load Islamic content:", error);
			} finally {
				setIsLoading(false);
			}
		}
		loadContent();
	}, [locale]);

	// Decide which pool (Sabah vs Masaa) based on current time (or prayer times if available)
	const basePool = useMemo<IslamicContent[]>(() => {
		if (contentPool && contentPool.length > 0) {
			return contentPool;
		}
		if (isLoading || islamicContent.length === 0) {
			return [];
		}
		const now = new Date();
		const hour = now.getHours();
		let morning = hour >= MORNING_START_HOUR && hour < MORNING_END_HOUR;
		if (prayerTimes) {
			const toMinutes = (t: string) => {
				const [h, m] = t.split(":").map(Number);
				return h * 60 + m;
			};
			const nowMin = now.getHours() * 60 + now.getMinutes();
			const fajr = toMinutes(prayerTimes.fajr);
			const asr = toMinutes(prayerTimes.asr);
			morning = nowMin >= fajr && nowMin < asr;
		}
		const timedPool = morning ? azkar.sabah : azkar.masaa;
		// Combine all content - random selection will ensure variety
		return [...azkar.general, ...timedPool, ...islamicContent];
	}, [prayerTimes, contentPool, isLoading, islamicContent, azkar]);

	const [currentContent, setCurrentContent] = useState<IslamicContent | null>(
		null
	);

	// Initialize content when pool is ready
	useEffect(() => {
		if (isLoading || basePool.length === 0) {
			return;
		}
		poolRef.current = basePool;
		const randomContent = getRandomContentFromPool(basePool, "", basePool[0]);
		currentContentIdRef.current = randomContent.id;
		setCurrentContent(randomContent);
	}, [basePool, isLoading]);

	// Update pool ref whenever basePool changes
	useEffect(() => {
		const previousPool = poolRef.current;
		poolRef.current = basePool;

		// Check if pool actually changed
		const poolChanged =
			previousPool.length !== basePool.length ||
			previousPool.length === 0 ||
			previousPool[0]?.id !== basePool[0]?.id;

		if (poolChanged && basePool.length > 0) {
			// Pool changed - get random content from new pool
			const currentId = currentContentIdRef.current;
			const newContent = getRandomContentFromPool(
				basePool,
				currentId,
				basePool[0]
			);
			currentContentIdRef.current = newContent.id;
			setCurrentContent(newContent);
		}
	}, [basePool]);

	// Handler to randomize content on click
	const handleRandomize = useCallback(() => {
		const currentPool = poolRef.current;
		if (currentPool.length === 0) {
			return;
		}
		const currentIdValue = currentContentIdRef.current;
		const nextContentValue = getRandomContentFromPool(
			currentPool,
			currentIdValue,
			currentPool[0]
		);
		currentContentIdRef.current = nextContentValue.id;
		setCurrentContent(nextContentValue);
		// Note: We don't reset the interval here - the main effect handles all interval management
		// This ensures the interval always respects the current intervalMs setting
	}, []);

	// Set up interval for randomly selecting content
	// This effect properly handles intervalMs changes by recreating the interval
	useEffect(() => {
		const interval = intervalMs ?? DEFAULT_TICKER_INTERVAL_MS;

		// Clear any existing interval first
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// Create new interval with current intervalMs value
		intervalRef.current = setInterval(() => {
			const effectPool = poolRef.current;
			if (effectPool.length === 0) {
				return;
			}
			const effectCurrentId = currentContentIdRef.current;
			const effectNextContent = getRandomContentFromPool(
				effectPool,
				effectCurrentId,
				effectPool[0]
			);
			currentContentIdRef.current = effectNextContent.id;
			setCurrentContent(effectNextContent);
		}, interval);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [intervalMs]);

	if (isLoading || !currentContent) {
		return (
			<div
				className={cn(
					"rounded-xl border border-border/60 bg-muted/40 px-4 py-3 shadow-md/50 backdrop-blur-sm",
					className,
					classes?.container
				)}
			>
				<div className={cn("text-muted-foreground text-sm", classes?.text)}>
					Loading...
				</div>
			</div>
		);
	}

	return (
		<button
			aria-label="Click to show next random content"
			className={cn(
				"cursor-pointer rounded-xl border border-border/60 bg-muted/40 px-4 py-3 shadow-md/50 backdrop-blur-sm transition-all duration-200 hover:bg-muted/60 active:bg-muted/50",
				className,
				classes?.container
			)}
			onClick={handleRandomize}
			type="button"
		>
			<div
				className={cn(
					"line-clamp-2 text-foreground text-sm leading-relaxed",
					classes?.text
				)}
			>
				{locale === "ar"
					? currentContent.arabic || currentContent.english
					: currentContent.english}
			</div>
			{!!showSource && (
				<div
					className={cn(
						"mt-2 font-medium text-muted-foreground/70 text-xs",
						classes?.source
					)}
				>
					— {currentContent.source}
				</div>
			)}
		</button>
	);
}
