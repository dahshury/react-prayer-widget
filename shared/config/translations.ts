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
		showStandaloneTicker?: string;
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
		// Layout & Sizing
		layoutSizing?: string;
		centerCardSize?: string;
		otherCardsSize?: string;
		appWidth?: string;
		// Size options
		sizeXxs?: string;
		sizeXs?: string;
		sizeSm?: string;
		sizeMd?: string;
		sizeLg?: string;
		// App width options
		appWidthXxs?: string;
		appWidthXs?: string;
		appWidthMd?: string;
		appWidthLg?: string;
		appWidthXl?: string;
		appWidth2xl?: string;
		appWidth3xl?: string;
		// Prayer Cards section
		prayerCards?: string;
		viewType?: string;
		viewStacked?: string;
		viewHorizontal?: string;
		enableShowOtherPrayersHint?: string;
		// Visibility section
		visibility?: string;
		// Ticker section
		ticker?: string;
		enableShowTickerHint?: string;
		tickerInterval3?: string;
		tickerInterval5?: string;
		tickerInterval8?: string;
		tickerInterval10?: string;
		// Fonts section
		fonts?: string;
		prayerFont?: string;
		timeFont?: string;
		selectFont?: string;
		searchFonts?: string;
		noFontFound?: string;
		// Backgrounds section
		cardBackgrounds?: string;
		cardBackground?: string;
		cardBackgroundOpacity?: string;
		chooseFromImageBackgrounds?: string;
		selectBackground?: string;
		searchBackgrounds?: string;
		noBackgroundFound?: string;
		// Colors section
		colors?: string;
		prayerName?: string;
		prayerTime?: string;
		countdown?: string;
		// Calculation method names
		calculationMethodNames?: Record<string, string>;
		// ASR methods
		asrMethods?: Record<string, string>;
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
			showStandaloneTicker: "Show Standalone Ticker",
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
			// Layout & Sizing
			layoutSizing: "Layout & Sizing",
			centerCardSize: "Center card height",
			otherCardsSize: "Other cards height",
			appWidth: "App width",
			// Size options
			sizeXxs: "XXS (thinnest)",
			sizeXs: "XS",
			sizeSm: "SM",
			sizeMd: "MD",
			sizeLg: "LG",
			// App width options
			appWidthXxs: "Ultra compact (xxs)",
			appWidthXs: "Extra compact (xs)",
			appWidthMd: "Narrow (md)",
			appWidthLg: "Compact (lg)",
			appWidthXl: "Comfort (xl)",
			appWidth2xl: "Wide (2xl)",
			appWidth3xl: "Extra wide (3xl)",
			// Prayer Cards section
			prayerCards: "Prayer Cards",
			viewType: "View type",
			viewStacked: "Stacked",
			viewHorizontal: "Horizontal",
			enableShowOtherPrayersHint:
				"Enable 'Show other prayers' to use this setting",
			// Visibility section
			visibility: "Visibility",
			// Ticker section
			ticker: "Ticker",
			enableShowTickerHint: "Enable 'Show ticker' to use this setting",
			tickerInterval3: "3 seconds",
			tickerInterval5: "5 seconds",
			tickerInterval8: "8 seconds",
			tickerInterval10: "10 seconds",
			// Fonts section
			fonts: "Fonts",
			prayerFont: "Prayer name font",
			timeFont: "Prayer time font",
			selectFont: "Select font...",
			searchFonts: "Search fonts...",
			noFontFound: "No font found.",
			// Backgrounds section
			cardBackgrounds: "Card Backgrounds",
			cardBackground: "Card background",
			cardBackgroundOpacity: "Background opacity",
			chooseFromImageBackgrounds: "Choose from image backgrounds",
			selectBackground: "Select background...",
			searchBackgrounds: "Search backgrounds...",
			noBackgroundFound: "No background found.",
			// Colors section
			colors: "Colors",
			prayerName: "Prayer name",
			prayerTime: "Prayer time",
			countdown: "Countdown",
			// Calculation method names
			calculationMethodNames: {
				"1": "University of Islamic Sciences, Karachi",
				"2": "Islamic Society of North America (ISNA)",
				"3": "Muslim World League",
				"4": "Umm Al-Qura University, Makkah",
				"5": "Egyptian General Authority of Survey",
				"7": "Institute of Geophysics, University of Tehran",
				"8": "Gulf Region",
				"9": "Kuwait",
				"10": "Qatar",
				"11": "Majlis Ugama Islam Singapura, Singapore",
				"12": "Union Organization islamic de France",
				"13": "Diyanet İşleri Başkanlığı, Turkey",
			},
			// ASR methods
			asrMethods: {
				standard: "Standard (Shafi, Maliki, Hanbali)",
				hanafi: "Hanafi",
			},
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
			showStandaloneTicker: "إظهار الشريط المتحرك المستقل",
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
			// Layout & Sizing
			layoutSizing: "التخطيط والحجم",
			centerCardSize: "ارتفاع البطاقة المركزية",
			otherCardsSize: "ارتفاع البطاقات الأخرى",
			appWidth: "عرض التطبيق",
			// Size options
			sizeXxs: "صغير جدًا جدًا (أرفع)",
			sizeXs: "صغير جدًا",
			sizeSm: "صغير",
			sizeMd: "متوسط",
			sizeLg: "كبير",
			// App width options
			appWidthXxs: "مضغوط جدًا (xxs)",
			appWidthXs: "مضغوط للغاية (xs)",
			appWidthMd: "ضيق (md)",
			appWidthLg: "مضغوط (lg)",
			appWidthXl: "مريح (xl)",
			appWidth2xl: "واسع (2xl)",
			appWidth3xl: "واسع جدًا (3xl)",
			// Prayer Cards section
			prayerCards: "بطاقات الصلاة",
			viewType: "نوع العرض",
			viewStacked: "مكدسة",
			viewHorizontal: "أفقي",
			enableShowOtherPrayersHint:
				"فعّل 'إظهار الصلوات الأخرى' لاستخدام هذا الإعداد",
			// Visibility section
			visibility: "الرؤية",
			// Ticker section
			ticker: "الشريط المتحرك",
			enableShowTickerHint: "فعّل 'إظهار الشريط المتحرك' لاستخدام هذا الإعداد",
			tickerInterval3: "3 ثوانٍ",
			tickerInterval5: "5 ثوانٍ",
			tickerInterval8: "8 ثوانٍ",
			tickerInterval10: "10 ثوانٍ",
			// Fonts section
			fonts: "الخطوط",
			prayerFont: "خط اسم الصلاة",
			timeFont: "خط وقت الصلاة",
			selectFont: "اختر الخط...",
			searchFonts: "ابحث عن الخطوط...",
			noFontFound: "لم يتم العثور على خط.",
			// Backgrounds section
			cardBackgrounds: "خلفيات البطاقات",
			cardBackground: "خلفية البطاقة",
			cardBackgroundOpacity: "شفافية الخلفية",
			chooseFromImageBackgrounds: "اختر من خلفيات الصور",
			selectBackground: "اختر الخلفية...",
			searchBackgrounds: "ابحث عن الخلفيات...",
			noBackgroundFound: "لم يتم العثور على خلفية.",
			// Colors section
			colors: "الألوان",
			prayerName: "اسم الصلاة",
			prayerTime: "وقت الصلاة",
			countdown: "العد التنازلي",
			// Calculation method names
			calculationMethodNames: {
				"1": "جامعة العلوم الإسلامية، كراتشي",
				"2": "الجمعية الإسلامية لأمريكا الشمالية (ISNA)",
				"3": "رابطة العالم الإسلامي",
				"4": "جامعة أم القرى، مكة المكرمة",
				"5": "الهيئة المصرية العامة للمساحة",
				"7": "معهد الجيوفيزياء، جامعة طهران",
				"8": "منطقة الخليج",
				"9": "الكويت",
				"10": "قطر",
				"11": "مجلس أوغاما إسلام سنغافورة",
				"12": "الاتحاد الإسلامي لفرنسا",
				"13": "رئاسة الشؤون الدينية، تركيا",
			},
			// ASR methods
			asrMethods: {
				standard: "قياسي (شافعي، مالكي، حنبلي)",
				hanafi: "حنفي",
			},
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
