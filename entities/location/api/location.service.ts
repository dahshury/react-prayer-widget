import type { Location } from "../model/location";

const DEFAULT_LOCATION: Location = {
	latitude: 21.3891,
	longitude: 39.8579,
	city: "Makkah Al-Mukarramah",
	country: "Saudi Arabia",
};

// Constants for geolocation service
const GEOLOCATION_TIMEOUT_MS = 15_000;
const REVERSE_GEOCODE_TIMEOUT_MS = 8000;
const LOCATION_MAX_AGE_MS = 300_000;

// Helper function: IP-based fallback geolocation
async function getLocationFromIP(language: "en" | "ar"): Promise<Location> {
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
		// IP-based geolocation failed, fallback to default location
	}
	return DEFAULT_LOCATION;
}

// Helper function: Reverse geocode coordinates
async function reverseGeocodeCoordinates(
	latitude: number,
	longitude: number,
	language: "en" | "ar"
): Promise<Location> {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(
			() => controller.abort(),
			REVERSE_GEOCODE_TIMEOUT_MS
		);

		const response = await fetch(
			`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}`,
			{ signal: controller.signal }
		);

		clearTimeout(timeoutId);
		const data = await response.json();

		return {
			latitude,
			longitude,
			city:
				data.city ||
				data.locality ||
				data.principalSubdivision ||
				(language === "ar" ? "غير معروف" : "Unknown"),
			country:
				data.countryName || (language === "ar" ? "غير معروف" : "Unknown"),
			countryCode: data.countryCode || undefined,
		};
	} catch {
		// Reverse geocoding failed, return generic detected location
		return {
			latitude,
			longitude,
			city: language === "ar" ? "موقع مكتشف" : "Detected Location",
			country: language === "ar" ? "غير معروف" : "Unknown",
			countryCode: undefined,
		};
	}
}

// Helper function: Handle geolocation success
async function handleGeolocationSuccess(
	position: GeolocationPosition,
	language: "en" | "ar",
	opts?: { strict?: boolean }
): Promise<Location> {
	const { latitude, longitude } = position.coords;
	const location = await reverseGeocodeCoordinates(
		latitude,
		longitude,
		language
	);

	// If strict mode and geocoding resulted in generic location, reject
	if (opts?.strict && location.city === "Detected Location") {
		throw new Error("reverse_geocode_failed");
	}

	return location;
}

// Helper function: Handle geolocation error
function handleGeolocationError(
	error: GeolocationPositionError,
	language: "en" | "ar",
	opts?: { strict?: boolean }
): Promise<Location> {
	if (opts?.strict) {
		return Promise.reject(new Error(`geolocation_failed_${error.code}`));
	}

	// Try IP-based fallback
	return getLocationFromIP(language);
}

/**
 * Geolocation service for detecting user's current location.
 * Uses browser geolocation API with reverse geocoding fallback,
 * and IP-based geolocation as final fallback.
 */
export const LocationService = {
	/**
	 * Get current location using multiple strategies:
	 * 1. Browser Geolocation API (if available and permitted)
	 * 2. IP-based geolocation fallback
	 * 3. Default location (Makkah)
	 */
	getCurrentLocation(
		language: "en" | "ar" = "en",
		opts?: { strict?: boolean }
	): Promise<Location> {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				if (opts?.strict) {
					reject(new Error("geolocation_unavailable"));
				} else {
					getLocationFromIP(language)
						.then(resolve)
						.catch(() => {
							resolve(DEFAULT_LOCATION);
						});
				}
				return;
			}

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					try {
						const location = await handleGeolocationSuccess(
							position,
							language,
							opts
						);
						resolve(location);
					} catch (error) {
						if (opts?.strict) {
							reject(error);
						} else {
							// Try IP fallback
							getLocationFromIP(language)
								.then(resolve)
								.catch(() => {
									resolve(DEFAULT_LOCATION);
								});
						}
					}
				},
				async (error) => {
					try {
						const location = await handleGeolocationError(
							error,
							language,
							opts
						);
						resolve(location);
					} catch (err) {
						if (opts?.strict) {
							reject(err);
						} else {
							resolve(DEFAULT_LOCATION);
						}
					}
				},
				{
					timeout: GEOLOCATION_TIMEOUT_MS,
					enableHighAccuracy: true,
					maximumAge: LOCATION_MAX_AGE_MS,
				}
			);
		});
	},
};
