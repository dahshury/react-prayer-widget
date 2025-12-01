export type Language = "en" | "ar";

export type Translations = {
	settings: {
		title: string;
		locationTimezone: string;
		displayOptions: string;
		horizontalPrayerList: string;
		verticalFirst?: string;
		general: string;
		calculation: string;
		azan: string;
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
	azan?: {
		enable: string;
		volume: string;
		volumeLowWarning: string;
		volumeZeroWarning: string;
		type: string;
		customOverride: string;
		perPrayer: string;
		full: string;
		short: string;
		beepOnly: string;
		customFile: string;
		selected: string;
		preview: string;
	};
	uploader?: {
		dragOr: string;
		browse: string;
		dropHere: string;
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
		jumuah: string;
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
			displayOptions: "Display",
			horizontalPrayerList: "Vertical first",
			verticalFirst: "Vertical first",
			general: "General",
			calculation: "Calculation",
			azan: "Azan",
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
				"Location permission denied. Auto-detect is off. Defaulting to Makkah Al-Mukarramah, Saudi Arabia.",
			tickerSpeed: "Ticker change interval",
		},
		azan: {
			enable: "Enable Azan",
			volume: "Volume",
			volumeLowWarning: "Volume might be too low to hear",
			volumeZeroWarning: "Volume is muted. Azan will not play",
			type: "Azan type",
			customOverride: "Custom (overrides all)",
			perPrayer: "Per‑prayer",
			full: "Full",
			short: "Short",
			beepOnly: "Beep only",
			customFile: "Custom file",
			selected: "Selected:",
			preview: "Preview azan",
		},
		uploader: {
			dragOr: "Drag a file here or",
			browse: "browse",
			dropHere: "Drop file here",
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
			jumuah: "Jumuʿah",
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
			displayOptions: "العرض",
			horizontalPrayerList: "العرض العمودي أولًا",
			verticalFirst: "العرض العمودي أولًا",
			general: "عام",
			calculation: "الحساب",
			azan: "الأذان",
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
				"تم رفض إذن الموقع. الاكتشاف التلقائي غير مُفعل. سيتم الافتراضي إلى مكة المكرمة، السعودية.",
			tickerSpeed: "مدة تبديل الشريط",
		},
		azan: {
			enable: "تفعيل الأذان",
			volume: "مستوى الصوت",
			volumeLowWarning: "مستوى الصوت قد يكون منخفضًا جدًا لسماعه",
			volumeZeroWarning: "الصوت معطل. لن يتم تشغيل الأذان",
			type: "نوع الأذان",
			customOverride: "مخصص (يستبدل الكل)",
			perPrayer: "لكل صلاة",
			full: "كامل",
			short: "قصير",
			beepOnly: "تنبيه فقط",
			customFile: "ملف مخصص",
			selected: "المحدد:",
			preview: "معاينة الأذان",
		},
		uploader: {
			dragOr: "اسحب ملفًا هنا أو",
			browse: "تصفح",
			dropHere: "أفلت الملف هنا",
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
			jumuah: "الجمعة",
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
