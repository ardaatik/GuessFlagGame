import React, { useState, useEffect, ReactNode, useCallback } from "react";
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
import useSocket from "../hook/useSocket";
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
  mistakenQuestions: CurrentQuestion[];
  opponnentsAttempts: number;
  mistakes: number;
  opponnentsScore: number;
  room: string;
  name: string;
  opponnentsName: string;
  IsStarted: boolean;
  IsGameLost: boolean;
  IsGameWon: boolean;
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
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

  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [opponnentsName, setOpponentName] = useState("");
  const [IsStarted, setIsStarted] = useState(false);
  const [IsGameLost, setIsGameLost] = useState(false);
  const [IsGameWon, setIsGameWon] = useState(false);
  const [opponnentsScore, setOpponentScore] = useState(0);
  const [opponnentsAttempts, setOpponentAttempts] = useState(0);
  const [mistakenQuestions, setMistakenQuestions] = useState<CurrentQuestion[]>(
    []
  );

  // State: past question result
  const [results, setResults] = useState<Results>(defaultResults);
  const mistakes = results.attempts - results.score;
  const opponnentsMistakes = opponnentsAttempts - opponnentsScore;
  const MINIMUM_MISTAKES = 3;

  const checkGameState = useCallback(() => {
    if (mistakes >= MINIMUM_MISTAKES) {
      setIsGameLost(true);
    }
    if (opponnentsMistakes >= MINIMUM_MISTAKES) {
      setIsGameWon(true);
    }
  }, [mistakes, opponnentsMistakes]);

  useSocket(socket, "serverGameStart", (start) => {
    console.log(socket.id, "server game started called");
    setIsStarted(start);
  });

  useSocket(socket, "serverName", (name, socketId) => {
    console.log(socket.id, "server name called");
    if (socket.id !== socketId) {
      setOpponentName(name);
    }
  });

  useSocket(socket, "serverScore", (score, attempts) => {
    console.log(socket.id, "server score called");
    setOpponentScore(score);
    setOpponentAttempts(attempts);
  });

  const { listOfCountries, setListOfCountries } = useListOfCountries();

  useEffect(() => {
    checkGameState();
  }, [checkGameState]);

  // rest of the component code
  // 2. Each round of gameplay
  const initGameRound = () => {
    // select a random country

    const randomIndex = Math.floor(Math.random() * listOfCountries.length);
    const randomCountry = listOfCountries[randomIndex];
    // remove the random country selected from the list, to avoid duplicate question
    setListOfCountries((listOfCountries) => {
      return [
        ...listOfCountries.slice(0, randomIndex),
        ...listOfCountries.slice(randomIndex + 1),
      ];
    });

    // select three country, extract the names,  and set options, including the answer
    let threeRandomCountries = randomSelect(listOfCountries, 3).map(
      (each: Country) => each.name
    );
    if (threeRandomCountries.includes(randomCountry.name)) {
      // if answer is already included in options, remove it from threeRandomCountries
      console.log(threeRandomCountries, "burda buldum orospu cocugunu!");
    }
    let options = [...threeRandomCountries, randomCountry.name];
    // shuffle the options

    options = shuffle(options);
    // set questionAnswer, flagUrl, options
    setCurrentQuestion((prevCurrentQuestion) => ({
      ...prevCurrentQuestion,
      answer: randomCountry.name,
      flagUrl: `${randomCountry.code}`,
      options: options,
    }));
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
    setListOfCountries(shuffle([...countries]));
    setResults(defaultResults);
    setMistakenQuestions([]);
  };

  return (
    <GlobalContext.Provider
      value={{
        mistakenQuestions,
        IsGameLost,
        IsGameWon,
        opponnentsAttempts,
        mistakes,
        opponnentsScore,
        IsStarted,
        setIsStarted,
        setRoom,
        setName,
        room,
        name,
        opponnentsName,
        socket,
        currentQuestion,
        results,
        initGameRound,
        resetTheGame,
        guessTheAnswer,
        listOfCountries,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
