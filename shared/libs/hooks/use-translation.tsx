"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type Language, translations } from "@/shared/config/translations";

type TranslationContextType = {
	t: (key: string) => string;
	language: Language;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
	undefined
);

type TranslationProviderProps = {
	children: ReactNode;
	language: Language;
};

export function TranslationProvider({
	children,
	language,
}: TranslationProviderProps) {
	const t = (key: string): string => {
		const keys = key.split(".");
		let value: unknown = translations[language];

		for (const k of keys) {
			if (value && typeof value === "object" && value !== null) {
				value = (value as Record<string, unknown>)[k];
			} else {
				return key;
			}
		}

		return typeof value === "string" ? value : key;
	};

	return (
		<TranslationContext.Provider value={{ t, language }}>
			{children}
		</TranslationContext.Provider>
	);
}

export function useTranslation() {
	const context = useContext(TranslationContext);
	if (!context) {
		throw new Error("useTranslation must be used within a TranslationProvider");
	}
	return context;
}
