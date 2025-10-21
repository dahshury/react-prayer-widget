const CALCULATION_METHODS = [
	{ value: 1, tKey: "1", fallback: "University of Islamic Sciences, Karachi" },
	{ value: 2, tKey: "2", fallback: "Islamic Society of North America (ISNA)" },
	{ value: 3, tKey: "3", fallback: "Muslim World League" },
	{ value: 4, tKey: "4", fallback: "Umm Al-Qura University, Makkah" },
	{ value: 5, tKey: "5", fallback: "Egyptian General Authority of Survey" },
	{
		value: 7,
		tKey: "7",
		fallback: "Institute of Geophysics, University of Tehran",
	},
	{ value: 8, tKey: "8", fallback: "Gulf Region" },
	{ value: 9, tKey: "9", fallback: "Kuwait" },
	{ value: 10, tKey: "10", fallback: "Qatar" },
	{
		value: 11,
		tKey: "11",
		fallback: "Majlis Ugama Islam Singapura, Singapore",
	},
	{ value: 12, tKey: "12", fallback: "Union Organization islamic de France" },
	{ value: 13, tKey: "13", fallback: "Diyanet İşleri Başkanlığı, Turkey" },
] as const;

const ASR_METHODS = [
	{ value: 0, tKey: "standard", fallback: "Standard (Shafi, Maliki, Hanbali)" },
	{ value: 1, tKey: "hanafi", fallback: "Hanafi" },
] as const;

export { CALCULATION_METHODS, ASR_METHODS };
