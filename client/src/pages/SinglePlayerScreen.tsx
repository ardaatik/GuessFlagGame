import Header from "@/component/Header";
import Gameplay from "@/component/Multiplayer/Gameplay";
import CardContainer from "@/component/UI/CardContainer";
import { GameModeContext } from "@/context/GameModeProvider";
import { SinglePlayerContext } from "@/context/SinglePlayerProvider";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SinglePlayerResults from "../component/Singleplayer/SinglePlayerResults";
import styles from "../style/scss/SinglePlayerScreen.module.scss";

const SinglePlayerScreen = () => {
	const navigate = useNavigate();
	const {
		resetSinglePlayer,
		results,
		currentQuestion,
		setSelectedAnswer,
		selectedAnswer,
		guessTheAnswer,
		initGameRound,
		mistakenQuestions,
	} = useContext(SinglePlayerContext);
	const { amount } = useContext(GameModeContext);

	useEffect(() => {
		resetSinglePlayer();
		initGameRound();
		return () => {
			resetSinglePlayer();
		};
	}, []);

	const navigateToMainMenu = () => {
		navigate("/");
	};

	const onGameButton = (answer: string) => {
		setSelectedAnswer(answer);
		guessTheAnswer(answer);
	};

	return (
		<CardContainer>
			{results.attempts === amount ? (
				<SinglePlayerResults
					score={results.score}
					attempts={results.attempts}
					navigateToMainMenu={navigateToMainMenu}
					resetTheGame={resetSinglePlayer}
					mistakenQuestions={mistakenQuestions}
				/>
			) : (
				<>
					<Header
						title={`Score : ${results.score} / ${amount}`}
						className={styles.singlePlayerScoreBoardContainer}
						variant="1"
					/>
					<Gameplay
						onGameButton={onGameButton}
						selectedAnswer={selectedAnswer}
						currentQuestion={currentQuestion}
					/>
				</>
			)}
		</CardContainer>
	);
};

export default SinglePlayerScreen;
