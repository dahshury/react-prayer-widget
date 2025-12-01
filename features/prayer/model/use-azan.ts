"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ExtendedPrayerSettings, PrayerTimes } from "@/entities/prayer";
import { getAzanSource, type PrayerName } from "@/shared/lib/prayer";

type UseAzanArgs = {
	prayerTimes: PrayerTimes | null;
	settings: ExtendedPrayerSettings;
};

/**
 * Client-only hook that schedules azan playback at exact prayer times.
 * Uses Audio element to play selected file with configured volume.
 */
export function useAzan({ prayerTimes, settings }: UseAzanArgs) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const timeoutRef = useRef<number | null>(null);
	const lastPlayedRef = useRef<string | null>(null);

	// Memoize ordered list of prayers with times in minutes
	const schedule = useMemo(() => {
		if (!prayerTimes) {
			return [] as Array<{ name: PrayerName; minutes: number; hhmm: string }>;
		}
		const parse = (hhmm: string) => {
			const [h, m] = hhmm.split(":").map(Number);
			return h * 60 + m;
		};
		return [
			{
				name: "Fajr" as const,
				hhmm: prayerTimes.fajr,
				minutes: parse(prayerTimes.fajr),
			},
			{
				name: "Dhuhr" as const,
				hhmm: prayerTimes.dhuhr,
				minutes: parse(prayerTimes.dhuhr),
			},
			{
				name: "Asr" as const,
				hhmm: prayerTimes.asr,
				minutes: parse(prayerTimes.asr),
			},
			{
				name: "Maghrib" as const,
				hhmm: prayerTimes.maghrib,
				minutes: parse(prayerTimes.maghrib),
			},
			{
				name: "Isha" as const,
				hhmm: prayerTimes.isha,
				minutes: parse(prayerTimes.isha),
			},
		];
	}, [prayerTimes]);

	useEffect(() => {
		if (!settings.azanEnabled || schedule.length === 0) {
			return;
		}

		const ensureAudio = () => {
			if (!audioRef.current) {
				audioRef.current = new Audio();
			}
			audioRef.current.volume = Math.min(
				1,
				Math.max(0, settings.azanVolume ?? 1)
			);
			return audioRef.current;
		};

		const playFor = (prayer: PrayerName) => {
			const choice = settings.azanPerPrayer
				? settings.azanByPrayer?.[prayer] || "default"
				: settings.azanGlobalChoice || "default";
			const src = getAzanSource(choice, prayer);
			if (!src) {
				return;
			}
			const audio = ensureAudio();
			if (audio.src !== src) {
				audio.src = src;
			}
			// Avoid double playing for the same HH:MM in case of re-renders
			const marker = `${new Date().toDateString()}|${prayer}`;
			if (lastPlayedRef.current === marker) {
				return;
			}
			lastPlayedRef.current = marker;
			audio
				.play()
				.then(() => {
					// Audio playback started successfully
				})
				.catch(() => {
					// Autoplay may fail if not user-gestured; ignore.
				});
		};

		const scheduleNext = () => {
			if (!schedule.length) {
				return;
			}
			const now = new Date();
			const nowM = now.getHours() * 60 + now.getMinutes();
			// find next >= now
			let next = schedule.find((p) => p.minutes > nowM);
			if (!next) {
				next = schedule[0]; // next day fajr
			}
			const target = new Date();
			const [h, m] = next.hhmm.split(":").map(Number);
			target.setHours(h, m, 0, 0);
			const lastSchedule = schedule.at(-1);
			if (next === schedule[0] && lastSchedule && lastSchedule.minutes < nowM) {
				target.setDate(target.getDate() + 1);
			}
			const ms = Math.max(0, target.getTime() - now.getTime());
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current);
			}
			const nextName = next?.name as PrayerName;
			timeoutRef.current = window.setTimeout(() => {
				if (nextName) {
					playFor(nextName);
				}
				scheduleNext();
			}, ms) as unknown as number;
		};

		scheduleNext();

		return () => {
			if (timeoutRef.current) {
				window.clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = null;
		};
	}, [
		settings.azanEnabled,
		settings.azanVolume,
		settings.azanByPrayer,
		settings.azanGlobalChoice,
		settings.azanPerPrayer,
		schedule,
	]);
}
