import type { ReactElement } from "react";

function getNonOverridingDataAttributes(
	element: ReactElement,
	dataAttributes: Record<string, unknown>
): Record<string, unknown> {
	return Object.keys(dataAttributes).reduce<Record<string, unknown>>(
		(acc, key) => {
			if ((element.props as Record<string, unknown>)[key] === undefined) {
				acc[key] = dataAttributes[key];
			}
			return acc;
		},
		{}
	);
}

export { getNonOverridingDataAttributes };
