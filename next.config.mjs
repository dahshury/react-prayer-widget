/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	// Enable cache components for static UI caching (Next.js 16)
	cacheComponents: true,
	// Turbopack configuration
	turbopack: {},
	// Exclude tawkit-9.61 from output file tracing (prevents bundling analysis)
	// These are runtime data files read via fs.readFile() and should not be bundled
	outputFileTracingExcludes: {
		"*": ["./tawkit-9.61/data/**/*"],
	},
	// Handle dynamic require in dependencies when using built package
	// This allows the demo page to simulate external package usage
	// In Next.js 16+, serverExternalPackages is a top-level config (not experimental)
	serverExternalPackages: [
		"countries-and-timezones",
		"country-data-list",
		"country-region-data",
	],
	// Transpile the built package so Next.js can properly process it
	// This is needed because the package uses next/image and other Next.js features
	transpilePackages: ["react-prayer-widget"],
};

export default nextConfig;
