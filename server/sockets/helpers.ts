import fs from "fs";
import path from "path";
import { Server } from "socket.io";
import { Country } from "../../client/src/types";
import {
	ClientToServerEvents,
	GamemodeRegion,
	PlayerState,
	ServerToClientEvents,
} from "../../typings";

const countriesByRegion: any = JSON.parse(
	fs.readFileSync(
		path.resolve(__dirname, "../../client/src/data/countries.json"),
		"utf-8"
	)
);

export function generateCode(length: number) {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	let output = "";
	for (let i = 0; i < length; i++) {
		const randomChar = chars[Math.floor(Math.random() * chars.length)];
		output += randomChar;
	}
	return output;
}

export function startCountdown(
	roomCode: string,
	io: Server<ClientToServerEvents, ServerToClientEvents>,
	duration: number = 60000
) {
	const startsIn = 5000;

	const startsAt = new Date().getTime() + startsIn;

	io.to(roomCode).emit("game-starts-in", startsIn);
	const interval = setInterval(() => {
		const remaining = startsAt - new Date().getTime();

		if (remaining > 0) {
			io.to(roomCode).emit("game-starts-in", remaining);
		} else {
			io.to(roomCode).emit("game-started");
			console.log("Game started");
			startTimer(roomCode, io, duration);
			clearInterval(interval);
		}
	}, 1000);
}

const roomIntervals: { [roomCode: string]: NodeJS.Timeout } = {};

export const getRoomInterval = (roomCode: string) => {
	return roomIntervals[roomCode];
};

export function startTimer(
	roomCode: string,
	io: Server<ClientToServerEvents, ServerToClientEvents>,
	duration: number = 60000
) {
	// Clear the previous timer for the room, if it exists
	if (roomIntervals[roomCode]) {
		clearInterval(roomIntervals[roomCode]);
	}

	const startsAt = new Date().getTime() + duration;
	console.log("Timer started");
	io.to(roomCode).emit("round-ends-in", duration);
	const interval = setInterval(() => {
		const remaining = startsAt - new Date().getTime();

		if (remaining > 0) {
			io.to(roomCode).emit("round-ends-in", remaining);
		} else {
			io.to(roomCode).emit("round-ended");
			clearInterval(interval);
		}
	}, 1000);

	// Store the interval ID for the room's timer
	roomIntervals[roomCode] = interval;
}
interface RoomCountries {
	options: Country[];
	answers: Country[];
}
let availableCountriesPerRoom: Record<string, RoomCountries> = {};

export function deleteAvailableCountriesByRoomId(roomId: string): void {
	delete availableCountriesPerRoom[roomId];
}

export function createQuestion(
	roomId: string,
	regions: GamemodeRegion = ["AF", "AS", "EU", "NA", "OC", "SA"]
) {
	// Initialize the available countries for this room if not already done
	if (!availableCountriesPerRoom[roomId]) {
		const newListOfCountries: Country[] = [];

		regions.forEach((currentRegion) => {
			const countries = countriesByRegion[currentRegion];
			if (Array.isArray(countries)) {
				newListOfCountries.push(...countries);
			}
		});

		availableCountriesPerRoom[roomId] = {
			options: [...newListOfCountries],
			answers: [...newListOfCountries],
		};
	}

	console.log(availableCountriesPerRoom[roomId]);

	// Pick four random countries for the options
	let options: Country[] = [];
	while (options.length < 4) {
		const optionIndex = Math.floor(
			Math.random() * availableCountriesPerRoom[roomId].options.length
		);
		const option = availableCountriesPerRoom[roomId].options[optionIndex];

		// Make sure the option has not been picked before
		if (!options.includes(option)) {
			options.push(option);
		}
	}

	// Pick a random country for the correct answer
	let answer: Country;
	let answerIndex: number;
	do {
		answerIndex = Math.floor(
			Math.random() * availableCountriesPerRoom[roomId].answers.length
		);
		answer = availableCountriesPerRoom[roomId].answers[answerIndex];
	} while (options.includes(answer));

	// Remove the chosen answer from the available answers for this room
	availableCountriesPerRoom[roomId].answers.splice(answerIndex, 1);

	// If the options do not include the answer, replace a random option with the answer
	if (!options.map((option) => option.name).includes(answer.name)) {
		const replaceIndex = Math.floor(Math.random() * options.length);
		options[replaceIndex] = answer;
	}

	// Map the options to their names and return the question data
	const optionsNames = options.map((option) => option.name);
	return {
		answer: answer.name,
		options: optionsNames,
		flagUrl: answer.code.toLowerCase(),
	};
}

export const getGameState = (
	currentPlayerState: PlayerState | undefined,
	opponentPlayerState: PlayerState | undefined,
	amountOfQuestions: number = 25
): boolean => {
	if (!currentPlayerState || !opponentPlayerState) {
		return false;
	}

	const haveBothPlayersAttempted =
		currentPlayerState.attempts === opponentPlayerState.attempts;
	const hasPlayerReachedMaxMistakes =
		currentPlayerState.mistakes === 3 || opponentPlayerState.mistakes === 3;
	const haveBothPlayersAnsweredAllQuestions =
		currentPlayerState.attempts === amountOfQuestions &&
		opponentPlayerState.attempts === amountOfQuestions;

	// game is ended if returned true
	return (
		(haveBothPlayersAttempted && hasPlayerReachedMaxMistakes) ||
		haveBothPlayersAnsweredAllQuestions
	);
};
