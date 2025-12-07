import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { I18nextProviderWrapper } from "@/shared/lib/i18n/i18next-provider";
import "./globals.css";

export const metadata: Metadata = {
	title: "Tawkit - Prayer Times",
	description:
		"Prayer times application with accurate calculations and location-based times",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
				<I18nextProviderWrapper>
					{children}
					<Analytics />
				</I18nextProviderWrapper>
			</body>
		</html>
	);
}
