// Domain-specific prayer logic moved to entities/prayer
// This file now only exports shared content (azan, azkar, islamic-content)

export {
	type AzanChoiceId,
	BUILTIN_AZAN_SOURCES,
	customStorageKey,
	getAzanSource,
	getCustomAzanGlobalName,
	getCustomAzanName,
	globalCustomStorageKey,
	type PrayerName,
	removeCustomAzanFile,
	removeCustomAzanFileGlobal,
	storeCustomAzanFile,
	storeCustomAzanFileGlobal,
} from "./azan";
export {
	DEFAULT_ISLAMIC_CONTENT,
	getContentByType,
	getContentByTypeFromTranslations,
	getRandomContent,
	getRandomContentFromTranslations,
	type IslamicContent,
} from "./islamic-content";
export {
	getAzkarFromTranslations,
	getIslamicContentFromTranslations,
	useIslamicContent,
} from "./islamic-content-i18n";
