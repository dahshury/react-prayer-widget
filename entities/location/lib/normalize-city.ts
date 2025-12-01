export function normalizeCity(raw?: string): string | null {
	if (!raw) {
		return null;
	}
	const basic = raw
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toUpperCase()
		.replace(/\s+/g, "_")
		.replace(/-/g, "_")
		.replace(/[^A-Z0-9_]/g, "_")
		.replace(/_+/g, "_")
		.replace(/^_|_$/g, "");
	return basic || null;
}
