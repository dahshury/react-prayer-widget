export interface PrayerTimes {
	fajr: string;
	sunrise: string;
	dhuhr: string;
	asr: string;
	maghrib: string;
	isha: string;
	date: string;
	hijri: string;
}

export interface Location {
	latitude: number;
	longitude: number;
	city: string;
	country: string;
	countryCode?: string;
	cityCode?: string;
	timezoneName?: string;
}

export interface PrayerSettings {
	calculationMethod: number;
	asrMethod: number;
	fajrOffset: number;
	dhuhrOffset: number;
	asrOffset: number;
	maghribOffset: number;
	ishaOffset: number;
	// Tawkit-like hour toggles
	applySummerHour?: boolean;
	forceHourMore?: boolean;
	forceHourLess?: boolean;
}

const DEFAULT_LOCATION: Location = {
	latitude: 21.3891,
	longitude: 39.8579,
	city: "Makkah",
	country: "Saudi Arabia",
};

const DEFAULT_SETTINGS: PrayerSettings = {
	calculationMethod: 4, // Umm Al-Qura University, Makkah
	asrMethod: 0, // Standard (Shafi, Maliki, Hanbali)
	fajrOffset: 0,
	dhuhrOffset: 0,
	asrOffset: 0,
	maghribOffset: 0,
	ishaOffset: 0,
};
export async function getCurrentLocation(
	language: "en" | "ar" = "en",
	opts?: { strict?: boolean },
): Promise<Location> {
	// Helper: IP-based fallback geolocation (when geolocation blocked/unavailable)
	const ipFallback = async (): Promise<Location> => {
		try {
			const res = await fetch("https://ipapi.co/json/");
			const data = (await res.json()) as {
				latitude?: number;
				longitude?: number;
				city?: string;
				country_name?: string;
				country_code?: string;
			};
			if (
				data &&
				typeof data.latitude === "number" &&
				typeof data.longitude === "number"
			) {
				return {
					latitude: data.latitude,
					longitude: data.longitude,
					city: data.city || (language === "ar" ? "غير معروف" : "Unknown"),
					country:
						data.country_name || (language === "ar" ? "غير معروف" : "Unknown"),
					countryCode: data.country_code || undefined,
				};
			}
		} catch {
			// ignore
		}
		return DEFAULT_LOCATION;
	};

	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			if (opts?.strict) {
				reject(new Error("geolocation_unavailable"));
			} else {
				void ipFallback().then(resolve);
			}
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				try {
					const { latitude, longitude } = position.coords;

					// Reverse geocoding to get city name
					const response = await fetch(
						`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}`,
					);
					const data = await response.json();

					resolve({
						latitude,
						longitude,
						city: data.city || (language === "ar" ? "غير معروف" : "Unknown"),
						country:
							data.countryName || (language === "ar" ? "غير معروف" : "Unknown"),
						countryCode: data.countryCode || undefined,
					});
				} catch (error) {
					console.error("Error getting location details:", error);
					if (opts?.strict) {
						reject(new Error("reverse_geocode_failed"));
					} else {
						void ipFallback().then(resolve);
					}
				}
			},
			() => {
				if (opts?.strict) {
					reject(new Error("geolocation_denied"));
				} else {
					void ipFallback().then(resolve);
				}
			},
			{ timeout: 10000 },
		);
	});
}

export async function getPrayerTimes(
	location: Location,
	settings: PrayerSettings = DEFAULT_SETTINGS,
): Promise<PrayerTimes> {
	try {
		const date = new Date();
		const dateStr = date.toISOString().split("T")[0];

		// Prefer local tawkit dataset when we have a country code
		if (location.countryCode) {
			const local = await fetch("/api/wtimes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					countryCode: location.countryCode,
					timezone:
						location.timezoneName ||
						Intl.DateTimeFormat().resolvedOptions().timeZone,
					date: dateStr,
					city: location.cityCode
						? location.cityCode.split(".")[1]
						: location.city,
					offsets: {
						fajr: settings.fajrOffset || 0,
						sunrise: 0,
						dhuhr: settings.dhuhrOffset || 0,
						asr: settings.asrOffset || 0,
						maghrib: settings.maghribOffset || 0,
						isha: settings.ishaOffset || 0,
					},
					applySummerHour: !!settings.applySummerHour,
					forceHourMore: !!settings.forceHourMore,
					forceHourLess: !!settings.forceHourLess,
				}),
			});
			if (local.ok) {
				const t = await local.json();
				return {
					fajr: t.fajr,
					sunrise: t.sunrise,
					dhuhr: t.dhuhr,
					asr: t.asr,
					maghrib: t.maghrib,
					isha: t.isha,
					date: dateStr,
					hijri: "—",
				};
			}
		}

		const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${location.latitude}&longitude=${location.longitude}&method=${settings.calculationMethod}&school=${settings.asrMethod}`;

		const response = await fetch(url);
		const data = await response.json();

		if (data.code !== 200) {
			throw new Error("Failed to fetch prayer times");
		}

		const timings = data.data.timings;
		const hijriDate = data.data.date.hijri;

		// Apply offsets
		const applyOffset = (time: string, offset: number): string => {
			if (offset === 0) return time;

			const [hours, minutes] = time.split(":").map(Number);
			const totalMinutes = hours * 60 + minutes + offset;
			const newHours = Math.floor(totalMinutes / 60) % 24;
			const newMinutes = totalMinutes % 60;

			return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
		};

		return {
			fajr: applyOffset(timings.Fajr, settings.fajrOffset),
			sunrise: timings.Sunrise,
			dhuhr: applyOffset(timings.Dhuhr, settings.dhuhrOffset),
			asr: applyOffset(timings.Asr, settings.asrOffset),
			maghrib: applyOffset(timings.Maghrib, settings.maghribOffset),
			isha: applyOffset(timings.Isha, settings.ishaOffset),
			date: dateStr,
			hijri: `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year}`,
		};
	} catch (error) {
		console.error("Error fetching prayer times:", error);

		// Fallback prayer times for Makkah
		return {
			fajr: "05:30",
			sunrise: "06:45",
			dhuhr: "12:15",
			asr: "15:30",
			maghrib: "18:00",
			isha: "19:30",
			date: new Date().toISOString().split("T")[0],
			hijri: "Loading...",
		};
	}
}

export function getNextPrayer(prayerTimes: PrayerTimes): {
	name: string;
	time: string;
	timeUntil: number;
} {
	const now = new Date();
	const currentTime = now.getHours() * 60 + now.getMinutes();

	const prayers = [
		{ name: "Fajr", time: prayerTimes.fajr },
		{ name: "Sunrise", time: prayerTimes.sunrise },
		{ name: "Dhuhr", time: prayerTimes.dhuhr },
		{ name: "Asr", time: prayerTimes.asr },
		{ name: "Maghrib", time: prayerTimes.maghrib },
		{ name: "Isha", time: prayerTimes.isha },
	];

	for (const prayer of prayers) {
		const [hours, minutes] = prayer.time.split(":").map(Number);
		const prayerTime = hours * 60 + minutes;

		if (prayerTime > currentTime) {
			return {
				name: prayer.name,
				time: prayer.time,
				timeUntil: prayerTime - currentTime,
			};
		}
	}

	// If no prayer found today, return Fajr of next day
	const [hours, minutes] = prayers[0].time.split(":").map(Number);
	const fajrTime = hours * 60 + minutes;
	const timeUntilNextFajr = 24 * 60 - currentTime + fajrTime;

	return {
		name: prayers[0].name,
		time: prayers[0].time,
		timeUntil: timeUntilNextFajr,
	};
}

export function formatTimeUntil(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hours > 0) {
		return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
	}
	return `00:${mins.toString().padStart(2, "0")}:00`;
}
