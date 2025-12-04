import type { AllSettings } from "@/entities/prayer";

type CRRegion = { name: string; shortCode: string };
type CRCountry = { countryShortCode: string; regions?: CRRegion[] };

type NavigatorWithPermissions = Navigator & {
	permissions?: {
		query: (q: { name: PermissionName }) => Promise<PermissionStatus>;
	};
};

type SettingsDialogProps = {
	settings: AllSettings;
	onSettingsChange: (settings: Partial<AllSettings>) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

type TabCommonProps = {
	settings: AllSettings;
	onSettingsChange: (settings: Partial<AllSettings>) => void;
	t: (key: string) => string;
};

export type {
	CRRegion,
	CRCountry,
	NavigatorWithPermissions,
	SettingsDialogProps,
	TabCommonProps,
};
