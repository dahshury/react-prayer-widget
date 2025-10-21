/**
 * Get Tailwind CSS width class for responsive app container
 * @param appWidth - App width setting (xxs, xs, md, lg, xl, 2xl, or 3xl)
 * @returns Tailwind max-width class
 */
export function getResponsiveWidthClass(appWidth: string): string {
	const widthMap: Record<string, string> = {
		xxs: "max-w-[360px]",
		xs: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
		"2xl": "max-w-2xl",
		"3xl": "max-w-3xl",
	};
	return widthMap[appWidth] || "max-w-xl";
}
