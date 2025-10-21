declare module "country-region-data/dist/data-umd" {
	export type Region = {
		name: string;
		shortCode: string;
	};

	export type CountryRegion = {
		countryName: string;
		countryShortCode: string;
		regions: Region[];
	};

	const data: CountryRegion[];
	export default data;
}
