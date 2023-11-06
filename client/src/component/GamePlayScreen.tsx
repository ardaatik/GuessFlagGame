import Gameplay from "./Gameplay";
import { useContext, useEffect, useMemo } from "react";
import { GlobalContext } from "../context/GlobalProvider";
import ScoreBoard from "./ScoreBoard";
import GameResult from "./GameResult";
import { useNavigate } from "react-router-dom";

const GamePlayScreen = () => {
	const {
		opponentsName,
		socket,
		name,
		room,
		resetTheGame,
		initGameRound,
		mistakes,
		results,
		opponentsScore,
		opponentsAttempts,
		isGameLost,
		isGameWon,
		mistakenQuestions,
	} = useContext(GlobalContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!name) {
			navigate("/");
		} else {
			// console.log(room, "logging room from UseEffect");
			resetTheGame();
			initGameRound();
			// console.log("sending name again !!");
			socket.emit("clientName", name, room);
		}
	}, []);

	const createArrayOfMistake = useMemo(
		() => (mistake: number) => {
			return Array(3)
				.fill(true)
				.map((_, i) => (mistake > i ? false : true));
		},
		[opponentsScore]
	);

	return opponentsName ? (
		<>
			{isGameLost ? (
				<GameResult
					IsGameWon={isGameWon}
					score={results.score}
					opponentsScore={opponentsScore}
					restartGame={resetTheGame}
					opponentsAttempts={opponentsAttempts}
					createArrayOfMistake={createArrayOfMistake}
					mistakenQuestions={mistakenQuestions}
				/>
			) : (
				<>
					<ScoreBoard
						mistakes={mistakes}
						name={name}
						score={results.score}
						opponentsName={opponentsName}
						opponentsScore={opponentsScore}
						opponentsAttempts={opponentsAttempts}
						createArrayOfMistake={createArrayOfMistake}
					/>
					<Gameplay />
				</>
			)}
		</>
	) : (
		<></>
	);
};

export default GamePlayScreen;
