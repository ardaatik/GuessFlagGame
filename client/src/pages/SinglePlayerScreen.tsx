import { useContext, useEffect } from "react";
import GamePlay from "../component/Gameplay";
import { GlobalContext } from "../context/GlobalProvider";
import { useNavigate } from "react-router-dom";
import SinglePlayerResults from "../component/SinglePlayerResults";

const SinglePlayerScreen = () => {
	const navigate = useNavigate();
	const { resetTheGame, initGameRound, results, name } =
		useContext(GlobalContext);
	const AMOUNT_OF_QUESTIONS = 25;
	useEffect(() => {
		resetTheGame();
		initGameRound();
	}, []);

	useEffect(() => {
		if (!name) {
			navigate("/");
		} else {
			resetTheGame();
			initGameRound();
		}
	}, []);

	const navigateToMainMenu = () => {
		navigate("/");
	};
	return (
		<>
			{results.attempts === AMOUNT_OF_QUESTIONS ? (
				<SinglePlayerResults
					score={results.score}
					attempts={results.attempts}
					navigateToMainMenu={navigateToMainMenu}
					resetTheGame={resetTheGame}
				/>
			) : (
				<>
					<div className="score__board__single__player">
						<button
							className="score__board__single__player-button"
							onClick={() => {
								navigate("/");
							}}
						>
							<svg className="score__board__single__player-icon">
								<use xlinkHref="./src/style/assets/cross_sprite.svg#icon-arrow-left" />
							</svg>
						</button>
						<div className="score__board__single__player-score">
							Score : {results.score}
						</div>
						<div className="score__board__single__player-question">
							{results.attempts}/{AMOUNT_OF_QUESTIONS}
						</div>
					</div>
					<GamePlay />
				</>
			)}
		</>
	);
};

export default SinglePlayerScreen;
