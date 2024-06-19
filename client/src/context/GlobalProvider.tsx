import socket from "@/socket";
import { CurrentQuestion } from "@/types";
import React, { ReactNode, useState } from "react";
import {
	GlobalContextInterface,
	GlobalContextValues,
} from "../data/defaultValues";
import useSocketListeners from "../hook/useSocketListeners";

export const GlobalContext =
	React.createContext<GlobalContextInterface>(GlobalContextValues);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
	const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
	// TODO Set the mistaken questions into the room state instead
	const [mistakenQuestions, setMistakenQuestions] = useState<CurrentQuestion[]>(
		[]
	);
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [gameEnded, setGameEnded] = useState<boolean>(false);
	const {
		room,
		setRoom,
		roomState,
		setRoomState,
		timer,
		setTimer,
		selectedAnswer,
		setSelectedAnswer,
		currentPlayer,
		opponentPlayer,
	} = useSocketListeners(socket);

	const currentPlayerState = roomState?.players[currentPlayer];
	const opponentPlayerState = roomState?.players[opponentPlayer];

	// 3. Pick an option and check if option is the answer
	const guessTheAnswer = (guess: string) => {
		const isCorrectGuess = guess === roomState?.question?.answer;

		let newMistakenQuestions = mistakenQuestions;

		if (!isCorrectGuess) {
			newMistakenQuestions = [...mistakenQuestions, roomState?.question!];
			setMistakenQuestions(newMistakenQuestions);
		}

		setRoomState((prevRoomState) => {
			if (!prevRoomState || !prevRoomState.players[currentPlayer]) return null;

			const currentPlayerState = prevRoomState.players[currentPlayer]!;

			const newAttempts = currentPlayerState.attempts + 1;
			const newScore = isCorrectGuess
				? currentPlayerState.score + 1
				: currentPlayerState.score;
			const newMistakes = newAttempts - newScore;

			const updatedRoomState = {
				...prevRoomState,
				players: {
					...prevRoomState.players,
					[currentPlayer]: {
						...prevRoomState.players[currentPlayer]!,
						score: newScore,
						attempts: newAttempts,
						mistakes: newMistakes,
						answered: true,
					},
				},
			};

			console.log("newScore", newScore, "newAttempts", newAttempts);
			socket.emit("question-change", {
				score: newScore,
				attempts: newAttempts,
			});

			return updatedRoomState;
		});
	};

	const resetTheGame = () => {
		setMistakenQuestions([]);
		setGameStarted(false);
		setGameEnded(false);
		setSelectedAnswer(null);
	};

	return (
		<GlobalContext.Provider
			value={{
				room,
				setRoom,
				timer,
				setTimer,
				gameStarted,
				setGameStarted,
				isSocketConnected,
				setIsSocketConnected,
				roomState,
				setRoomState,
				gameEnded,
				setGameEnded,
				selectedAnswer,
				setSelectedAnswer,
				mistakenQuestions,
				currentPlayer,
				opponentPlayer,
				currentPlayerState,
				opponentPlayerState,
				guessTheAnswer,
				resetTheGame,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export default GlobalProvider;
