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
};

export default nextConfig;
