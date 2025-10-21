"use client";

import { createContext, useContext } from "react";

import type { HighlightContextType } from "./highlight.types";

const HighlightContext = createContext<
	HighlightContextType<string> | undefined
>(undefined);

function useHighlight<T extends string>(): HighlightContextType<T> {
	const context = useContext(HighlightContext);
	if (!context) {
		throw new Error("useHighlight must be used within a HighlightProvider");
	}
	return context as unknown as HighlightContextType<T>;
}

export { HighlightContext, useHighlight };
