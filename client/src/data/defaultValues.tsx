import {
	Country,
	CurrentQuestion,
	OneVersusOneStateType,
	PlayerState,
	Results,
} from "../../../typings";

export const defaultPlayerState: PlayerState = {
	id: "",
	score: 0,
	attempts: 0,
	name: "",
	playAgain: false,
	disconnected: false,
	mistakes: 0,
	result: [],
	answered: false,
};

export interface GlobalContextInterface {
	mistakenQuestions: CurrentQuestion[];
	room: string;
	setRoom: React.Dispatch<React.SetStateAction<string>>;
	resetTheGame: () => void;
	guessTheAnswer: (guess: string) => void;
	setIsSocketConnected: React.Dispatch<React.SetStateAction<boolean>>;
	isSocketConnected: boolean;
	currentPlayerState: PlayerState | undefined;
	opponentPlayerState: PlayerState | undefined;
	setRoomState: React.Dispatch<
		React.SetStateAction<OneVersusOneStateType | null>
	>;
	currentPlayer: "player1" | "player2";
	opponentPlayer: "player1" | "player2";
	roomState: OneVersusOneStateType | null;
	gameEnded: boolean;
	setGameEnded: React.Dispatch<React.SetStateAction<boolean>>;
	setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
	gameStarted: boolean;
	setTimer: React.Dispatch<React.SetStateAction<number>>;
	timer: number;
	selectedAnswer: string | null;
	setSelectedAnswer: React.Dispatch<React.SetStateAction<string | null>>;
}

export const GlobalContextValues: GlobalContextInterface = {
	mistakenQuestions: [],
	room: "",
	setIsSocketConnected: () => {},
	isSocketConnected: false,
	setRoom: () => {},
	resetTheGame: () => {},
	guessTheAnswer: () => {},
	currentPlayerState: defaultPlayerState || undefined,
	opponentPlayerState: defaultPlayerState || undefined,
	setRoomState: () => {},
	currentPlayer: "player1",
	opponentPlayer: "player2",
	roomState: null, // Provide a default value for the 'roomState' property
	gameEnded: false,
	setGameEnded: () => {},
	gameStarted: false,
	setGameStarted: () => {},
	setTimer: () => {},
	timer: 0,
	selectedAnswer: null,
	setSelectedAnswer: () => {},
};

export interface SinglePlayerContextInterface {
	currentQuestion: CurrentQuestion;
	results: Results;
	setCurrentQuestion: React.Dispatch<React.SetStateAction<CurrentQuestion>>;
	setResults: React.Dispatch<React.SetStateAction<Results>>;
	resetSinglePlayer: () => void;
	guessTheAnswer: (guess: string) => void;
	initGameRound: () => void;
	selectedAnswer: string | null;
	setSelectedAnswer: React.Dispatch<React.SetStateAction<string | null>>;
	mistakenQuestions: CurrentQuestion[];
	listOfCountries: Country[];
}
export const SinglePlayerContextValues: SinglePlayerContextInterface = {
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
	listOfCountries: [],
	selectedAnswer: null,
	mistakenQuestions: [],
	setCurrentQuestion: () => {},
	setResults: () => {},
	resetSinglePlayer: () => {},
	guessTheAnswer: () => {},
	initGameRound: () => {},
	setSelectedAnswer: () => {},
};
