"use client";

/**
 * Resolve a public asset URL that is bundled with the package.
 * In Next.js, public assets are served from the root, so we use direct paths.
 */
export function getAssetUrl(relativePath: string): string {
	// In Next.js, public folder assets are served from root
	// So /backgrounds/VR-9.jpg maps to public/backgrounds/VR-9.jpg
	return `/${relativePath}`;
}
