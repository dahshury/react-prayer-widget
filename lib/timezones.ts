export type TimezoneOption = {
	value: string;
	label: string;
	labelAr: string;
	country: string;
};

// Type assertion helper for countries-and-timezones library

export const TIMEZONES: TimezoneOption[] = [
	{
		value: "Asia/Riyadh",
		label: "Riyadh, Saudi Arabia",
		labelAr: "الرياض، المملكة العربية السعودية",
		country: "Saudi Arabia",
	},
	{
		value: "Asia/Mecca",
		label: "Makkah, Saudi Arabia",
		labelAr: "مكة، المملكة العربية السعودية",
		country: "Saudi Arabia",
	},
	{
		value: "Asia/Dubai",
		label: "Dubai, UAE",
		labelAr: "دبي، الإمارات العربية المتحدة",
		country: "UAE",
	},
	{
		value: "Asia/Kuwait",
		label: "Kuwait City, Kuwait",
		labelAr: "مدينة الكويت، الكويت",
		country: "Kuwait",
	},
	{
		value: "Asia/Qatar",
		label: "Doha, Qatar",
		labelAr: "الدوحة، قطر",
		country: "Qatar",
	},
	{
		value: "Asia/Bahrain",
		label: "Manama, Bahrain",
		labelAr: "المنامة، البحرين",
		country: "Bahrain",
	},
	{
		value: "Asia/Muscat",
		label: "Muscat, Oman",
		labelAr: "مسقط، عُمان",
		country: "Oman",
	},
	{
		value: "Asia/Baghdad",
		label: "Baghdad, Iraq",
		labelAr: "بغداد، العراق",
		country: "Iraq",
	},
	{
		value: "Asia/Damascus",
		label: "Damascus, Syria",
		labelAr: "دمشق، سوريا",
		country: "Syria",
	},
	{
		value: "Asia/Beirut",
		label: "Beirut, Lebanon",
		labelAr: "بيروت، لبنان",
		country: "Lebanon",
	},
	{
		value: "Asia/Amman",
		label: "Amman, Jordan",
		labelAr: "عمّان، الأردن",
		country: "Jordan",
	},
	{
		value: "Asia/Jerusalem",
		label: "Jerusalem, Palestine",
		labelAr: "القدس، فلسطين",
		country: "Palestine",
	},
	{
		value: "Africa/Cairo",
		label: "Cairo, Egypt",
		labelAr: "القاهرة، مصر",
		country: "Egypt",
	},
	{
		value: "Africa/Casablanca",
		label: "Casablanca, Morocco",
		labelAr: "الدار البيضاء، المغرب",
		country: "Morocco",
	},
	{
		value: "Africa/Tunis",
		label: "Tunis, Tunisia",
		labelAr: "تونس، تونس",
		country: "Tunisia",
	},
	{
		value: "Africa/Algiers",
		label: "Algiers, Algeria",
		labelAr: "الجزائر، الجزائر",
		country: "Algeria",
	},
	{
		value: "Europe/Istanbul",
		label: "Istanbul, Turkey",
		labelAr: "إسطنبول، تركيا",
		country: "Turkey",
	},
	{
		value: "Asia/Karachi",
		label: "Karachi, Pakistan",
		labelAr: "كراتشي، باكستان",
		country: "Pakistan",
	},
	{
		value: "Asia/Dhaka",
		label: "Dhaka, Bangladesh",
		labelAr: "دكا، بنغلاديش",
		country: "Bangladesh",
	},
	{
		value: "Asia/Jakarta",
		label: "Jakarta, Indonesia",
		labelAr: "جاكرتا، إندونيسيا",
		country: "Indonesia",
	},
	{
		value: "Asia/Kuala_Lumpur",
		label: "Kuala Lumpur, Malaysia",
		labelAr: "كوالالمبور، ماليزيا",
		country: "Malaysia",
	},
	{
		value: "Europe/London",
		label: "London, UK",
		labelAr: "لندن، المملكة المتحدة",
		country: "United Kingdom",
	},
	{
		value: "America/New_York",
		label: "New York, USA",
		labelAr: "نيويورك، الولايات المتحدة",
		country: "United States",
	},
	{
		value: "America/Los_Angeles",
		label: "Los Angeles, USA",
		labelAr: "لوس أنجلوس، الولايات المتحدة",
		country: "United States",
	},
	{
		value: "America/Toronto",
		label: "Toronto, Canada",
		labelAr: "تورونتو، كندا",
		country: "Canada",
	},
	{
		value: "Australia/Sydney",
		label: "Sydney, Australia",
		labelAr: "سيدني، أستراليا",
		country: "Australia",
	},
];

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
	"Saudi Arabia": "SA",
	UAE: "AE",
	"United Arab Emirates": "AE",
	Kuwait: "KW",
	Qatar: "QA",
	Bahrain: "BH",
	Oman: "OM",
	Iraq: "IQ",
	Syria: "SY",
	Lebanon: "LB",
	Jordan: "JO",
	Palestine: "PS",
	Egypt: "EG",
	Morocco: "MA",
	Tunisia: "TN",
	Algeria: "DZ",
	Turkey: "TR",
	Pakistan: "PK",
	Bangladesh: "BD",
	Indonesia: "ID",
	Malaysia: "MY",
	"United Kingdom": "GB",
	USA: "US",
	"United States": "US",
	Canada: "CA",
	Australia: "AU",
};

export function countryNameToCode(country: string): string | undefined {
	return COUNTRY_NAME_TO_CODE[country];
}

export function countryCodeToFlagEmoji(code: string): string {
	if (!code || code.length !== 2) return "";
	const base = 127397; // 0x1F1E6 - 'A'
	const chars = code.toUpperCase().split("");
	return String.fromCodePoint(
		base + chars[0].charCodeAt(0),
		base + chars[1].charCodeAt(0),
	);
}

export function getCountryByTimezone(value: string): string | undefined {
	const tz = TIMEZONES.find((t) => t.value === value);
	return tz?.country;
}

export function getTimezoneFlag(value: string): string {
	const country = getCountryByTimezone(value);
	const code = country ? countryNameToCode(country) : undefined;
	return code ? countryCodeToFlagEmoji(code) : "";
}

export function getLocationFromTimezone(timezone: string) {
	const tz = TIMEZONES.find((t) => t.value === timezone);
	return tz ? tz.label : timezone;
}

export function getLocationFromTimezoneLocalized(
	timezone: string,
	language: "en" | "ar",
) {
	const tz = TIMEZONES.find((t) => t.value === timezone);
	if (!tz) return timezone;
	return language === "ar" ? tz.labelAr : tz.label;
}

export function getTimezoneLabelByLang(value: string, language: "en" | "ar") {
	const tz = TIMEZONES.find((t) => t.value === value);
	if (!tz) return value;
	return language === "ar" ? tz.labelAr : tz.label;
}

// Country to a reasonable default timezone mapping (alpha2 upper-case)
export const COUNTRY_TO_TZ_DEFAULT: Record<string, string> = {
	SA: "Asia/Mecca",
	AE: "Asia/Dubai",
	KW: "Asia/Kuwait",
	QA: "Asia/Qatar",
	BH: "Asia/Bahrain",
	OM: "Asia/Muscat",
	IQ: "Asia/Baghdad",
	SY: "Asia/Damascus",
	LB: "Asia/Beirut",
	JO: "Asia/Amman",
	PS: "Asia/Jerusalem",
	EG: "Africa/Cairo",
	MA: "Africa/Casablanca",
	TN: "Africa/Tunis",
	DZ: "Africa/Algiers",
	TR: "Europe/Istanbul",
	PK: "Asia/Karachi",
	BD: "Asia/Dhaka",
	ID: "Asia/Jakarta",
	MY: "Asia/Kuala_Lumpur",
	GB: "Europe/London",
	US: "America/New_York",
	CA: "America/Toronto",
	AU: "Australia/Sydney",
};

export function guessTimezoneFromCountryCode(
	alpha2: string,
): string | undefined {
	return COUNTRY_TO_TZ_DEFAULT[alpha2.toUpperCase()];
}

// Accurate offsets per country using countries-and-timezones
import * as catz from "countries-and-timezones";

export function getCountryPrimaryTimezone(alpha2: string): string | undefined {
	const cc = alpha2.toUpperCase();
	// Prefer timezone with highest population from library
	const tzInfos = catz.getTimezonesForCountry(cc);
	if (tzInfos && tzInfos.length > 0) {
		const sorted = [...tzInfos].sort((a, b) => {
			const aPop = (a as unknown as { population?: number }).population || 0;
			const bPop = (b as unknown as { population?: number }).population || 0;
			return bPop - aPop;
		});
		return sorted[0]?.name;
	}
	// Fallback to our default mapping
	return guessTimezoneFromCountryCode(cc);
}

export function getCountryUtcOffsetLabel(alpha2: string): string {
	const tzName = getCountryPrimaryTimezone(alpha2);
	if (!tzName) return "GMT+0";
	const tzInfo = catz.getTimezone(tzName);
	if (!tzInfo || typeof tzInfo.utcOffset !== "number") return "GMT+0";
	const offset = tzInfo.utcOffset; // minutes
	if (offset === 0) return "GMT+0";
	const sign = offset >= 0 ? "+" : "-";
	const abs = Math.abs(offset);
	const hours = Math.floor(abs / 60);
	const mins = abs % 60;
	if (mins === 0) {
		return `GMT${sign}${hours}`;
	}
	return `GMT${sign}${hours}:${String(mins).padStart(2, "0")}`;
}

// Given a timezone name, return the primary ISO alpha-2 country code
export function getCountryCodeFromTimezone(
	timezone: string,
): string | undefined {
	try {
		const info = catz.getTimezone(timezone);
		if (!info) return undefined;
		// countries-and-timezones exposes `countries: string[]` for a timezone
		const countries = (info as unknown as { countries?: string[] }).countries;
		if (Array.isArray(countries) && countries.length > 0) {
			return countries[0]?.toUpperCase();
		}
	} catch {
		// ignore
	}
	return undefined;
}
