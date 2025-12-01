/**
 * React Prayer Widget - Prayer Times Widget Library
 *
 * Embeddable React components for displaying Islamic prayer times.
 * Perfect for headers, sidebars, or dedicated prayer time sections.
 */

// Location Type
export type { Location } from "./entities/location";
// Types
export type {
	ExtendedPrayerSettings,
	PrayerSettings,
	PrayerTimes,
} from "./entities/prayer/model";
// Header Components
export { TopBar, type TopBarProps } from "./features/navigation/ui/top-bar";
export type { SettingsDialogProps } from "./features/settings";
// Settings Context (for right-click context menu)
export {
	SettingsDialog,
	WidgetSettingsContext,
} from "./features/settings/ui";
export type { Language } from "./shared/config/translations";
export { countryToFlag } from "./shared/lib/geo";
// Translation Provider (required for widgets to work)
export {
	TranslationProvider,
	useTranslation,
} from "./shared/lib/hooks/use-translation";
// Utilities (for formatting prayer times data)
export {
	formatCurrentTime,
	formatMinutesHHmm,
	formatTimeDisplay,
} from "./shared/lib/time";
export { cn } from "./shared/lib/utils";
export { DualDateDisplay } from "./widgets/dates";
// Widget Components
export {
	type NextPrayer,
	NextPrayerCard,
	type NextPrayerCardProps,
	WidgetPrayerCard,
	type WidgetPrayerCardProps,
	type WidgetPrayerCardSize,
	WidgetPrayerCardSkeleton,
} from "./widgets/prayer-card";
export {
	PrayerGrid,
	type PrayerGridProps,
} from "./widgets/prayer-grid";
export {
	MinimalTicker,
	ScrollingTicker,
} from "./widgets/ticker";
