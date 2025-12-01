import { useRef, useState } from "react";
import type { AllSettings } from "@/entities/prayer/config";
import type { PrayerName } from "@/shared/lib/prayer";
import {
	getAzanSource,
	removeCustomAzanFile,
	storeCustomAzanFile,
} from "@/shared/lib/prayer";

export function useAzanPlayer(settings: AllSettings) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [previewingKey, setPreviewingKey] = useState<string | null>(null);

	const ensureAudio = () => {
		if (!audioRef.current) {
			audioRef.current = new Audio();
		}
		audioRef.current.volume = Math.min(
			1,
			Math.max(0, settings.azanVolume ?? 1)
		);
		// Ensure we clear preview state when audio finishes
		audioRef.current.onended = () => {
			setPreviewingKey(null);
		};
		return audioRef.current;
	};

	const stopAudio = () => {
		if (!audioRef.current) {
			return;
		}
		try {
			audioRef.current.pause();
		} catch {
			// Ignore pause errors
		}
		try {
			audioRef.current.currentTime = 0;
		} catch {
			// Ignore currentTime errors
		}
	};

	const playSrc = (src: string | null, key: string) => {
		if (!src) {
			return;
		}
		const audio = ensureAudio();
		try {
			audio.pause();
			audio.currentTime = 0;
		} catch {
			// Ignore pause/reset errors
		}
		if (audio.src !== src) {
			audio.src = src;
		}
		audio
			.play()
			.then(() => setPreviewingKey(key))
			.catch(() => {
				// Ignore playback errors
			});
	};

	const togglePreviewGlobal = () => {
		if (settings.azanPerPrayer) {
			return;
		}
		const key = "global";
		if (previewingKey === key) {
			setPreviewingKey(null);
			stopAudio();
			return;
		}
		const choice = settings.azanGlobalChoice || "default";
		const src = getAzanSource(choice, "Dhuhr");
		playSrc(src, key);
	};

	const handleUpload = async (p: PrayerName, file: File) => {
		const { name } = await storeCustomAzanFile(p, file);
		const result = {
			azanByPrayer: { ...(settings.azanByPrayer || {}), [p]: `custom:${p}` },
			azanCustomNames: { ...(settings.azanCustomNames || {}), [p]: name },
		};
		// Auto preview uploaded file for that prayer
		if ((settings.azanPerPrayer ?? false) && settings.azanEnabled !== false) {
			setPreviewingKey(null);
			stopAudio();
			const src = getAzanSource(`custom:${p}`, p);
			playSrc(src, `prayer:${p}`);
		}
		return result;
	};

	const handleRemove = (p: PrayerName) => {
		removeCustomAzanFile(p);
		const next = { ...(settings.azanByPrayer || {}) };
		delete next[p];
		const nextNames = { ...(settings.azanCustomNames || {}) };
		delete nextNames[p];
		return { azanByPrayer: next, azanCustomNames: nextNames };
	};

	return {
		audioRef,
		previewingKey,
		setPreviewingKey,
		stopAudio,
		playSrc,
		togglePreviewGlobal,
		handleUpload,
		handleRemove,
	};
}
