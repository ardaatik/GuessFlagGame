import { useEffect, useState } from "react";
import countries from "../data/countries.json";
import shuffle from "../utils/shuffle";

export interface Country {
  name: string;
  code: string;
}
const useListOfCountries = () => {
  const [listOfCountries, setListOfCountries] = useState<Country[]>([]);

  useEffect(() => {
    setListOfCountries(shuffle([...countries]));
    console.log(listOfCountries);
  }, []);
  return {
    listOfCountries: listOfCountries,
    setListOfCountries: setListOfCountries,
  };
};

export default useListOfCountries;
