export type Location = {
	latitude: number;
	longitude: number;
	city: string;
	country: string;
	countryCode?: string;
	cityCode?: string;
	timezoneName?: string;
};

export type CityEntry = {
	code: string;
	city: string;
	extra?: string;
};

export type CitiesResponse = {
	cc: string;
	cities: CityEntry[];
};
