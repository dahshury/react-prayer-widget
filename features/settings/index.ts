// Main export from the settings feature
// Re-export components and tabs for feature-level access

// Re-export constants for feature-level access
export { ASR_METHODS, CALCULATION_METHODS } from "./config";
// Re-export types for convenience
export type { SettingsDialogProps, TabCommonProps } from "./model";
// Re-export hooks for feature-level access
export { useAzanPlayer, useLocationDetection } from "./model";
export {
	AzanTab,
	CalculationTab,
	ColorPickerGroup,
	DisplayTab,
	GeneralTab,
	OffsetControl,
	SettingsDialog,
	WidgetSettingsContext,
} from "./ui";
