export type PrayerTimesRequestBody = {
	countryCode?: string;
	timezone?: string;
	date?: string; // YYYY-MM-DD
	city?: string;
	offsets?: {
		fajr?: number;
		sunrise?: number;
		dhuhr?: number;
		asr?: number;
		maghrib?: number;
		isha?: number;
	};
	applySummerHour?: boolean;
	forceHourMore?: boolean;
	forceHourLess?: boolean;
};
