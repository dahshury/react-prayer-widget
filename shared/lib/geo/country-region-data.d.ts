declare module "country-region-data" {
	export type Region = {
		name: string;
		shortCode: string;
	};

	export type CountryRegion = {
		countryName: string;
		countryShortCode: string;
		regions: Region[];
	};

	export const allCountries: CountryRegion[];
}

// Re-export types for use in the codebase
export type Region = {
	name: string;
	shortCode: string;
};

export type CountryRegion = {
	countryName: string;
	countryShortCode: string;
	regions: Region[];
};
