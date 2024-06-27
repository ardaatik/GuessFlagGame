import { useEffect, useState } from "react";
import { GamemodeRegion } from "../../../typings";
import countriesByRegion from "../data/countries.json";

export interface Country {
	name: string;
	code: string;
}

const useListOfCountries = (region: GamemodeRegion) => {
	const [listOfCountries, setListOfCountries] = useState<Country[]>(
		Object.values(countriesByRegion).flat()
	);
	const [listOfCountriesClone, setListOfCountriesClone] = useState<Country[]>(
		Object.values(countriesByRegion).flat()
	);

	useEffect(() => {
		updateCountries(region);
		console.log(region);
	}, [region]);

	const updateCountries = (selectedRegions: GamemodeRegion) => {
		const newListOfCountries: Country[] = [];

		selectedRegions.forEach((currentRegion) => {
			const countries = countriesByRegion[currentRegion];
			if (Array.isArray(countries)) {
				newListOfCountries.push(...countries);
			}
		});

		console.log(newListOfCountries);

		setListOfCountries(newListOfCountries);

		// Create a new immutable copy after updating the state
		setListOfCountriesClone(newListOfCountries);
	};

	return {
		listOfCountries: listOfCountries,
		setListOfCountries: setListOfCountries,
		listOfCountriesClone: listOfCountriesClone,
	};
};

export default useListOfCountries;
