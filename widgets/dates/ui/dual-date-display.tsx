"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/shared/lib/hooks";

const DATE_UPDATE_INTERVAL_MS = 60_000; // Update every minute

function formatHijriDate(now: Date, language: string): string {
	const islamicLocale = language === "ar" ? "ar-SA" : "en";
	const tryFormats = [
		`${islamicLocale}-u-ca-islamic-umalqura`,
		`${islamicLocale}-u-ca-islamic`,
	];

	for (const loc of tryFormats) {
		try {
			const hijri = new Intl.DateTimeFormat(loc, {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(now);
			if (hijri) {
				return hijri;
			}
		} catch {
			// continue to next format
		}
	}

	// Fallback to gregorian if Intl is unavailable
	return now.toLocaleDateString(language === "ar" ? "ar" : "en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

type DualDateDisplayProps = {
	className?: string;
};

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
				}
			);

			// Hijri date via Intl (Umm al-Qura when available)
			const hijri = formatHijriDate(now, language);

			setDates({ gregorian, hijri });
		};

		updateDates();
		const interval = setInterval(updateDates, DATE_UPDATE_INTERVAL_MS); // Update every minute

		return () => clearInterval(interval);
	}, [language]);

	if (!dates) {
		return null;
	}

	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<div className="flex items-center gap-2 text-amber-400">
				<Calendar className="h-4 w-4" />
			</div>
			<div className="space-y-0.5">
				<div className="font-medium text-foreground text-sm">
					{dates.gregorian}
				</div>
				<div className="text-muted-foreground text-xs">{dates.hijri}</div>
			</div>
		</div>
	);
}
