const countryNameToISO2: Record<string, string> = {
	"saudi arabia": "SA",
	"kingdom of saudi arabia": "SA",
	"united arab emirates": "AE",
	uae: "AE",
	kuwait: "KW",
	qatar: "QA",
	bahrain: "BH",
	oman: "OM",
	iraq: "IQ",
	syria: "SY",
	lebanon: "LB",
	jordan: "JO",
	palestine: "PS",
	egypt: "EG",
	morocco: "MA",
	tunisia: "TN",
	algeria: "DZ",
	turkey: "TR",
	pakistan: "PK",
	bangladesh: "BD",
	indonesia: "ID",
	malaysia: "MY",
	"united kingdom": "GB",
	uk: "GB",
	"great britain": "GB",
	"united states": "US",
	usa: "US",
	canada: "CA",
	australia: "AU",
};

function iso2ToFlag(iso2: string): string {
	const code = iso2.trim().toUpperCase();
	if (code.length !== 2) {
		return "";
	}
	const A = 0x1_f1_e6;
	const base = "A".charCodeAt(0);
	const chars = Array.from(code).map((ch) =>
		String.fromCodePoint(A + (ch.charCodeAt(0) - base))
	);
	return chars.join("");
}

export function countryToFlag(countryOrCode?: string): string {
	if (!countryOrCode) {
		return "";
	}
	const val = countryOrCode.trim();
	if (val.length === 2) {
		return iso2ToFlag(val);
	}
	const iso = countryNameToISO2[val.toLowerCase()];
	return iso ? iso2ToFlag(iso) : "";
}
