"use client";

import { useEffect } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18nInstance from "@/shared/config/i18next";

type I18nextProviderWrapperProps = {
	children: React.ReactNode;
};

// Regex for matching NEXT_LOCALE cookie - defined at top level for performance
const NEXT_LOCALE_REGEX = /NEXT_LOCALE=([^;]+)/;
const SETTINGS_KEY = "tawkit:settings";

type Locale = "en" | "ar";

function isValidLocale(value: string): value is Locale {
	return value === "en" || value === "ar";
}

function updateHtmlAttributes(lang: Locale): void {
	document.documentElement.lang = lang;
	document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

function getLanguageFromCookie(): Locale | null {
	const cookieMatch = document.cookie.match(NEXT_LOCALE_REGEX);
	if (cookieMatch && isValidLocale(cookieMatch[1])) {
		return cookieMatch[1];
	}
	return null;
}

function getLanguageFromLocalStorage(): Locale | null {
	try {
		const settingsRaw = localStorage.getItem(SETTINGS_KEY);
		if (!settingsRaw) {
			return null;
		}
		const settings = JSON.parse(settingsRaw);
		if (settings.language && isValidLocale(settings.language)) {
			return settings.language;
		}
	} catch {
		// Ignore errors
	}
	return null;
}

function LanguageSync() {
	const { i18n } = useTranslation();

	useEffect(() => {
		// Sync i18n language with cookie/localStorage on mount
		const syncLanguage = () => {
			// Try cookie first
			const cookieLang = getLanguageFromCookie();
			if (cookieLang && i18n.language !== cookieLang) {
				i18n.changeLanguage(cookieLang);
				updateHtmlAttributes(cookieLang);
				return;
			}

			// Try localStorage
			const storageLang = getLanguageFromLocalStorage();
			if (storageLang && i18n.language !== storageLang) {
				i18n.changeLanguage(storageLang);
				updateHtmlAttributes(storageLang);
			}
		};

		syncLanguage();

		// Listen for language changes
		const interval = setInterval(syncLanguage, 1000);

		// Listen to i18n language changes
		const handleLanguageChange = (lng: string) => {
			if (lng === "en" || lng === "ar") {
				document.documentElement.lang = lng;
				document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
			}
		};

		i18n.on("languageChanged", handleLanguageChange);

		return () => {
			clearInterval(interval);
			i18n.off("languageChanged", handleLanguageChange);
		};
	}, [i18n]);

	return null;
}

export function I18nextProviderWrapper({
	children,
}: I18nextProviderWrapperProps) {
	return (
		<I18nextProvider i18n={i18nInstance}>
			<LanguageSync />
			{children}
		</I18nextProvider>
	);
}
