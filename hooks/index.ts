// Hooks have moved to their respective feature and shared locations
// Re-export from shared/libs/hooks for backward compatibility

// Re-export types from prayer domain entities
export type {
	ExtendedPrayerSettings,
	UsePrayerTimesOptions,
} from "@/entities/prayer";

// Re-export from features/prayer/hooks for backward compatibility
export {
	useAzan,
	useLoadPrayerTimes,
	usePrayerProgress,
	usePrayerTimes,
} from "@/features/prayer/hooks";

// Re-export from features/settings/hooks for backward compatibility
export {
	useGeolocationPermission,
	useSettingsPersistence,
} from "@/features/settings/hooks";
export {
	useControlledState,
	useCurrentTime,
	useIsInView,
	useTimezoneSync,
	useTranslation,
} from "@/shared/libs/hooks";
