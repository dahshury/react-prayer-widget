"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";

interface DualDateDisplayProps {
	className?: string;
}

export function DualDateDisplay({ className }: DualDateDisplayProps) {
	const { language } = useTranslation();
	const [dates, setDates] = useState<{
		gregorian: string;
		hijri: string;
	} | null>(null);

	useEffect(() => {
		const updateDates = () => {
			const now = new Date();

			// Gregorian date
			const gregorian = now.toLocaleDateString(
				language === "ar" ? "ar" : "en-US",
				{
					weekday: "short",
					month: "short",
					day: "numeric",
					year: "numeric",
				},
			);

			// Hijri date via Intl (Umm al-Qura when available)
			const islamicLocale = language === "ar" ? "ar-SA" : "en";
			const tryFormats = [
				`${islamicLocale}-u-ca-islamic-umalqura`,
				`${islamicLocale}-u-ca-islamic`,
			];
			let hijri = "";
			for (const loc of tryFormats) {
				try {
					hijri = new Intl.DateTimeFormat(loc, {
						day: "numeric",
						month: "long",
						year: "numeric",
					}).format(now);
					if (hijri) break;
				} catch {
					// continue to next format
				}
			}
			if (!hijri) {
				// Fallback to a minimal ISO-like string if Intl is unavailable
				hijri = gregorian;
			}

			setDates({ gregorian, hijri });
		};

		updateDates();
		const interval = setInterval(updateDates, 60000); // Update every minute

		return () => clearInterval(interval);
	}, [language]);

	if (!dates) return null;

	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<div className="flex items-center gap-2 text-amber-400">
				<Calendar className="h-4 w-4" />
			</div>
			<div className="space-y-0.5">
				<div className="text-sm font-medium text-foreground">
					{dates.gregorian}
				</div>
				<div className="text-xs text-muted-foreground">{dates.hijri}</div>
			</div>
		</div>
	);
}
