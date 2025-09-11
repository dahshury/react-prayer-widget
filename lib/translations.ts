export type Language = "en" | "ar";

export type Translations = {
	settings: {
		title: string;
		locationTimezone: string;
		displayOptions: string;
		horizontalPrayerList: string;
		showOtherPrayers: string;
		showCity: string;
		showTicker: string;
		showClock?: string;
		showDate: string;
		calculationMethod: string;
		asrCalculation: string;
		timeAdjustments: string;
		timeAdjustmentsHelp: string;
		done: string;
		timeFormat24h: string;
		dimPreviousPrayers: string;
		language: string;
		autoDetectTimezone?: string;
		locationPermissionDenied?: string;
		tickerSpeed?: string;
	};
	general: {
		remaining: string;
		loading: string;
		remainingTillAzan?: string;
	};
	prayers: {
		fajr: string;
		sunrise: string;
		dhuhr: string;
		asr: string;
		maghrib: string;
		isha: string;
	};
	dates: {
		hijriMonths: string[];
	};
};

export const translations: Record<Language, Translations> = {
	en: {
		settings: {
			title: "Prayer Settings",
			locationTimezone: "Location & Timezone",
			displayOptions: "Display Options",
			horizontalPrayerList: "Horizontal Prayer List",
			showOtherPrayers: "Show Other Prayer Cards",
			showCity: "Show Current City",
			showTicker: "Show Ticker",
			showClock: "Show Clock",
			showDate: "Show Date",
			calculationMethod: "Calculation Method",
			asrCalculation: "Asr Calculation",
			timeAdjustments: "Time Adjustments (minutes)",
			timeAdjustmentsHelp:
				"Adjust prayer times by ±30 minutes to match your local mosque or preference",
			done: "Done",
			timeFormat24h: "24-hour Time",
			dimPreviousPrayers: "Dim Previous Prayers",
			language: "Language",
			autoDetectTimezone: "Auto-detect timezone",
			locationPermissionDenied:
				"Location permission denied. Auto-detect disabled.",
			tickerSpeed: "Ticker change interval",
		},
		general: {
			remaining: "remaining",
			loading: "Loading...",
			remainingTillAzan: "remaining time till azan",
		},
		prayers: {
			fajr: "Fajr",
			sunrise: "Sunrise",
			dhuhr: "Dhuhr",
			asr: "Asr",
			maghrib: "Maghrib",
			isha: "Isha",
		},
		dates: {
			hijriMonths: [
				"Muharram",
				"Safar",
				"Rabi' al-Awwal",
				"Rabi' al-Thani",
				"Jumada al-Awwal",
				"Jumada al-Thani",
				"Rajab",
				"Sha'ban",
				"Ramadan",
				"Shawwal",
				"Dhu al-Qi'dah",
				"Dhu al-Hijjah",
			],
		},
	},
	ar: {
		settings: {
			title: "إعدادات الصلاة",
			locationTimezone: "الموقع والمنطقة الزمنية",
			displayOptions: "خيارات العرض",
			horizontalPrayerList: "قائمة الصلوات الأفقية",
			showOtherPrayers: "إظهار بطاقات الصلوات الأخرى",
			showCity: "إظهار المدينة الحالية",
			showTicker: "إظهار الشريط المتحرك",
			showClock: "إظهار الساعة",
			showDate: "إظهار التاريخ",
			calculationMethod: "طريقة الحساب",
			asrCalculation: "حساب العصر",
			timeAdjustments: "تعديل الأوقات (بالدقائق)",
			timeAdjustmentsHelp: "اضبط أوقات الصلاة ±30 دقيقة لتوافق مسجدك المحلي",
			done: "تم",
			timeFormat24h: "نظام 24 ساعة",
			dimPreviousPrayers: "تعتيم الصلوات السابقة",
			language: "اللغة",
			autoDetectTimezone: "اكتشاف المنطقة الزمنية تلقائيًا",
			locationPermissionDenied:
				"تم رفض إذن الموقع. تم إيقاف الاكتشاف التلقائي.",
			tickerSpeed: "مدة تبديل الشريط",
		},
		general: {
			remaining: "متبقي",
			loading: "جاري التحميل...",
			remainingTillAzan: "الوقت المتبقي حتى الأذان",
		},
		prayers: {
			fajr: "الفجر",
			sunrise: "الشروق",
			dhuhr: "الظهر",
			asr: "العصر",
			maghrib: "المغرب",
			isha: "العشاء",
		},
		dates: {
			hijriMonths: [
				"محرم",
				"صفر",
				"ربيع الأول",
				"ربيع الآخر",
				"جمادى الأولى",
				"جمادى الآخرة",
				"رجب",
				"شعبان",
				"رمضان",
				"شوال",
				"ذو القعدة",
				"ذو الحجة",
			],
		},
	},
};
