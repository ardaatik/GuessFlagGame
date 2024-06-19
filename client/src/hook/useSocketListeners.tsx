import { CurrentQuestion } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import {
	ClientToServerEvents,
	OneVersusOneStateType,
	ServerToClientEvents,
} from "../../../typings";
import useLocalStorageState from "./useLocalStorageState";

type PlayerKey = "player1" | "player2";

function useSocketListeners(
	socket: Socket<ServerToClientEvents, ClientToServerEvents>
) {
	const navigate = useNavigate();
	const [room, setRoom] = useState("");
	const [roomState, setRoomState] = useState<OneVersusOneStateType | null>(
		null
	);
	const [timer, setTimer] = useLocalStorageState("gamemode-timer", 60);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

	const currentPlayer: PlayerKey = useMemo(() => {
		return roomState?.players.player1?.id === socket.id ? "player1" : "player2";
	}, [roomState?.players.player1?.id]);

	const opponentPlayer: PlayerKey = useMemo(
		() => (currentPlayer === "player1" ? "player2" : "player1"),
		[currentPlayer]
	);

	useEffect(() => {
		const roomStateListener = (roomState: OneVersusOneStateType) => {
			console.log("updating room state: ", roomState);
			setRoomState(roomState);
			setTimer((roomState?.gameOptions?.time ?? 60000) / 1000);
		};

		const hasJoinedRoomListener = (room: string) => {
			setRoom(room);
			navigate(`/start/${room}`);
		};

		const questionChangeListener = (
			player: "player1" | "player2",
			score: number,
			attempts: number
		) => {
			setRoomState((state) => {
				if (!state) return null;

				return {
					...state,
					players: {
						...state.players,
						[player]: {
							...state.players[player],
							score,
							attempts,
							mistakes: attempts - score,
							answered: true,
						},
					},
				};
			});
		};

		const opponentDisconnectedListener = () => {
			setRoomState((state) => {
				if (!state) return null;

				return {
					...state,
					players: {
						...state.players,
						[opponentPlayer]: {
							...state.players[opponentPlayer],
							disconnected: true,
						},
					},
				};
			});
			console.log(socket.id, "opponent disconnected");
		};

		const handleOpponentPlayAgain = () => {
			setRoomState((state) => {
				if (!state) return null;

				return {
					...state,
					players: {
						...state.players,
						[opponentPlayer]: {
							...state.players[opponentPlayer],
							playAgain: true,
						},
					},
				};
			});
		};

		const handleCreateQuestion = (question: CurrentQuestion) => {
			setSelectedAnswer(null);
			setRoomState((state) => {
				if (!state) return null;

				// Ensure players exist before setting their 'answered' property
				console.log("creating question", state);

				if (state?.players?.player1) {
					state.players.player1.answered = false;
				}
				if (state?.players?.player2) {
					state.players.player2.answered = false;
				}
				console.log("created question", state);

				return {
					...state,
					question,
				};
			});
		};
		socket.on("opponent-play-again", handleOpponentPlayAgain);
		socket.on("opponent-disconnected", opponentDisconnectedListener);
		socket.on("question-change", questionChangeListener);
		socket.on("room-state", roomStateListener);
		socket.on("has-joined-room", hasJoinedRoomListener);
		socket.on("create-question", handleCreateQuestion);
		return () => {
			socket.off("opponent-play-again", handleOpponentPlayAgain);
			socket.off("opponent-disconnected", opponentDisconnectedListener);
			socket.off("question-change", questionChangeListener);
			socket.off("room-state", roomStateListener);
			socket.off("has-joined-room", hasJoinedRoomListener);
			socket.off("create-question", handleCreateQuestion);
		};
	}, [socket, opponentPlayer, currentPlayer]);

	return {
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
	};
}

export default useSocketListeners;
