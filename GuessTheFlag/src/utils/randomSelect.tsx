// This util function randomly selects a predetermined 'n' number of elements, without duplicates, from a given array.

import { Country } from "../context/GlobalProvider";

const randomSelect = (array: Country[], n: number) => {
  // cannot have duplicates
  const results: Country[] = [];
  const randomNumArray: number[] = [];
  for (let i = 1; i <= n; i++) {
    let randomNum: number = Math.floor(Math.random() * array.length);
    while (randomNumArray.includes(randomNum)) {
      randomNum = Math.floor(Math.random() * array.length);
    }
    randomNumArray.push(randomNum);
  }
  randomNumArray.map((key, idx) => (results[idx] = array[key]));
  return results;
};

export default randomSelect;
