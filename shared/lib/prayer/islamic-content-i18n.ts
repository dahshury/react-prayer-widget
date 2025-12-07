import type { IslamicContent } from "./islamic-content";

/**
 * Get Islamic content from next-intl translations
 * This function works both in server and client components
 * Follows next-intl best practices: each locale file contains only its translations
 * For Arabic locale, falls back to English from en.json if Arabic is missing
 */
export async function getIslamicContentFromTranslations(
	locale: "en" | "ar" = "en"
): Promise<IslamicContent[]> {
	try {
		// Import locale-specific file (contains only translations for this locale)
		const messages = await import(`@/shared/i18n/messages/${locale}.json`);
		const content = messages.default?.islamicContent || {};

		// For Arabic locale, also load English for fallback
		let enContent: Record<
			string,
			{
				text?: string;
			}
		> = {};
		if (locale === "ar") {
			try {
				const enMessages = await import("@/shared/i18n/messages/en.json");
				enContent = enMessages.default?.islamicContent || {};
			} catch {
				// If en.json fails to load, continue without fallback
			}
		}

		return Object.entries(content).map(([id, item]) => {
			const typedItem = item as {
				type: "hadith" | "ayah";
				text: string;
				source: string;
			};
			const enItem = enContent[id] as
				| {
						text?: string;
				  }
				| undefined;

			if (locale === "ar") {
				// Arabic locale: use text as arabic, fallback to English if empty
				return {
					id,
					type: typedItem.type,
					arabic: typedItem.text || "",
					english: typedItem.text ? "" : enItem?.text || "",
					source: typedItem.source,
				};
			}
			// English locale: use text as english
			return {
				id,
				type: typedItem.type,
				arabic: "",
				english: typedItem.text || "",
				source: typedItem.source,
			};
		});
	} catch {
		// Fallback to empty array if translations not available
		return [];
	}
}

/**
 * Get Azkar content from next-intl translations
 * Follows next-intl best practices: each locale file contains only its translations
 * For Arabic locale, falls back to English from en.json if Arabic is missing
 */
export async function getAzkarFromTranslations(
	locale: "en" | "ar" = "en"
): Promise<{
	sabah: IslamicContent[];
	masaa: IslamicContent[];
	general: IslamicContent[];
}> {
	try {
		// Import locale-specific file (contains only translations for this locale)
		const messages = await import(`@/shared/i18n/messages/${locale}.json`);
		const azkar = messages.default?.azkar || {};

		// For Arabic locale, also load English for fallback
		let enAzkar: Record<
			string,
			Record<
				string,
				{
					text?: string;
				}
			>
		> = {};
		if (locale === "ar") {
			try {
				const enMessages = await import("@/shared/i18n/messages/en.json");
				const azkarData = enMessages.default?.azkar;
				if (azkarData) {
					// Extract only sabah, masaa, and general (exclude ui)
					enAzkar = {
						sabah: azkarData.sabah || {},
						masaa: azkarData.masaa || {},
						general: azkarData.general || {},
					};
				}
			} catch {
				// If en.json fails to load, continue without fallback
			}
		}

		const convertToArray = (
			obj: Record<
				string,
				{
					type: "hadith" | "ayah";
					text: string;
					source: string;
				}
			>,
			enObj?: Record<
				string,
				{
					text?: string;
				}
			>
		): IslamicContent[] =>
			Object.entries(obj).map(([id, item]) => {
				const enItem = enObj?.[id];

				if (locale === "ar") {
					// Arabic locale: use text as arabic, fallback to English if empty
					return {
						id,
						type: item.type,
						arabic: item.text || "",
						english: item.text ? "" : enItem?.text || "",
						source: item.source,
					};
				}
				// English locale: use text as english
				return {
					id,
					type: item.type,
					arabic: "",
					english: item.text || "",
					source: item.source,
				};
			});

		return {
			sabah: convertToArray(azkar.sabah || {}, enAzkar.sabah),
			masaa: convertToArray(azkar.masaa || {}, enAzkar.masaa),
			general: convertToArray(azkar.general || {}, enAzkar.general),
		};
	} catch {
		return {
			sabah: [],
			masaa: [],
			general: [],
		};
	}
}

/**
 * Client-side version that uses useTranslations hook
 * Use this in client components
 */
export function useIslamicContent(locale: "en" | "ar" = "en") {
	// This will be used with the useTranslations hook from next-intl
	// The actual implementation will be in the component using it
	return {
		getContent: async () => getIslamicContentFromTranslations(locale),
		getAzkar: async () => getAzkarFromTranslations(locale),
	};
}
