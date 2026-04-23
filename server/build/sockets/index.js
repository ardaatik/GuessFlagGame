"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const helpers_1 = require("./helpers");
function configure(s) {
    const io = new socket_io_1.Server(s, {
        cors: {
            origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : "",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true,
        },
    });
    const clientRooms = {};
    const roomState = {};
    io.use((socket, next) => {
        next();
    });
    io.on("connection", (socket) => {
        socket.on("create-room", (regions, time, amount) => {
            const roomCode = (0, helpers_1.generateCode)(6);
            clientRooms[socket.id] = roomCode;
            roomState[roomCode] = {
                gameOptions: {
                    regions,
                    time,
                    amount,
                },
                players: {
                    player1: {
                        id: socket.id,
                        score: 0,
                        attempts: 0,
                        mistakes: 0,
                        answered: false,
                        guess: null,
                    },
                },
            };
            socket.join(roomCode);
            socket.emit("has-joined-room", roomCode);
            io.to(roomCode).emit("room-state", roomState[roomCode]);
        });
        socket.on("join-room", (roomCode) => {
            if (!roomState.hasOwnProperty(roomCode)) {
                socket.emit("join-room-error");
                return;
            }
            const gameOptions = roomState[roomCode].gameOptions;
            const questionData = (0, helpers_1.createQuestion)(roomCode, gameOptions === null || gameOptions === void 0 ? void 0 : gameOptions.regions);
            clientRooms[socket.id] = roomCode;
            roomState[roomCode] = Object.assign(Object.assign({}, roomState[roomCode]), { question: questionData, players: Object.assign(Object.assign({}, roomState[roomCode].players), { player2: {
                        id: socket.id,
                        score: 0,
                        attempts: 0,
                        mistakes: 0,
                        answered: false,
                        guess: null,
                    } }) });
            socket.join(roomCode);
            socket.emit("has-joined-room", roomCode);
            (0, helpers_1.startCountdown)(roomCode, io, gameOptions === null || gameOptions === void 0 ? void 0 : gameOptions.time, questionData);
            // Emit the room state
            io.to(roomCode).emit("room-state", roomState[roomCode]);
        });
        socket.on("question-change", ({ score, attempts, guess, }) => {
            const roomCode = clientRooms[socket.id];
            if (!roomCode || !roomState[roomCode]) {
                return;
            }
            const gameOptions = roomState[roomCode].gameOptions;
            const player = roomState[roomCode].players.player1.id === socket.id
                ? "player1"
                : "player2";
            roomState[roomCode].players[player] = {
                id: roomState[roomCode].players[player].id,
                score: score,
                attempts: attempts,
                mistakes: attempts - score,
                answered: true,
            };
            socket.broadcast
                .to(roomCode)
                .emit("question-change", player, score, attempts, guess);
            if (
            // If both players have answered, generate a new question
            roomState[roomCode].players.player1.answered &&
                roomState[roomCode].players.player2.answered) {
                const currentPlayerState = roomState[roomCode].players[player];
                const opponentPlayerState = roomState[roomCode].players[player === "player1" ? "player2" : "player1"];
                const gameState = (0, helpers_1.getGameState)(currentPlayerState, opponentPlayerState, gameOptions === null || gameOptions === void 0 ? void 0 : gameOptions.amount);
                (0, helpers_1.clearRoomInterval)(roomCode);
                (0, helpers_1.clearCountdownInterval)(roomCode); // TODO should only be cleared first round of game...
                if (gameState) {
                    // When game ends, delete question array and clear timer interval
                    (0, helpers_1.deleteAvailableCountriesByRoomId)(roomCode);
                    io.to(roomCode).emit("game-ended");
                }
                else {
                    const questionData = (0, helpers_1.createQuestion)(roomCode, gameOptions === null || gameOptions === void 0 ? void 0 : gameOptions.regions);
                    roomState[roomCode].question = questionData;
                    // Reset the answered flags for both players
                    roomState[roomCode].players.player1.answered = false;
                    roomState[roomCode].players.player2.answered = false;
                    (0, helpers_1.startTimer)(roomCode, io, gameOptions === null || gameOptions === void 0 ? void 0 : gameOptions.time, questionData);
                }
            }
        });
        const handleRoomDisconnect = () => {
            const roomCode = clientRooms[socket.id];
            if (!roomCode || !roomState[roomCode]) {
                return;
            }
            delete clientRooms[socket.id];
            (0, helpers_1.clearRoomInterval)(roomCode);
            (0, helpers_1.clearCountdownInterval)(roomCode);
            const player = roomState[roomCode].players.player1.id === socket.id
                ? "player1"
                : "player2";
            const opponentPlayerState = roomState[roomCode].players[player === "player1" ? "player2" : "player1"];
            if (!opponentPlayerState || (opponentPlayerState === null || opponentPlayerState === void 0 ? void 0 : opponentPlayerState.disconnected)) {
                delete roomState[roomCode];
            }
            else {
                roomState[roomCode].players[player].disconnected = true;
                io.to(opponentPlayerState.id).emit("opponent-disconnected");
            }
        };
        socket.on("play-again", () => {
            var _a;
            const roomCode = clientRooms[socket.id];
            if (!roomCode || !roomState.hasOwnProperty(roomCode)) {
                console.error("room doesn't exist");
                return;
            }
            let state = roomState[roomCode];
            const gameOptions = state.gameOptions;
            const questionData = (0, helpers_1.createQuestion)(roomCode, gameOptions === null || gameOptions === void 0 ? void 0 : gameOptions.regions);
            const player = state.players.player1.id === socket.id ? "player1" : "player2";
            const opponentPlayer = player === "player1" ? "player2" : "player1";
            const opponentPlayerState = roomState[roomCode].players[opponentPlayer];
            if ((_a = state.players[opponentPlayer]) === null || _a === void 0 ? void 0 : _a.playAgain) {
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
                            id: state.players.player2.id,
                            score: 0,
                            attempts: 0,
                            mistakes: 0,
                            answered: false,
                        },
                    },
                };
                io.to(roomCode).emit("play-again");
                (0, helpers_1.startCountdown)(roomCode, io, gameOptions === null || gameOptions === void 0 ? void 0 : gameOptions.time, questionData);
                io.to(roomCode).emit("room-state", roomState[roomCode]);
            }
            else {
                roomState[roomCode].players[player].playAgain = true;
                io.to(opponentPlayerState.id).emit("opponent-play-again");
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
exports.default = configure;
