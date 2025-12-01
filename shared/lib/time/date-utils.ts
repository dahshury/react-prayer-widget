export function toMonthDay(dateStr?: string): string {
	const d = dateStr ? new Date(dateStr) : new Date();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	return `${mm}-${dd}`;
}
