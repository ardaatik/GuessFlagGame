import { Country } from "../context/GlobalProvider";
import { generateRandomNumber } from "../utils/generateNextRandomNumber";

const randomSelect = (array: Country[], n: number, room: string) => {
  const result: Country[] = [];
  const randomNumArray: number[] = [];

  while (randomNumArray.length < n) {
    const randomNum = Math.round(
      generateRandomNumber(room) * (array.length - 1)
    );
    if (!randomNumArray.includes(randomNum)) {
      randomNumArray.push(randomNum);
      result.push(array[randomNum]);
      console.log(randomNum);
    }
  }

  const answer = array[randomNumArray[0]];
  console.log(randomNumArray[0], answer.name);

  return { result, answer };
};

export default randomSelect;
