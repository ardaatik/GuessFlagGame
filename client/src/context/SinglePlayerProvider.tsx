import { randomAnswer, randomOptions } from "@/utils/randomSelect";
import shuffleArray from "@/utils/shuffle";
import React, {
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Country, CurrentQuestion, Results } from "../../../typings";
import countries from "../data/countries.json";
import {
	SinglePlayerContextInterface,
	SinglePlayerContextValues,
} from "../data/defaultValues";
import useListOfCountries from "../hook/useListOfCountries";
import { GameModeContext } from "./GameModeProvider";

export const SinglePlayerContext =
	React.createContext<SinglePlayerContextInterface>(SinglePlayerContextValues);

const SinglePlayerProvider = ({ children }: { children: ReactNode }) => {
	const { regions } = useContext(GameModeContext);
	const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>(
		SinglePlayerContextValues.currentQuestion
	);
	const [results, setResults] = useState<Results>(
		SinglePlayerContextValues.results
	);
	const [mistakenQuestions, setMistakenQuestions] = useState<CurrentQuestion[]>(
		[]
	);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

	const { listOfCountries, setListOfCountries, listOfCountriesClone } =
		useListOfCountries(regions);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		// Cleanup function to clear the timeout when the component unmounts
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const clearGuessTimeout = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};

	const initGameRound = () => {
		let answer: Country, options;
		// Get random options from full list
		options = randomOptions(listOfCountriesClone);
		// Get the answer from filtered list
		({ answer, options } = randomAnswer(listOfCountries, options));

		const shuffledOptions = shuffleArray(options);

		// remove the random answer selected from the list, to avoid duplicate question
		setListOfCountries((listOfCountries) => {
			return listOfCountries.filter((country) => country !== answer);
		});

		setCurrentQuestion((prevCurrentQuestion) => ({
			...prevCurrentQuestion,
			answer: answer.name,
			flagUrl: `${answer.code}`,
			options: shuffledOptions,
		}));
		// reset selected answer for the next question
		setSelectedAnswer(null);
	};

	const guessTheAnswer = (guess: string) => {
		const isCorrectGuess = guess === currentQuestion.answer;

		let newMistakenQuestions = mistakenQuestions;

		if (!isCorrectGuess) {
			// Add the current question to the mistaken questions if the guess is incorrect
			newMistakenQuestions = [...mistakenQuestions, currentQuestion];
			setMistakenQuestions(newMistakenQuestions);
		}

		// Clear any existing timeout to prevent multiple timeouts running
		clearGuessTimeout();

		timeoutRef.current = setTimeout(() => {
			setResults((prevResults) => ({
				...prevResults,
				correct: isCorrectGuess,
				previousQuestion: currentQuestion,
				score: isCorrectGuess ? prevResults.score + 1 : prevResults.score,
				show: true,
				attempts: prevResults.attempts + 1,
			}));

			initGameRound();
		}, 1000);
	};

	const resetSinglePlayer = () => {
		setResults(SinglePlayerContextValues.results);
		setMistakenQuestions([]);
		// Create a new array that includes all the countries from the regions specified in the region array and filter out undefined values
		const filteredCountries = regions
			.flatMap((regionItem) => countries[regionItem])
			.filter(Boolean);
		// Update the listOfCountries state with the filtered countries
		setListOfCountries(filteredCountries);
	};

	return (
		<SinglePlayerContext.Provider
			value={{
				currentQuestion,
				results,
				selectedAnswer,
				setCurrentQuestion,
				setResults,
				setSelectedAnswer,
				resetSinglePlayer,
				guessTheAnswer,
				initGameRound,
				mistakenQuestions,
				listOfCountries,
			}}
		>
			{children}
		</SinglePlayerContext.Provider>
	);
};

export default SinglePlayerProvider;
