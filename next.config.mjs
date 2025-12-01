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
};

export default nextConfig;
