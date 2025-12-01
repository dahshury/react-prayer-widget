"use client";

import { useEffect, useState } from "react";

/**
 * Hook that updates current time every second.
 * Useful for real-time clock displays and countdown updates.
 */
export function useCurrentTime() {
	const [currentTime, setCurrentTime] = useState(() => {
		// Only create Date on client side to avoid SSR issues
		if (typeof window !== "undefined") {
			return new Date();
		}
		// Return a safe default for SSR
		return new Date(0);
	});
	const TIME_UPDATE_INTERVAL_MS = 1000; // Update every second

	useEffect(() => {
		// Update immediately on mount to get the correct time
		setCurrentTime(new Date());

		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, TIME_UPDATE_INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	return currentTime;
}
