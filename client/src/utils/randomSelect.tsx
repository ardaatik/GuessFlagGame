import seedrandom from "seedrandom";
import { Country } from "../context/GlobalProvider";

const randomSelect = (array: Country[], n: number, seed: string) => {
  const results: Country[] = [];
  const randomNumArray: number[] = [];

  // create a seedrandom instance with the given seed
  const rng = seedrandom(seed);

  // use seedrandom for the first random number
  const firstRandomNum = Math.round(rng() * (array.length - 1));
  randomNumArray.push(firstRandomNum);

  for (let i = 2; i <= n; i++) {
    let randomNum: number = Math.round(Math.random() * (array.length - 1));
    while (randomNumArray.includes(randomNum)) {
      randomNum = Math.round(Math.random() * (array.length - 1));
    }
    randomNumArray.push(randomNum);
  }

  randomNumArray.forEach((key, idx) => (results[idx] = array[key]));
  const answer = array[firstRandomNum];
  console.log(answer);
  console.log(...results);
  return { results, answer };
};

export default randomSelect;
