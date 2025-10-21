"use client";

import { useCallback, useTransition } from "react";
import type { ExtendedPrayerSettings } from "@/entities/prayer";
import { FRIDAY_DAY_INDEX } from "@/features/prayer/constants";

/**
 * Manages prayer page state: deferred settings updates, Friday detection,
 * and responsive visibility logic for the prayer times display
 */
export function usePrayerPageState(
	settings: ExtendedPrayerSettings,
	currentTime: Date,
	updateSettings: (s: Partial<ExtendedPrayerSettings>) => void
) {
	const [, startTransition] = useTransition();

	/**
	 * Deferred settings update wrapped in useTransition
	 * Prevents UI blocking when updating settings
	 */
	const updateSettingsDeferred = useCallback(
		(s: Partial<ExtendedPrayerSettings>) => {
			startTransition(() => {
				updateSettings(s);
			});
		},
		[updateSettings]
	);

	/**
	 * Check if today is Friday (prayer day)
	 * 5 = Friday (0 = Sunday, 1 = Monday, etc.)
	 */
	const isFriday = currentTime.getDay() === FRIDAY_DAY_INDEX;

	/**
	 * Check if screen width is small (xs or xxs breakpoint)
	 * Used to hide non-essential UI elements on small screens
	 */
	const isSmallScreen =
		settings.appWidth === "xs" || settings.appWidth === "xxs";

	/**
	 * Determine if other prayer cards should be visible
	 * Visible only if: showOtherPrayers enabled AND not on small screen
	 */
	const otherPrayersVisible =
		(settings.showOtherPrayers ?? true) && !isSmallScreen;

	return {
		updateSettingsDeferred,
		isFriday,
		isSmallScreen,
		otherPrayersVisible,
	};
}
