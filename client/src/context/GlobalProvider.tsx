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
  mistakenQuestions: CurrentQuestion[];
  opponentsAttempts: number;
  mistakes: number;
  opponentsScore: number;
  room: string;
  name: string;
  opponentsName: string;
  isGameLost: boolean;
  isGameWon: boolean;
  socket: io.Socket<ServerToClientEvents, ClientToServerEvents>;
  currentQuestion: CurrentQuestion;
  results: Results;
  listOfCountries: Country[];
  singlePlayerMode: boolean;
  setOpenInput: React.Dispatch<React.SetStateAction<boolean>>;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  initGameRound: () => void;
  resetTheGame: () => void;
  guessTheAnswer: (
    guess: string,
    socket: io.Socket<ServerToClientEvents, ClientToServerEvents>
  ) => void;
  setResults: React.Dispatch<React.SetStateAction<Results>>;
  setSinglePlayerMode: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [name, setName] = useState("");
  const [singlePlayerMode, setSinglePlayerMode] = useState(false);
  const mistakes = results.attempts - results.score;
  const {
    opponentsScore,
    opponentsAttempts,
    opponentsMistakes,
    opponentsName,
    room,
    setOpponentScore,
    setOpponentAttempts,
    setRoom,
  } = useSocketListeners(socket);

  const { listOfCountries, setListOfCountries } = useListOfCountries();
  const [isGameLost, isGameWon, setIsGameLost, setIsGameWon] = useGameState(
    mistakes,
    opponentsMistakes
  );
  const initGameRound = () => {
    // returns the question and the options where the
    const { result, answer } = randomSelect(listOfCountries, 4, room);

    console.log(...result);
    console.log(answer);
    // extract the names of the 4 random countries and set options, including the answer
    const options = result.map((each) => each.name);

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
    setResults((prevResults) => ({
      ...prevResults,
      show: true,
      attempts: prevResults.attempts + 1,
    }));
    console.log(socket);

    const isCorrectGuess = guess === currentQuestion.answer;
    setResults((prevResults) => {
      const newScore = isCorrectGuess
        ? prevResults.score + 1
        : prevResults.score;
      const updatedResults = {
        ...prevResults,
        correct: isCorrectGuess,
        score: newScore,
        previousQuestion: { ...currentQuestion },
      };

      if (!singlePlayerMode) {
        socket.emit("clientScore", newScore, prevResults.attempts);
      }

      return updatedResults;
    });

    if (!isCorrectGuess) {
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
        openInput,
        initGameRound,
        resetTheGame,
        guessTheAnswer,
        setRoom,
        setName,
        setResults,
        setOpenInput,
        singlePlayerMode,
        setSinglePlayerMode,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
