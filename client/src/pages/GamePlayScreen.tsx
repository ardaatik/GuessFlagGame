import Lobby from "@/component/Multiplayer/Lobby";
import CardContainer from "@/component/UI/CardContainer";
import socket from "@/socket";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameResult from "../component/Multiplayer/GameResult";
import Gameplay from "../component/Multiplayer/Gameplay";
import ScoreBoard from "../component/Multiplayer/ScoreBoard";
import { GlobalContext } from "../context/GlobalProvider";

const GamePlayScreen = () => {
	const {
		room,
		setRoom,
		resetTheGame,
		mistakenQuestions,
		currentPlayerState,
		opponentPlayerState,
		setRoomState,
		currentPlayer,
		guessTheAnswer,
		gameEnded,
		setGameEnded,
		gameStarted,
		setGameStarted,
		setTimer,
		timer,
		roomState,
		selectedAnswer,
		setSelectedAnswer,
	} = useContext(GlobalContext);
	const navigate = useNavigate();
	const [startsInSeconds, setStartsInSeconds] = useState<number | null>(null);
	const isAnswered = currentPlayerState?.answered;
	const isAnsweredOpponent = opponentPlayerState?.answered;
	const opponentGuess = opponentPlayerState?.guess!;
	const gameDuration = (roomState?.gameOptions?.time ?? 60000) / 1000;

	useEffect(() => {
		const onPlayAgain = () => {
			resetTheGame();
		};

		const onGameStarted = () => {
			setStartsInSeconds(0);
			setTimeout(() => {
				setGameStarted(true);
			}, 1500);
		};

		const onGameEnded = () => {
			setGameEnded(true);
		};

		const onGameStartsIn = (ms: number) => {
			setStartsInSeconds(Math.max(Math.ceil(ms / 1000), 1));
		};

		const onRoundEndsIn = (ms: number) => {
			if (isAnswered && isAnsweredOpponent) return;
			setTimer(Math.max(Math.ceil(ms / 1000), 1));
		};

		const onRoundEnded = () => {
			setTimer(0);
			console.log("round ended", isAnswered, gameEnded);
			if (!isAnswered && !gameEnded) {
				setSelectedAnswer("");
				guessTheAnswer("");
			}
		};

		socket.on("play-again", onPlayAgain);
		socket.on("game-started", onGameStarted);
		socket.on("game-ended", onGameEnded);
		socket.on("game-starts-in", onGameStartsIn);
		socket.on("round-ended", onRoundEnded);
		socket.on("round-ends-in", onRoundEndsIn);

		return () => {
			socket.off("play-again", onPlayAgain);
			socket.off("game-started", onGameStarted);
			socket.off("game-ended", onGameEnded);
			socket.off("game-starts-in", onGameStartsIn);
			socket.off("round-ended", onRoundEnded);
			socket.off("round-ends-in", onRoundEndsIn);
		};
	}, [currentPlayerState, isAnswered, isAnsweredOpponent]);

	useEffect(() => {
		if (room === "" || !room) {
			navigate("/");
		}
		return () => {
			onLeaveRoom();
		};
	}, []);

	const handlePlayAgain = useCallback(() => {
		socket.emit("play-again");

		setRoomState((state) => {
			if (!state) return null;

			return {
				...state,
				players: {
					...state.players,
					[currentPlayer]: { ...state.players[currentPlayer], playAgain: true },
				},
			};
		});
	}, [currentPlayer]);

	const createArrayOfMistake = useMemo(
		() => (mistake: number) => {
			return Array(3)
				.fill(true)
				.map((_, i) => (mistake > i ? false : true));
		},
		[opponentPlayerState?.score]
	);

	const onLeaveRoom = () => {
		console.log("leaving room");
		resetTheGame();
		setRoomState(null); // causes flicker if opponentState.disconnected is true and the player leaves
		socket.emit("leave-room");
		setRoom("");
		navigate("/");
	};

	const onGameButton = (answer: string) => {
		if (isAnswered) return;
		setSelectedAnswer(answer);
		guessTheAnswer(answer);
	};

	return opponentPlayerState ? (
		<>
			{gameEnded || opponentPlayerState.disconnected ? (
				<GameResult
					createArrayOfMistake={createArrayOfMistake}
					mistakenQuestions={mistakenQuestions}
					currentPlayerState={currentPlayerState}
					opponentPlayerState={opponentPlayerState}
					handlePlayAgain={handlePlayAgain}
				/>
			) : (
				<CardContainer>
					<ScoreBoard
						startsInSeconds={startsInSeconds}
						currentPlayerState={currentPlayerState}
						opponentPlayerState={opponentPlayerState}
						createArrayOfMistake={createArrayOfMistake}
						timer={timer}
						gameDuration={gameDuration}
						gameStarted={gameStarted}
					/>
					<Gameplay
						gameStarted={gameStarted}
						isAnswered={isAnswered}
						isAnsweredOpponent={isAnsweredOpponent}
						onGameButton={onGameButton}
						currentQuestion={roomState?.question!}
						selectedAnswer={selectedAnswer}
						opponentGuess={opponentGuess}
					/>
				</CardContainer>
			)}
		</>
	) : (
		<Lobby room={room} />
	);
};

export default GamePlayScreen;
