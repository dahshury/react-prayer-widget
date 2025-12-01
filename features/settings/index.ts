// Main export from the settings feature
// Re-export components and tabs for feature-level access

// Re-export constants for feature-level access
export { ASR_METHODS, CALCULATION_METHODS } from "./config";
// Re-export types for convenience
export type { SettingsDialogProps } from "./model";
// Re-export hooks for feature-level access
export {
	useAzanPlayer,
	useGeolocationPermission,
	useLocationDetection,
	useSettingsPersistence,
} from "./model";
export {
	AzanTab,
	CalculationTab,
	ColorPickerGroup,
	DisplayTab,
	GeneralTab,
	LocationTab,
	OffsetControl,
	SettingsDialog,
	WidgetSettingsContext,
} from "./ui";
