import { defineConfig } from "tsup";
import pkg from "./package.json";

const external = [
	...Object.keys(pkg.peerDependencies ?? {}),
	...Object.keys(pkg.dependencies ?? {}),
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
});
