import {
  CurrentQuestion,
  GlobalContextInterface,
  Results,
} from "../context/GlobalProvider";

export const defaultValue: GlobalContextInterface = {
  currentQuestion: {
    answer: "",
    options: [],
    flagUrl: "",
  },
  results: {
    correct: false,
    previousQuestion: {
      answer: "",
      options: [],
      flagUrl: "",
    },
    score: 0,
    show: false,
    attempts: 0,
  },
  initGameRound: () => {},
  resetTheGame: () => {},
  guessTheAnswer: () => {},
  listOfCountries: [],
};

export const defaultResults: Results = {
  correct: false,
  previousQuestion: {
    answer: "",
    options: [],
    flagUrl: "",
  },
  score: 0,
  show: false,
  attempts: 0,
};

export const defaultCurrentQuestion: CurrentQuestion = {
  answer: "",
  options: [],
  flagUrl: "",
};
