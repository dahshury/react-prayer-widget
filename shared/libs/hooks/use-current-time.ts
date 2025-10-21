"use client";

import { useEffect, useState } from "react";

/**
 * Hook that updates current time every second.
 * Useful for real-time clock displays and countdown updates.
 */
export function useCurrentTime() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const TIME_UPDATE_INTERVAL_MS = 1000; // Update every second

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, TIME_UPDATE_INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	return currentTime;
}
