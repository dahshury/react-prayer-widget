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
