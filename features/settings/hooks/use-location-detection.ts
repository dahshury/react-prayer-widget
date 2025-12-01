import countryRegionDataJson from "country-region-data/dist/data-umd";
import { LocationService } from "@/entities/location/api";
import {
	getCountryCodeFromTimezone,
	getCountryPrimaryTimezone,
	guessTimezoneFromCountryCode,
} from "@/shared/libs/timezone/timezones";
import type { AllSettings } from "@/types/settings";
import type {
	CRCountry,
	CRRegion,
	NavigatorWithPermissions,
} from "../model/types";

type LocationDetectionResult = {
	autoDetectTimezone: boolean;
	timezone?: string;
	countryCode?: string;
	city?: string;
	cityCode?: string;
	locationError?: string;
};

export function useLocationDetection() {
	const applyMakkahFallback = (): LocationDetectionResult => {
		let makkahCode: string | undefined;
		try {
			const sa = (countryRegionDataJson as CRCountry[]).find(
				(c) => c.countryShortCode === "SA"
			);
			const match = sa?.regions?.find(
				(r: CRRegion) =>
					typeof r?.name === "string" && r.name.toLowerCase().includes("makkah")
			);
			makkahCode = match?.shortCode;
		} catch {
			// ignore
		}
		return {
			autoDetectTimezone: false,
			timezone: "Asia/Mecca",
			countryCode: "SA",
			city: "Makkah Al-Mukarramah",
			cityCode: makkahCode,
			locationError: "geolocation_failed",
		};
	};

	// Helper to check if geolocation permission is denied
	const isGeolocationDenied = async (): Promise<boolean> => {
		if (typeof navigator === "undefined" || !("permissions" in navigator)) {
			return false;
		}
		try {
			const perms = (navigator as NavigatorWithPermissions).permissions;
			if (perms && typeof perms.query === "function") {
				const status = await perms.query({
					name: "geolocation" as PermissionName,
				});
				return status.state === "denied";
			}
		} catch {
			// Ignore permission check errors
		}
		return false;
	};

	// Helper to resolve city code and name
	const resolveCityInfo = (detected: {
		countryCode?: string;
		city?: string;
	}): { cityName?: string; cityCode?: string } => {
		if (!(detected.countryCode && detected.city)) {
			return { cityName: detected.city };
		}
		const match = matchCityToRegion(detected.countryCode, detected.city);
		if (match) {
			return { cityName: match.name, cityCode: match.code };
		}
		return { cityName: detected.city };
	};

	const matchCityToRegion = (
		countryCode: string,
		cityName: string
	): { code: string; name: string } | null => {
		try {
			const country = (countryRegionDataJson as CRCountry[]).find(
				(c) => c.countryShortCode === countryCode
			);

			if (country?.regions) {
				const lowerCity = cityName.toLowerCase();
				// Try exact match first
				let matchedRegion = country.regions.find(
					(r: CRRegion) => r.name.toLowerCase() === lowerCity
				);

				// If no exact match, try partial match
				if (!matchedRegion) {
					matchedRegion = country.regions.find(
						(r: CRRegion) =>
							r.name.toLowerCase().includes(lowerCity) ||
							lowerCity.includes(r.name.toLowerCase())
					);
				}

				if (matchedRegion) {
					return {
						code: matchedRegion.shortCode,
						name: matchedRegion.name,
					};
				}
			}
		} catch (_e) {
			// Ignore errors when matching city to region
		}
		return null;
	};

	const detectLocation = async (
		language: string
	): Promise<LocationDetectionResult> => {
		try {
			// Check if geolocation is denied
			const isDenied = await isGeolocationDenied();
			if (isDenied) {
				return applyMakkahFallback();
			}

			// Get current location
			const detected = await LocationService.getCurrentLocation(
				(language as "en" | "ar") || "en",
				{ strict: false }
			);

			const sysTz =
				Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Mecca";

			// Resolve city info
			const { cityName, cityCode } = resolveCityInfo(detected);

			return {
				autoDetectTimezone: true,
				timezone: sysTz,
				countryCode: detected.countryCode || undefined,
				city: cityName || detected.city || undefined,
				cityCode,
				locationError: undefined,
			};
		} catch (_e) {
			return applyMakkahFallback();
		}
	};

	const getCountryCodeFromSettings = (
		settings: AllSettings
	): string | undefined => {
		if (settings.countryCode) {
			return settings.countryCode;
		}
		const tz = settings.timezone;
		if (!tz) {
			return;
		}
		return getCountryCodeFromTimezone(tz);
	};

	const getTimezoneForCountry = (countryCode: string): string =>
		getCountryPrimaryTimezone(countryCode) ||
		guessTimezoneFromCountryCode(countryCode) ||
		"Asia/Mecca";

	return {
		detectLocation,
		applyMakkahFallback,
		matchCityToRegion,
		getCountryCodeFromSettings,
		getTimezoneForCountry,
	};
}
