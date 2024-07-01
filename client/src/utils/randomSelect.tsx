import { Country } from "../../../typings";

const randomOptions = (array: Country[], n: number = 4) => {
	const result: string[] = [];
	const randomNumArray: number[] = [];

	while (randomNumArray.length < n) {
		const randomNum = Math.floor(Math.random() * array.length);
		if (!randomNumArray.includes(randomNum)) {
			randomNumArray.push(randomNum);
			result.push(array[randomNum].name);
		}
	}

	return result;
};

const randomAnswer = (array: Country[], options: string[]) => {
	let answer: Country;
	do {
		const randomNum = Math.floor(Math.random() * array.length);
		answer = array[randomNum];
	} while (options.includes(answer.name));

	// Add the answer to the options if it's not already there
	if (!options.includes(answer.name)) {
		const replaceIndex = Math.floor(Math.random() * options.length);
		options[replaceIndex] = answer.name;
	}

	return { answer, options };
};

export { randomAnswer, randomOptions };
