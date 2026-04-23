"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameState = exports.createQuestion = exports.deleteAvailableCountriesByRoomId = exports.startTimer = exports.clearRoomInterval = exports.startCountdown = exports.clearCountdownInterval = exports.generateCode = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const countriesByRegion = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../../data/countries.json"), "utf-8"));
function generateCode(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let output = "";
    for (let i = 0; i < length; i++) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        output += randomChar;
    }
    return output;
}
exports.generateCode = generateCode;
const countdownIntervals = {};
const roomIntervals = {};
// Function to clear the interval for a room
const clearCountdownInterval = (roomCode) => {
    if (countdownIntervals[roomCode]) {
        clearInterval(countdownIntervals[roomCode]);
        delete countdownIntervals[roomCode]; // Remove the interval ID from the object
    }
};
exports.clearCountdownInterval = clearCountdownInterval;
// Updated startCountdown function
function startCountdown(roomCode, io, duration = 60000, question) {
    const startsIn = 5000;
    const startsAt = new Date().getTime() + startsIn;
    io.to(roomCode).emit("game-starts-in", startsIn);
    // Clear any existing interval for this room before setting a new one
    (0, exports.clearCountdownInterval)(roomCode);
    const interval = setInterval(() => {
        const remaining = startsAt - new Date().getTime();
        if (remaining > 0) {
            io.to(roomCode).emit("game-starts-in", remaining);
        }
        else {
            io.to(roomCode).emit("game-started");
            startTimer(roomCode, io, duration, question);
            (0, exports.clearCountdownInterval)(roomCode); // Clear the interval when countdown ends
        }
    }, 1000);
    // Set the new interval for the room
    countdownIntervals[roomCode] = interval;
}
exports.startCountdown = startCountdown;
const clearRoomInterval = (roomCode) => {
    if (roomIntervals[roomCode]) {
        clearInterval(roomIntervals[roomCode]);
        delete roomIntervals[roomCode]; // Remove the interval ID from the object
    }
};
exports.clearRoomInterval = clearRoomInterval;
function startTimer(roomCode, io, duration = 60000, question) {
    // Clear the previous timer for the room, if it exists
    if (roomIntervals[roomCode]) {
        clearInterval(roomIntervals[roomCode]);
    }
    const startsAt = new Date().getTime() + duration + 1000; // Add 1000 ms for the initial delay
    io.to(roomCode).emit("round-ends-in", duration + 1000); // Adjust for the initial 1-second delay
    let isFirstRun = true;
    const interval = setInterval(() => {
        const remaining = startsAt - new Date().getTime();
        if (isFirstRun) {
            io.to(roomCode).emit("create-question", question);
            isFirstRun = false;
            // Adjust the first "round-ends-in" emission to account for the now reduced duration
            io.to(roomCode).emit("round-ends-in", remaining);
        }
        else if (remaining > 0) {
            io.to(roomCode).emit("round-ends-in", remaining);
        }
        else {
            io.to(roomCode).emit("round-ended");
            clearInterval(interval);
        }
    }, 1000);
    // Store the interval ID for the room's timer
    roomIntervals[roomCode] = interval;
}
exports.startTimer = startTimer;
let availableCountriesPerRoom = {};
function deleteAvailableCountriesByRoomId(roomId) {
    delete availableCountriesPerRoom[roomId];
}
exports.deleteAvailableCountriesByRoomId = deleteAvailableCountriesByRoomId;
function createQuestion(roomId, regions = ["AF", "AS", "EU", "NA", "OC", "SA"]) {
    // Initialize the available countries for this room if not already done
    if (!availableCountriesPerRoom[roomId]) {
        const newListOfCountries = [];
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
    // Pick four random countries for the options
    let options = [];
    while (options.length < 4) {
        const optionIndex = Math.floor(Math.random() * availableCountriesPerRoom[roomId].options.length);
        const option = availableCountriesPerRoom[roomId].options[optionIndex];
        // Make sure the option has not been picked before
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    // Pick a random country for the correct answer
    let answer;
    let answerIndex;
    do {
        answerIndex = Math.floor(Math.random() * availableCountriesPerRoom[roomId].answers.length);
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
exports.createQuestion = createQuestion;
const getGameState = (currentPlayerState, opponentPlayerState, amountOfQuestions = 25) => {
    if (!currentPlayerState || !opponentPlayerState) {
        return false;
    }
    const haveBothPlayersAttempted = currentPlayerState.attempts === opponentPlayerState.attempts;
    const hasPlayerReachedMaxMistakes = currentPlayerState.mistakes === 3 || opponentPlayerState.mistakes === 3;
    const haveBothPlayersAnsweredAllQuestions = currentPlayerState.attempts === amountOfQuestions &&
        opponentPlayerState.attempts === amountOfQuestions;
    // game is ended if returned true
    return ((haveBothPlayersAttempted && hasPlayerReachedMaxMistakes) ||
        haveBothPlayersAnsweredAllQuestions);
};
exports.getGameState = getGameState;
