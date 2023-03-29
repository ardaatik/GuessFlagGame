import seedrandom from "seedrandom";
import { Country } from "../context/GlobalProvider";

const randomSelect = (array: Country[], n: number, seed: string) => {
  const results: Country[] = [];
  const randomNumArray: number[] = [];

  // create a seedrandom instance with the given seed
  const rng = seedrandom(seed);
  console.log(rng());

  for (let i = 1; i <= n; i++) {
    let randomNum: number = Math.round(rng() * (array.length - 1));
    while (randomNumArray.includes(randomNum)) {
      randomNum = Math.round(rng() * (array.length - 1));
    }
    randomNumArray.push(randomNum);
  }

  randomNumArray.forEach((key, idx) => (results[idx] = array[key]));
  const answer = results[Math.floor(rng() * results.length)];
  console.log(answer);
  console.log(results);
  return { results, answer };
};

export default randomSelect;
