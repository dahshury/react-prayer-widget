// Main export from the settings feature
// Re-export components for feature-level access
export {
	ColorPickerGroup,
	OffsetControl,
	SettingsDialog,
	WidgetSettingsContext,
} from "./components";
// Re-export constants for feature-level access
export { ASR_METHODS, CALCULATION_METHODS } from "./constants";
// Re-export hooks for feature-level access
export { useAzanPlayer, useLocationDetection } from "./hooks";

// Re-export tabs for feature-level access
export {
	AzanTab,
	CalculationTab,
	DisplayTab,
	GeneralTab,
	LocationTab,
} from "./tabs";
// Re-export types for convenience
export type { SettingsDialogProps } from "./types";
