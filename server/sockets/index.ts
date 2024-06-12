import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import {
	ClientToServerEvents,
	GameModeAmount,
	GamemodeRegion,
	GamemodeTime,
	OneVersusOneStateType,
	ServerToClientEvents,
} from "../../typings";
import {
	createQuestion,
	deleteAvailableCountriesByRoomId,
	generateCode,
	getGameState,
	getRoomInterval,
	startCountdown,
	startTimer,
} from "./helpers";

export default function configure(s: HttpServer) {
	const io = new Server<ClientToServerEvents, ServerToClientEvents>(s, {
		cors: {
			origin: "http://localhost:5173",
			methods: ["GET", "POST"],
			allowedHeaders: ["my-custom-header"],
			credentials: true,
		},
	});

	const clientRooms: { [key: string]: string } = {};
	const roomState: { [key: string]: OneVersusOneStateType } = {};
	io.use((socket, next) => {
		next();
	});

	io.on("connection", (socket: Socket) => {
		socket.on(
			"create-room",
			(regions: GamemodeRegion, time: GamemodeTime, amount: GameModeAmount) => {
				const roomCode = generateCode(6);

				clientRooms[socket.id] = roomCode;
				console.log("rooms: ", clientRooms);

				roomState[roomCode] = {
					gameOptions: {
						regions,
						time,
						amount,
					},
					players: {
						player1: { id: socket.id, score: 0, attempts: 0, mistakes: 0 },
					},
				};
				console.log(roomState[roomCode]);

				socket.join(roomCode);
				socket.emit("has-joined-room", roomCode);
				io.to(roomCode).emit("room-state", roomState[roomCode]);
			}
		);

		socket.on("join-room", (roomCode: string) => {
			if (!roomState.hasOwnProperty(roomCode)) {
				socket.emit("join-room-error");
				return;
			}

			const gameOptions = roomState[roomCode].gameOptions;
			const questionData = createQuestion(roomCode, gameOptions?.regions);

			clientRooms[socket.id] = roomCode;
			roomState[roomCode] = {
				...roomState[roomCode],
				question: questionData,
				players: {
					...roomState[roomCode].players,
					player2: {
						id: socket.id,
						score: 0,
						attempts: 0,
						mistakes: 0,
					},
				},
			};
			socket.join(roomCode);
			socket.emit("has-joined-room", roomCode);
			startCountdown(roomCode, io, gameOptions?.time);
			// Emit the room state
			io.to(roomCode).emit("room-state", roomState[roomCode]);
		});

		socket.on(
			"question-change",
			({ score, attempts }: { score: number; attempts: number }) => {
				const roomCode = clientRooms[socket.id];

				if (!roomCode || !roomState[roomCode]) {
					return;
				}

				const gameOptions = roomState[roomCode].gameOptions;
				const player =
					roomState[roomCode].players.player1.id === socket.id
						? "player1"
						: "player2";

				roomState[roomCode].players[player] = {
					id: roomState[roomCode].players[player]!.id,
					score: score,
					attempts: attempts,
					mistakes: attempts - score,
					answered: true,
				};

				socket.broadcast
					.to(roomCode)
					.emit("question-change", player, score, attempts);
				if (
					// If both players have answered, generate a new question
					roomState[roomCode].players.player1.answered &&
					roomState[roomCode].players.player2!.answered
				) {
					const currentPlayerState = roomState[roomCode].players[player];
					const opponentPlayerState =
						roomState[roomCode].players[
							player === "player1" ? "player2" : "player1"
						];

					const gameState = getGameState(
						currentPlayerState,
						opponentPlayerState,
						gameOptions?.amount
					);
					console.log("gameState: ", gameState);
					if (gameState) {
						// When game ends, delete question array and clear timer interval
						deleteAvailableCountriesByRoomId(roomCode);
						clearInterval(getRoomInterval(roomCode));
						io.to(roomCode).emit("game-ended");
					} else {
						const newQuestion = createQuestion(roomCode, gameOptions?.regions);
						roomState[roomCode].question = newQuestion;
						// Reset the answered flags for both players
						roomState[roomCode].players.player1.answered = false;
						roomState[roomCode].players.player2!.answered = false;

						io.to(roomCode).emit("room-state", roomState[roomCode]);
						startTimer(roomCode, io, gameOptions?.time);
					}
				}
			}
		);

		const handleRoomDisconnect = () => {
			const roomCode = clientRooms[socket.id];

			if (!roomCode || !roomState[roomCode]) {
				return;
			}
			console.log("rooms: ", clientRooms);
			delete clientRooms[socket.id];
			clearInterval(getRoomInterval(roomCode));

			const player =
				roomState[roomCode].players.player1.id === socket.id
					? "player1"
					: "player2";

			const opponentPlayerState =
				roomState[roomCode].players[
					player === "player1" ? "player2" : "player1"
				];

			if (!opponentPlayerState || opponentPlayerState?.disconnected) {
				delete roomState[roomCode];
			} else {
				roomState[roomCode].players[player]!.disconnected = true;
				io.to(opponentPlayerState.id).emit("opponent-disconnected");
			}
		};

		socket.on("play-again", () => {
			const roomCode = clientRooms[socket.id];
			if (!roomCode || !roomState.hasOwnProperty(roomCode)) {
				console.error("room doesn't exist");
				return;
			}

			let state = roomState[roomCode];
			const gameOptions = state.gameOptions;

			const questionData = createQuestion(roomCode, gameOptions?.regions);

			const player =
				state.players.player1.id === socket.id ? "player1" : "player2";

			const opponentPlayer = player === "player1" ? "player2" : "player1";
			const opponentPlayerState = roomState[roomCode].players[opponentPlayer];

			console.log("LOGGING STATE", state);

			if (state.players[opponentPlayer]?.playAgain) {
				roomState[roomCode] = {
					gameOptions: gameOptions,
					question: questionData,
					players: {
						player1: {
							id: state.players.player1.id,
							score: 0,
							attempts: 0,
							mistakes: 0,
							answered: false,
						},
						player2: {
							id: state.players.player2!.id,
							score: 0,
							attempts: 0,
							mistakes: 0,
							answered: false,
						},
					},
				};
				console.log("roomState: ", roomState[roomCode]);

				io.to(roomCode).emit("play-again");
				startCountdown(roomCode, io, gameOptions?.time);
				io.to(roomCode).emit("room-state", roomState[roomCode]);
			} else {
				roomState[roomCode].players[player]!.playAgain = true;
				io.to(opponentPlayerState!.id).emit("opponent-play-again");
			}
		});

		socket.on("leave-room", handleRoomDisconnect);
		socket.on("disconnect", () => {
			console.log("Disconnected: ", socket.id);
			handleRoomDisconnect();
		});
	});

	s.listen(3000, () => {
		console.log(`Server running on port 3000`);
	});
}
