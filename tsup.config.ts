import { defineConfig } from "tsup";
import pkg from "./package.json";

const external = [
	...Object.keys(pkg.peerDependencies ?? {}),
	...Object.keys(pkg.dependencies ?? {}),
	// Explicitly mark problematic packages that use dynamic require
	"countries-and-timezones",
	"country-data-list",
	"country-region-data",
	// Next.js should not be bundled (it's a framework, not a library dependency)
	"next",
	"next/image",
];

export default defineConfig({
	entry: ["index.ts"],
	format: ["esm", "cjs"],
	dts: true,
	sourcemap: true,
	clean: true,
	target: "es2022",
	platform: "browser",
	minify: false,
	treeshake: true,
	splitting: false,
	tsconfig: "./tsconfig.build.json",
	external,
	// Ensure proper ESM/CJS interop
	esbuildOptions(options) {
		// Prevent dynamic require in output
		options.keepNames = true;
	},
	// Prevent bundling of node_modules
	noExternal: [],
});
