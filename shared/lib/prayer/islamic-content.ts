export type IslamicContent = {
	id: string;
	type: "hadith" | "ayah";
	arabic?: string;
	english: string;
	source: string;
};

export const DEFAULT_ISLAMIC_CONTENT: IslamicContent[] = [
	{
		id: "1",
		type: "hadith",
		english:
			'The Prophet (ﷺ) said: "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer. If it is sound, then the rest of his deeds will be sound. And if it is bad, then the rest of his deeds will be bad."',
		source: "At-Tabarani",
	},
	{
		id: "2",
		type: "ayah",
		arabic: "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ",
		english:
			"And establish prayer and give zakah and bow with those who bow [in worship and obedience].",
		source: "Quran 2:43",
	},
	{
		id: "3",
		type: "hadith",
		english:
			'The Prophet (ﷺ) said: "Between a man and disbelief and paganism is the abandonment of prayer."',
		source: "Sahih Muslim",
	},
	{
		id: "4",
		type: "ayah",
		arabic: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ",
		english: "Indeed, prayer prohibits immorality and wrongdoing.",
		source: "Quran 29:45",
	},
	{
		id: "5",
		type: "hadith",
		english:
			'The Prophet (ﷺ) said: "The key to Paradise is prayer, and the key to prayer is ablution."',
		source: "Ahmad",
	},
	{
		id: "6",
		type: "ayah",
		arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
		english: "And seek help through patience and prayer.",
		source: "Quran 2:45",
	},
	{
		id: "7",
		type: "hadith",
		english:
			'The Prophet (ﷺ) said: "Whoever maintains the prayers, Allah will make for him a light, a proof, and a salvation on the Day of Resurrection."',
		source: "Ahmad",
	},
	{
		id: "8",
		type: "ayah",
		arabic: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ",
		english:
			"Maintain with care the [obligatory] prayers and [in particular] the middle prayer.",
		source: "Quran 2:238",
	},
	{
		id: "9",
		type: "hadith",
		english:
			'The Prophet (ﷺ) said: "Prayer is the pillar of religion. Whoever establishes it has established religion, and whoever destroys it has destroyed religion."',
		source: "Al-Bayhaqi",
	},
	{
		id: "10",
		type: "ayah",
		arabic: "فَإِذَا قَضَيْتُمُ الصَّلَاةَ فَاذْكُرُوا اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِكُمْ",
		english:
			"And when you have completed the prayer, remember Allah standing, sitting, or [lying] on your sides.",
		source: "Quran 4:103",
	},
	// Imported from legacy @tawkit-9.61 (ahadith.js, ayats.js)
	{
		id: "100",
		type: "hadith",
		arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
		english: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
		source: "Hadith",
	},
	{
		id: "101",
		type: "hadith",
		arabic: "أحب عباد الله إلى الله أحسنهم خلقًا",
		english: "أحب عباد الله إلى الله أحسنهم خلقًا",
		source: "Hadith",
	},
	{
		id: "102",
		type: "hadith",
		arabic: "لَا يُؤْمِنُ أحَدُكُمْ، حتَّى يُحِبَّ لأخِيهِ ما يُحِبُّ لِنَفْسِهِ",
		english: "لَا يُؤْمِنُ أحَدُكُمْ، حتَّى يُحِبَّ لأخِيهِ ما يُحِبُّ لِنَفْسِهِ",
		source: "Hadith",
	},
	{
		id: "103",
		type: "hadith",
		arabic: "من صلى علي صلاة واحدة صلى الله عليه عشراً",
		english: "من صلى علي صلاة واحدة صلى الله عليه عشراً",
		source: "Hadith",
	},
	{
		id: "104",
		type: "hadith",
		arabic: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
		english: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى",
		source: "Hadith",
	},
	{
		id: "105",
		type: "hadith",
		arabic: "خيركم من تعلم القرآن وعلمه",
		english: "خيركم من تعلم القرآن وعلمه",
		source: "Hadith",
	},
	{
		id: "106",
		type: "hadith",
		arabic: "المؤمن للمؤمن كالبنيان يشد بعضه بعضاً",
		english: "المؤمن للمؤمن كالبنيان يشد بعضه بعضاً",
		source: "Hadith",
	},
	{
		id: "107",
		type: "hadith",
		arabic: "من كان في حاجة أخيه كان الله في حاجته",
		english: "من كان في حاجة أخيه كان الله في حاجته",
		source: "Hadith",
	},
	{
		id: "108",
		type: "hadith",
		arabic: "لا طاعة لمخلوق في معصية الخالق",
		english: "لا طاعة لمخلوق في معصية الخالق",
		source: "Hadith",
	},
	{
		id: "109",
		type: "hadith",
		arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
		english: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
		source: "Hadith",
	},
	{
		id: "110",
		type: "hadith",
		arabic: "من سلك طريقاً يلتمس فيه علماً سهَّل الله له به طريقاً إلى الجنة",
		english: "من سلك طريقاً يلتمس فيه علماً سهَّل الله له به طريقاً إلى الجنة",
		source: "Hadith",
	},
	{
		id: "111",
		type: "hadith",
		arabic: "الدنيا سجن المؤمن وجنة الكافر",
		english: "الدنيا سجن المؤمن وجنة الكافر",
		source: "Hadith",
	},
	{
		id: "112",
		type: "hadith",
		arabic: "إنَّ الصِّدْقَ يَهْدِي إلى البِرِّ، وإنَّ البِرَّ يَهْدِي إلى الجَنَّةِ",
		english: "إنَّ الصِّدْقَ يَهْدِي إلى البِرِّ، وإنَّ البِرَّ يَهْدِي إلى الجَنَّةِ",
		source: "Hadith",
	},
	{
		id: "113",
		type: "hadith",
		arabic:
			"إذا مات الإنسان انقطع عمله إلا من ثلاث: صدقة جارية، أو علم ينتفع به، أو ولد صالح يدعو له",
		english:
			"إذا مات الإنسان انقطع عمله إلا من ثلاث: صدقة جارية، أو علم ينتفع به، أو ولد صالح يدعو له",
		source: "Hadith",
	},
	{
		id: "200",
		type: "ayah",
		arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
		english: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
		source: "Quran",
	},
	{
		id: "201",
		type: "ayah",
		arabic: "إنَّ مَعَ العُسْرِ يُسْراً",
		english: "إنَّ مَعَ العُسْرِ يُسْراً",
		source: "Quran",
	},
	{
		id: "202",
		type: "ayah",
		arabic: "إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ",
		english: "إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ",
		source: "Quran",
	},
	{
		id: "203",
		type: "ayah",
		arabic: "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ",
		english: "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ",
		source: "Quran",
	},
	{
		id: "204",
		type: "ayah",
		arabic: "إِنَّ اللّهَ لاَ يُغَيِّرُ مَا بِقَوْمٍ حَتَّى يُغَيِّرُواْ مَا بِأَنْفُسِهِمْ",
		english: "إِنَّ اللّهَ لاَ يُغَيِّرُ مَا بِقَوْمٍ حَتَّى يُغَيِّرُواْ مَا بِأَنْفُسِهِمْ",
		source: "Quran",
	},
	{
		id: "205",
		type: "ayah",
		arabic: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ",
		english: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ",
		source: "Quran",
	},
	{
		id: "206",
		type: "ayah",
		arabic: "إِنْ يَنْصُرْكُمُ اللهُ فَلاَ غَالِبَ لَكُمْ",
		english: "إِنْ يَنْصُرْكُمُ اللهُ فَلاَ غَالِبَ لَكُمْ",
		source: "Quran",
	},
	{
		id: "207",
		type: "ayah",
		arabic: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَى",
		english: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَى",
		source: "Quran",
	},
	{
		id: "208",
		type: "ayah",
		arabic: "حَسْبِيَ اللّهُ لا إِلَـهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ",
		english: "حَسْبِيَ اللّهُ لا إِلَـهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ",
		source: "Quran",
	},
	{
		id: "209",
		type: "ayah",
		arabic: "رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي",
		english: "رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي",
		source: "Quran",
	},
	{
		id: "210",
		type: "ayah",
		arabic: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ",
		english: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ",
		source: "Quran",
	},
	{
		id: "211",
		type: "ayah",
		arabic: "سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ",
		english: "سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ",
		source: "Quran",
	},
	{
		id: "212",
		type: "ayah",
		arabic: "فَاصْبِرْ صَبْرًا جَمِيلًا",
		english: "فَاصْبِرْ صَبْرًا جَمِيلًا",
		source: "Quran",
	},
	{
		id: "213",
		type: "ayah",
		arabic: "قُلْ لَنْ يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا",
		english: "قُلْ لَنْ يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّـهُ لَنَا",
		source: "Quran",
	},
	{
		id: "214",
		type: "ayah",
		arabic: "لا إِلَهَ إِلا أَنتَ سُبْحَانَكَ , إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
		english: "لا إِلَهَ إِلا أَنتَ سُبْحَانَكَ , إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
		source: "Quran",
	},
	{
		id: "215",
		type: "ayah",
		arabic: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
		english: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
		source: "Quran",
	},
	{
		id: "216",
		type: "ayah",
		arabic: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا، وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِب",
		english: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا، وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِب",
		source: "Quran",
	},
	{
		id: "217",
		type: "ayah",
		arabic: "وَمَنْ يُؤْمِنْ بِاللَّهِ يَهْدِ قَلْبَهُ",
		english: "وَمَنْ يُؤْمِنْ بِاللَّهِ يَهْدِ قَلْبَهُ",
		source: "Quran",
	},
	{
		id: "218",
		type: "ayah",
		arabic: "وَٱسۡتَعِینُوا۟ بِٱلصَّبۡرِ وَٱلصَّلَوٰةِ",
		english: "وَٱسۡتَعِینُوا۟ بِٱلصَّبۡرِ وَٱلصَّلَوٰةِ",
		source: "Quran",
	},
];

export function getRandomContent(): IslamicContent {
	const randomIndex = Math.floor(
		Math.random() * DEFAULT_ISLAMIC_CONTENT.length
	);
	return DEFAULT_ISLAMIC_CONTENT[randomIndex];
}

export function getContentByType(type: "hadith" | "ayah"): IslamicContent[] {
	return DEFAULT_ISLAMIC_CONTENT.filter((content) => content.type === type);
}
