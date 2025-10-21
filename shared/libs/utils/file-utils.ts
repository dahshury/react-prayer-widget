const FILE_SIZES = [
	"Bytes",
	"KB",
	"MB",
	"GB",
	"TB",
	"PB",
	"EB",
	"ZB",
	"YB",
] as const;

export function formatBytes(bytes: number, decimals = 2): string {
	if (!+bytes) {
		return "0 Bytes";
	}
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const unit = FILE_SIZES[i] || FILE_SIZES.at(-1);
	return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${unit}`;
}
