export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type AzanChoiceId =
	| "default"
	| "short"
	| "fajr"
	| "beep"
	| "off"
	| `custom:${PrayerName}`
	| "custom:global";

/** Map built-in azan IDs to public asset paths */
export const BUILTIN_AZAN_SOURCES: Record<string, string> = {
	default: "/audio/audio_azan.mp3",
	short: "/audio/short_azan.mp3",
	fajr: "/audio/audio_fajr.mp3",
	beep: "/audio/w-alert-1.wav",
};

// Helper function: Get custom azan source from localStorage
function getCustomAzanSource(
	choice: string,
	prayer: PrayerName
): string | null {
	if (choice === "custom:global") {
		const key = globalCustomStorageKey();
		const url =
			typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
		return url || null;
	}

	const p = choice.split(":")[1] as PrayerName | undefined;
	if (p && p === prayer) {
		// We store custom file via blob URL in localStorage map
		const key = customStorageKey(p);
		const url =
			typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
		return url || null;
	}

	return null;
}

export function getAzanSource(
	choice: AzanChoiceId | string | undefined,
	prayer: PrayerName
): string | null {
	// Handle empty or default choice
	if (!choice || choice === "default") {
		return BUILTIN_AZAN_SOURCES.default;
	}

	// Handle "off" early
	if (choice === "off") {
		return null;
	}

	// Check for built-in choices
	if (choice in BUILTIN_AZAN_SOURCES) {
		return BUILTIN_AZAN_SOURCES[choice];
	}

	// Handle custom choices
	if (choice.startsWith("custom:")) {
		return getCustomAzanSource(choice, prayer);
	}

	// Fallback for unknown choices
	return BUILTIN_AZAN_SOURCES[choice] || null;
}

export function customStorageKey(prayer: PrayerName): string {
	return `tawkit:azan:custom:${prayer}`;
}

export async function storeCustomAzanFile(
	prayer: PrayerName,
	file: File
): Promise<{ url: string; name: string }> {
	// Persist as Data URL for durability across reloads
	const dataUrl: string = await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.onload = () => resolve(String(reader.result));
		reader.readAsDataURL(file);
	});
	localStorage.setItem(customStorageKey(prayer), dataUrl);
	localStorage.setItem(`${customStorageKey(prayer)}:name`, file.name);
	return { url: dataUrl, name: file.name };
}

export function globalCustomStorageKey(): string {
	return "tawkit:azan:custom:GLOBAL";
}

export async function storeCustomAzanFileGlobal(
	file: File
): Promise<{ url: string; name: string }> {
	const dataUrl: string = await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.onload = () => resolve(String(reader.result));
		reader.readAsDataURL(file);
	});
	localStorage.setItem(globalCustomStorageKey(), dataUrl);
	localStorage.setItem(`${globalCustomStorageKey()}:name`, file.name);
	return { url: dataUrl, name: file.name };
}

export function removeCustomAzanFileGlobal() {
	const key = globalCustomStorageKey();
	localStorage.removeItem(key);
	localStorage.removeItem(`${key}:name`);
}

export function getCustomAzanGlobalName(): string | undefined {
	return localStorage.getItem(`${globalCustomStorageKey()}:name`) || undefined;
}

export function removeCustomAzanFile(prayer: PrayerName) {
	const key = customStorageKey(prayer);
	localStorage.removeItem(key);
	localStorage.removeItem(`${key}:name`);
}

export function getCustomAzanName(prayer: PrayerName): string | undefined {
	return localStorage.getItem(`${customStorageKey(prayer)}:name`) || undefined;
}
