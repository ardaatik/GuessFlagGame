export interface ServerToClientEvents {
	"room-state": (state: OneVersusOneStateType) => void;
	"has-joined-room": (room: string) => void;
	"question-change": (
		player: "player1" | "player2",
		score: number,
		attempts: number,
		guess: string
	) => void;
	"opponent-disconnected": () => void;
	"join-room-error": () => void;
	"opponent-play-again": () => void;
	"play-again": () => void;
	"game-starts-in": (startsIn: number) => void;
	"game-started": () => void;
	"game-ended": () => void;
	"round-ends-in": (startsIn: number) => void;
	"round-ended": () => void;
	"create-question": (question: CurrentQuestion) => void;
}

export interface ClientToServerEvents {
	"play-again": () => void;
	"question-change": (score: number, attempts: number, guess: string) => void;
	"create-room": (
		regions: GamemodeRegion,
		time: GamemodeTime,
		amount: GameModeAmount
	) => void;
	"join-room": (room: string) => void;
	"leave-room": () => void;
}

export type PlayerState = {
	id: string;
	score: number;
	attempts: number;
	mistakes: number;
	name?: string;
	playAgain?: boolean;
	disconnected?: boolean;
	result?: CurrentQuestion[];
	answered?: boolean;
	guess?: string | null;
};

export type OneVersusOneStateType = {
	question?: CurrentQuestion;
	gameState?: "win" | "tie" | "lost" | null;
	players: {
		player1: PlayerState;
		player2?: PlayerState;
	};
	gameOptions?: {
		regions: GamemodeRegion;
		time: GamemodeTime;
		amount: GameModeAmount;
	};
};
export type GamemodeRegion = ("AF" | "AS" | "EU" | "NA" | "OC" | "SA")[];
export type GamemodeTime = 15 | 30 | 60 | 120;
export type GameModeAmount = 10 | 25 | 50 | 100 | 150 | 197;

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
