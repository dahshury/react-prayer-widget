export const AVAILABLE_FONTS = [
	{ value: "default", label: "Default (System)" },
	{ value: "Amiri", label: "Amiri" },
	{ value: "AmiriBold", label: "Amiri Bold" },
	{ value: "Andalus", label: "Andalus" },
	{ value: "BaradaReqa", label: "Barada Reqa" },
	{ value: "FodaFreeFont", label: "Foda Free Font" },
	{ value: "FreeMono", label: "Free Mono" },
	{ value: "FreeMonoBold", label: "Free Mono Bold" },
	{ value: "FreeSans", label: "Free Sans" },
	{ value: "FreeSansBold", label: "Free Sans Bold" },
	{ value: "FreeSerif", label: "Free Serif" },
	{ value: "FreeSerifBold", label: "Free Serif Bold" },
	{ value: "HSNOmar", label: "HSN Omar" },
	{ value: "KFGQPCUthmanTaha", label: "KFGQPC Uthman Taha" },
	{ value: "KSARegular", label: "KSA Regular" },
	{ value: "mohammadboldart1", label: "Mohammad Bold Art" },
	{ value: "Monofonto", label: "Monofonto" },
	{ value: "NRTReg", label: "NRT Regular" },
	{ value: "SFSultan-Black", label: "SF Sultan Black" },
	{ value: "STC-Regular", label: "STC Regular" },
] as const;

export type FontValue = (typeof AVAILABLE_FONTS)[number]["value"];

export const DEFAULT_PRAYER_FONT: FontValue = "default";
export const DEFAULT_TIME_FONT: FontValue = "default";
