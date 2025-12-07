import { getAssetUrl } from "./assets";

/**
 * Generate available backgrounds list
 * Includes: default and image backgrounds (HR/VR)
 */
export const AVAILABLE_BACKGROUNDS = [
	{
		value: "default",
		label: "Default (Prayer-based)",
		type: "gradient" as const,
	},
	// Image backgrounds - Horizontal
	...Array.from({ length: 40 }, (_, i) => ({
		value: `hr-${i}`,
		label: `Horizontal Image ${i}`,
		type: "image" as const,
	})),
	// Image backgrounds - Vertical
	...Array.from({ length: 40 }, (_, i) => ({
		value: `vr-${i}`,
		label: `Vertical Image ${i}`,
		type: "image" as const,
	})),
] as const;

export type BackgroundValue = (typeof AVAILABLE_BACKGROUNDS)[number]["value"];

export const DEFAULT_CARD_BACKGROUND: BackgroundValue = "default";

/**
 * Get a random background from available backgrounds
 */
export function getRandomBackground(): BackgroundValue {
	const imageBackgrounds = AVAILABLE_BACKGROUNDS.filter(
		(bg) => bg.type === "image"
	);
	if (imageBackgrounds.length === 0) {
		return DEFAULT_CARD_BACKGROUND;
	}
	const randomIndex = Math.floor(Math.random() * imageBackgrounds.length);
	return imageBackgrounds[randomIndex].value;
}

/**
 * Get background style for a card
 * Returns the background image URL and opacity separately
 * so opacity can be applied only to the background layer, not the entire card
 */
export function getCardBackgroundStyle(
	background: BackgroundValue | undefined,
	_horizontalView: boolean,
	opacity?: number
): { backgroundImage?: string; opacity?: number } | undefined {
	if (!background || background === "default") {
		return; // Use default gradient classes
	}

	// Image backgrounds
	if (background.startsWith("hr-") || background.startsWith("vr-")) {
		const prefix = background.startsWith("hr-") ? "HR" : "VR";
		const num = background.split("-")[1];
		return {
			backgroundImage: `url(${getAssetUrl(`backgrounds/${prefix}-${num}.jpg`)})`,
			opacity,
		};
	}

	return;
}
