import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import arMessages from "../i18n/messages/ar.json";
import enMessages from "../i18n/messages/en.json";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

// Regex for matching NEXT_LOCALE cookie - defined at top level for performance
const NEXT_LOCALE_REGEX = /NEXT_LOCALE=([^;]+)/;

// Get initial language from cookie or localStorage, default to "en"
const getInitialLanguage = (): Locale => {
	if (typeof window === "undefined") {
		return "en";
	}

	// Try cookie first
	const cookieMatch = document.cookie.match(NEXT_LOCALE_REGEX);
	if (cookieMatch && (cookieMatch[1] === "en" || cookieMatch[1] === "ar")) {
		return cookieMatch[1] as Locale;
	}

	// Try localStorage (settings)
	try {
		const settingsKey = "tawkit:settings";
		const settingsRaw = localStorage.getItem(settingsKey);
		if (settingsRaw) {
			const settings = JSON.parse(settingsRaw);
			if (
				settings.language &&
				(settings.language === "en" || settings.language === "ar")
			) {
				return settings.language as Locale;
			}
		}
	} catch {
		// Ignore localStorage errors
	}

	return "en";
};

i18next.use(initReactI18next).init({
	resources: {
		en: {
			translation: enMessages,
		},
		ar: {
			translation: arMessages,
		},
	},
	lng: getInitialLanguage(),
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});

// Listen for language changes from settings
if (typeof window !== "undefined") {
	// Watch for cookie changes
	const checkLanguage = () => {
		const cookieMatch = document.cookie.match(NEXT_LOCALE_REGEX);
		if (cookieMatch && (cookieMatch[1] === "en" || cookieMatch[1] === "ar")) {
			const newLang = cookieMatch[1] as Locale;
			if (i18next.language !== newLang) {
				i18next.changeLanguage(newLang);
			}
		}
	};

	// Check periodically for cookie changes
	setInterval(checkLanguage, 1000);

	// Also listen to storage events (for cross-tab sync)
	window.addEventListener("storage", (e) => {
		if (e.key === "tawkit:settings") {
			try {
				const settings = JSON.parse(e.newValue || "{}");
				if (
					settings.language &&
					(settings.language === "en" || settings.language === "ar")
				) {
					i18next.changeLanguage(settings.language);
				}
			} catch {
				// Ignore parse errors
			}
		}
	});
}

const i18n = i18next;
export default i18n;
