/**
 * Cookie utility functions using Cookie Store API when available,
 * with fallback to document.cookie for compatibility.
 */

const NEXT_LOCALE_COOKIE_NAME = "NEXT_LOCALE";

function capitalizeSameSite(sameSite: "lax" | "strict" | "none"): string {
	if (sameSite === "lax") {
		return "Lax";
	}
	if (sameSite === "strict") {
		return "Strict";
	}
	return "None";
}

function setCookieFallback(options: {
	name: string;
	value: string;
	path: string;
	maxAge: number;
	sameSite: "lax" | "strict" | "none";
}): void {
	const sameSiteCapitalized = capitalizeSameSite(options.sameSite);
	// biome-ignore lint/suspicious/noDocumentCookie: Required fallback for browser compatibility when Cookie Store API is unavailable
	document.cookie = `${options.name}=${options.value}; path=${options.path}; max-age=${options.maxAge}; SameSite=${sameSiteCapitalized}`;
}

/**
 * Sets a cookie using Cookie Store API if available, otherwise falls back to document.cookie
 */
export function setCookie(
	name: string,
	value: string,
	options?: {
		path?: string;
		maxAge?: number;
		sameSite?: "lax" | "strict" | "none";
	}
): void {
	if (typeof window === "undefined") {
		return;
	}

	const { path = "/", maxAge = 31_536_000, sameSite = "lax" } = options || {};

	// Use Cookie Store API if available
	if ("cookieStore" in window && window.cookieStore) {
		// Cookie Store API supports maxAge but TypeScript definitions may be incomplete
		window.cookieStore
			.set({
				name,
				value,
				path,
				maxAge,
				sameSite,
			} as Parameters<typeof window.cookieStore.set>[0])
			.catch(() => {
				// Fallback to document.cookie if Cookie Store API fails
				setCookieFallback({ name, value, path, maxAge, sameSite });
			});
	} else {
		// Fallback to document.cookie for browsers without Cookie Store API
		setCookieFallback({ name, value, path, maxAge, sameSite });
	}
}

/**
 * Sets the NEXT_LOCALE cookie
 */
export function setLocaleCookie(locale: string): void {
	setCookie(NEXT_LOCALE_COOKIE_NAME, locale, {
		path: "/",
		maxAge: 31_536_000,
		sameSite: "lax",
	});
}
