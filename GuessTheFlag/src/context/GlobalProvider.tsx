import React, { useState, useEffect, ReactNode } from "react";
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
  opponnentsAttempts: number;
  mistakes: number;
  score: number;
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
  const [listOfCountries, setListOfCountries] = useState<Country[]>([]);
  // State: current question
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>(
    defaultCurrentQuestion
  );

  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [opponnentsName, setOpponnentsName] = useState("");
  const [IsStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [opponnentsAttempts, setOpponnentsAttempts] = useState(0);
  const [IsGameLost, setIsGameLost] = useState(false);
  const [IsGameWon, setIsGameWon] = useState(false);

  // State: past question result
  const [results, setResults] = useState<Results>(defaultResults);
  const mistakes = results.attempts - results.score;
  const opponnentsMistakes = opponnentsAttempts - score;

  useEffect(() => {
    socket.on("server_game_start", (start: boolean) => {
      console.log(socket.id, "server game started called");
      setIsStarted(start);
    });
    socket.on("serverName", (name, socketId) => {
      console.log(socket.id, "server name called");

      if (socket.id !== socketId) {
        setOpponnentsName(name);
      }
    });
    socket.on("serverScore", (score, attempts) => {
      console.log(socket.id, "server score called");
      setScore(score);
      setOpponnentsAttempts(attempts);
    });

    return () => {
      socket.off("server_game_start");
      socket.off("serverName");
      socket.off("serverScore");
    };
  }, [socket]);

  useEffect(() => {
    const MINIMUM_MISTAKES = 3;
    if (mistakes >= MINIMUM_MISTAKES) {
      setIsGameLost(true);
    }

    if (opponnentsMistakes >= MINIMUM_MISTAKES) {
      setIsGameWon(true);
    }
  }, [mistakes, opponnentsMistakes]);

  // 1. Shuffled array of country names and their ISO alpha-2 code
  useEffect(() => {
    setListOfCountries(shuffle([...countries]));
  }, []);

  // 2. Each round of gameplay
  const initGameRound = () => {
    // select a random country

    const randomIndex = Math.floor(Math.random() * listOfCountries.length);
    const randomCountry = listOfCountries[randomIndex];
    // remove the random country selected from the list, to avoid duplicate question
    setListOfCountries((listOfCountries) => {
      let array = [...listOfCountries];
      array.splice(randomIndex, 1);
      return array;
    });

    // select three country, extract the names,  and set options, including the answer
    let threeRandomCountries = randomSelect(countries, 3).map(
      (each: Country) => each.name
    );

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
    }

    initGameRound();
  };

  // 4. Reset the listOfCountries, score, and attempts

  const resetTheGame = () => {
    setIsGameWon(false);
    setIsGameLost(false);
    setOpponnentsAttempts(0);
    setScore(0);
    setListOfCountries(shuffle([...countries]));
    setResults(defaultResults);
    initGameRound();
  };

  return (
    <GlobalContext.Provider
      value={{
        IsGameLost,
        IsGameWon,
        opponnentsAttempts,
        mistakes,
        score,
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
