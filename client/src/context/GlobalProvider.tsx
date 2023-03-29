import React, { useState, ReactNode } from "react";
import countries from "../data/countries.json";
import shuffle from "../utils/shuffle";
import randomSelect from "../utils/randomSelect";
import {
  defaultCurrentQuestion,
  defaultResults,
  defaultValue,
} from "../utils/defaultValues";
import * as io from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import useListOfCountries from "../hook/useListOfCountries";
import useGameState from "../hook/useGameState";
import useSocketListeners from "../hook/useSocketListeners";
const socket: io.Socket<ServerToClientEvents, ClientToServerEvents> =
  io.connect("http://localhost:3000");

export interface Country {
  name: string;
  code: string;
}

export interface CurrentQuestion {
  answer: string;
  options: string[];
  flagUrl: string;
}

export interface Results {
  correct: boolean;
  previousQuestion: CurrentQuestion;
  score: number;
  show: boolean;
  attempts: number;
}

export interface GlobalContextInterface {
  openInput: boolean;
  setOpenInput: React.Dispatch<React.SetStateAction<boolean>>;
  mistakenQuestions: CurrentQuestion[];
  opponentsAttempts: number;
  mistakes: number;
  opponentsScore: number;
  room: string;
  name: string;
  opponentsName: string;
  isGameLost: boolean;
  isGameWon: boolean;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  socket: io.Socket<ServerToClientEvents, ClientToServerEvents>;
  currentQuestion: CurrentQuestion;
  results: Results;
  initGameRound: () => void;
  resetTheGame: () => void;
  guessTheAnswer: (
    guess: string,
    socket: io.Socket<ServerToClientEvents, ClientToServerEvents>
  ) => void;
  listOfCountries: Country[];
}

type GlobalProviderProps = {
  children: ReactNode;
};

export const GlobalContext =
  React.createContext<GlobalContextInterface>(defaultValue);

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  // State: list of countries
  // State: current question
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>(
    defaultCurrentQuestion
  );
  const [mistakenQuestions, setMistakenQuestions] = useState<CurrentQuestion[]>(
    []
  );
  const [openInput, setOpenInput] = useState(false);

  // State: past question result
  const [results, setResults] = useState<Results>(defaultResults);
  const mistakes = results.attempts - results.score;

  const {
    opponentsScore,
    opponentsAttempts,
    opponentsMistakes,
    opponentsName,
    room,
    name,
    setOpponentScore,
    setOpponentAttempts,
    setOpponentName,
    setRoom,
    setName,
  } = useSocketListeners(socket);

  const { listOfCountries, setListOfCountries } = useListOfCountries();

  const [isGameLost, isGameWon, setIsGameLost, setIsGameWon] = useGameState(
    mistakes,
    opponentsMistakes
  );

  // rest of the component code
  // 2. Each round of game play
  const initGameRound = () => {
    // select 4 random countries

    // pick one of the random countries as the answer
    let { results, answer } = randomSelect(listOfCountries, 4, room);

    // extract the names of the 4 random countries and set options, including the answer
    const options = results.map((each) => each.name);

    // shuffle the options
    const shuffledOptions = shuffle(options);

    // set questionAnswer, flagUrl, options
    setCurrentQuestion((prevCurrentQuestion) => ({
      ...prevCurrentQuestion,
      answer: answer.name,
      flagUrl: `${answer.code}`,
      options: shuffledOptions,
    }));

    // remove the random answer selected from the list, to avoid duplicate question
    setListOfCountries((listOfCountries) => {
      return listOfCountries.filter((country) => country !== answer);
    });
  };

  // 3. Pick an option and check if option is the answer
  const guessTheAnswer = (
    guess: string,
    socket: io.Socket<ServerToClientEvents, ClientToServerEvents>
  ) => {
    // increment the no. of attempts
    // set display of the results card to true

    setResults((prevResults) => {
      return {
        ...prevResults,
        show: true,
        attempts: prevResults.attempts + 1,
      };
    });
    // if guess is correct, set results for correct guess
    if (guess === currentQuestion.answer) {
      setResults((prevResults) => {
        socket.emit("clientScore", prevResults.score + 1, prevResults.attempts);
        return {
          ...prevResults,
          correct: true,
          score: prevResults.score + 1,
          previousQuestion: { ...currentQuestion },
        };
      });
    }
    // if guess is wrong, set results for wrong guess
    if (guess !== currentQuestion.answer) {
      // console.log("wrong");
      setResults((prevResults) => {
        socket.emit("clientScore", prevResults.score, prevResults.attempts);
        return {
          ...prevResults,
          correct: false,
          previousQuestion: { ...currentQuestion },
        };
      });
      // adding the mistaken questions to show in results
      setMistakenQuestions((prevQuestions) => [
        ...prevQuestions,
        currentQuestion,
      ]);
    }

    initGameRound();
  };

  // 4. Reset the listOfCountries, score, and attempts

  const resetTheGame = () => {
    setIsGameWon(false);
    setIsGameLost(false);
    setOpponentAttempts(0);
    setOpponentScore(0);
    setListOfCountries([...countries]);
    setResults(defaultResults);
    setMistakenQuestions([]);
  };

  return (
    <GlobalContext.Provider
      value={{
        isGameLost,
        isGameWon,
        opponentsAttempts,
        mistakes,
        mistakenQuestions,
        opponentsScore,
        listOfCountries,
        room,
        name,
        opponentsName,
        socket,
        currentQuestion,
        results,
        initGameRound,
        resetTheGame,
        guessTheAnswer,
        setRoom,
        setName,
        openInput,
        setOpenInput,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
