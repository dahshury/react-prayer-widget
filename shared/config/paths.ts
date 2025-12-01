import path from "node:path";

/**
 * Data directory configuration
 * These paths are resolved at runtime and should not be bundled.
 *
 * NOTE: Turbopack may show warnings about these paths matching many files.
 * This is expected - these are runtime data files that are read dynamically
 * via fs.readFile() and are not bundled into the application.
 */

// Use a runtime-only pattern that Turbopack cannot statically analyze
// This prevents Turbopack from trying to bundle these files
const getProjectRoot = () => process.cwd();

/**
 * Base path to the tawkit-9.61 data directory
 * This is a runtime data directory that contains prayer time files
 *
 * @turbopack-ignore - Runtime data directory, not bundled
 */
export const TAWKIT_DATA_DIR = (() => {
	const root = getProjectRoot();
	return path.resolve(root, "tawkit-9.61", "data");
})();

/**
 * Get the path to a country's data directory
 * @param countryCode - Two-letter country code (e.g., "US", "EG")
 * @returns Absolute path to the country's data directory
 *
 * @turbopack-ignore - Runtime path resolution, not bundled
 */
export function getCountryDataDir(countryCode: string): string {
	const cc = countryCode.toUpperCase();
	// Use runtime path resolution that Turbopack cannot statically analyze
	return path.resolve(TAWKIT_DATA_DIR, cc);
}

/**
 * Get the path to a country's cities file
 * @param countryCode - Two-letter country code (e.g., "US", "EG")
 * @returns Absolute path to the country's cities.js file
 *
 * @turbopack-ignore - Runtime path resolution, not bundled
 */
export function getCitiesFilePath(countryCode: string): string {
	const cc = countryCode.toUpperCase();
	// Use runtime path resolution that Turbopack cannot statically analyze
	const baseDir = getCountryDataDir(cc);
	return path.resolve(baseDir, `${cc}.js`);
}
