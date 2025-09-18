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

export function getAzanSource(
	choice: AzanChoiceId | string | undefined,
	prayer: PrayerName,
): string | null {
	if (!choice || choice === "default") return BUILTIN_AZAN_SOURCES.default;
	if (choice === "short") return BUILTIN_AZAN_SOURCES.short;
	if (choice === "fajr") return BUILTIN_AZAN_SOURCES.fajr;
	if (choice === "beep") return BUILTIN_AZAN_SOURCES.beep;
	if (choice === "off") return null;
	if (choice.startsWith("custom:")) {
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
	return BUILTIN_AZAN_SOURCES[choice] || null;
}

export function customStorageKey(prayer: PrayerName): string {
	return `tawkit:azan:custom:${prayer}`;
}

export async function storeCustomAzanFile(
	prayer: PrayerName,
	file: File,
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
	file: File,
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
