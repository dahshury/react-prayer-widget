/**
 * Automatically injects CSS variables required by the package
 * This runs as a side effect when the package is imported
 */

const CSS_VARIABLES = `
:root {
	--background: #1a1a1a;
	--foreground: #ffffff;
	--card: #111827;
	--card-foreground: #f9fafb;
	--popover: #111827;
	--popover-foreground: #ffffff;
	--primary: #0891b2;
	--primary-foreground: #ffffff;
	--secondary: #4b5563;
	--secondary-foreground: #f9fafb;
	--muted: #111827;
	--muted-foreground: #4b5563;
	--accent: #dc2626;
	--accent-foreground: #ffffff;
	--destructive: #dc2626;
	--destructive-foreground: #ffffff;
	--border: #4b5563;
	--input: #1f2937;
	--ring: #0891b2;
	--chart-1: #0891b2;
	--chart-2: #dc2626;
	--chart-3: #f59e0b;
	--chart-4: #4b5563;
	--chart-5: #ffffff;
	--radius: 0.5rem;
	--sidebar: #111827;
	--sidebar-foreground: #f9fafb;
	--sidebar-primary: #0891b2;
	--sidebar-primary-foreground: #ffffff;
	--sidebar-accent: #dc2626;
	--sidebar-accent-foreground: #ffffff;
	--sidebar-border: #4b5563;
	--sidebar-ring: #0891b2;
	--prayer-name-color: var(--foreground);
	--prayer-time-color: var(--foreground);
	--prayer-countdown-color: var(--muted-foreground);
	--prayer-card-h-next-xs: 2.25rem;
	--prayer-card-h-next-sm: 2.5rem;
	--prayer-card-h-next-md: 2.75rem;
	--prayer-card-h-next-lg: 3.25rem;
	--prayer-card-h-item-xs: 2rem;
	--prayer-card-h-item-sm: 2.25rem;
	--prayer-card-h-item-md: 2.5rem;
	--prayer-card-h-item-lg: 3rem;
}

.dark {
	--background: #1a1a1a;
	--foreground: #ffffff;
	--card: #111827;
	--card-foreground: #f9fafb;
	--popover: #111827;
	--popover-foreground: #ffffff;
	--primary: #0891b2;
	--primary-foreground: #ffffff;
	--secondary: #4b5563;
	--secondary-foreground: #f9fafb;
	--muted: #111827;
	--muted-foreground: #4b5563;
	--accent: #dc2626;
	--accent-foreground: #ffffff;
	--destructive: #dc2626;
	--destructive-foreground: #ffffff;
	--border: #4b5563;
	--input: #1f2937;
	--ring: #0891b2;
	--chart-1: #0891b2;
	--chart-2: #dc2626;
	--chart-3: #f59e0b;
	--chart-4: #4b5563;
	--chart-5: #ffffff;
	--sidebar: #111827;
	--sidebar-foreground: #f9fafb;
	--sidebar-primary: #0891b2;
	--sidebar-primary-foreground: #ffffff;
	--sidebar-accent: #dc2626;
	--sidebar-accent-foreground: #ffffff;
	--sidebar-border: #4b5563;
	--sidebar-ring: #0891b2;
	--prayer-name-color: var(--foreground);
	--prayer-time-color: var(--foreground);
	--prayer-countdown-color: var(--muted-foreground);
	--prayer-card-h-next-xs: 2.25rem;
	--prayer-card-h-next-sm: 2.5rem;
	--prayer-card-h-next-md: 2.75rem;
	--prayer-card-h-next-lg: 3.25rem;
	--prayer-card-h-item-xs: 2rem;
	--prayer-card-h-item-sm: 2.25rem;
	--prayer-card-h-item-md: 2.5rem;
	--prayer-card-h-item-lg: 3rem;
}
`;

const STYLE_ID = "react-prayer-widget-styles";

/**
 * Injects CSS variables into the document
 * Safe to call multiple times (idempotent)
 */
function injectStyles() {
	// Only run in browser environment
	if (typeof document === "undefined") {
		return;
	}

	// Check if styles are already injected
	if (document.getElementById(STYLE_ID)) {
		return;
	}

	// Wait for DOM to be ready if needed
	const inject = () => {
		if (document.getElementById(STYLE_ID)) {
			return;
		}

		// Create and inject style element
		const style = document.createElement("style");
		style.id = STYLE_ID;
		style.textContent = CSS_VARIABLES;
		document.head.appendChild(style);
	};

	// Inject immediately if document is ready, otherwise wait
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", inject);
	} else {
		inject();
	}
}

// Auto-inject on module load (side effect)
injectStyles();

// Also export for manual injection if needed
export { injectStyles };
