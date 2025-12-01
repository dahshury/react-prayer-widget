export type { Location } from "@/entities/prayer";

export type CityEntry = {
	code: string;
	city: string;
	extra?: string;
};

export type CitiesResponse = {
	cc: string;
	cities: CityEntry[];
};
