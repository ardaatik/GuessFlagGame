import useWindowDimensions from "@/hook/useWindowDimensions";
import { IconDownArrow } from "@/style/assets/images";
import styles from "@/style/scss/SinglePlayerResults.module.scss";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { CurrentQuestion } from "../../../../typings";
import ButtonRounded from "../UI/ButtonRounded";
import FlagImage from "../UI/FlagImage";

interface SinglePlayerResultsInterface {
	score: number;
	attempts: number;
	navigateToMainMenu: () => void;
	resetTheGame: () => void;
	mistakenQuestions: CurrentQuestion[];
}

const SinglePlayerResults = ({
	score,
	attempts,
	navigateToMainMenu,
	resetTheGame,
	mistakenQuestions,
}: SinglePlayerResultsInterface) => {
	const [windowWidth, windowHeight] = useWindowDimensions();
	const [runConfetti, setRunConfetti] = useState(true);
	const [numberOfPieces, setNumberOfPieces] = useState(200);
	const [showAllMistakes, setShowAllMistakes] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setNumberOfPieces((prev) => Math.max(0, prev - 20)); // Decrease by 20 pieces every interval
		}, 500); // Change this value to control how quickly the number of pieces decreases

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setRunConfetti(false);
		}, 5000); // Change this value to control how long the confetti runs

		return () => clearTimeout(timer);
	}, []);
	return (
		<div className={styles.singlePlayerResults}>
			<div className={styles.mistakesSinglePlayer}>
				{!showAllMistakes ? (
					<>
						<div className={styles.mistakesSinglePlayerFlags}>
							{/* first three mistakes */}
							{mistakenQuestions.slice(0, 3).map((question, index) => (
								<div
									className={styles.mistakesSinglePlayerFlagsContainer}
									key={index}
								>
									<FlagImage
										flagUrl={question.flagUrl}
										answer={question.answer}
									/>
								</div>
							))}
						</div>
						{mistakenQuestions.length > 3 && (
							<ButtonRounded
								variant="1"
								className={styles.mistakesShowAll}
								onClick={() => setShowAllMistakes(true)}
							>
								<span>Show More</span>
								<IconDownArrow className={styles.mistakesShowAllIcon} />
							</ButtonRounded>
						)}
					</>
				) : (
					<div className={styles.mistakesSinglePlayerColumn}>
						{mistakenQuestions.map((question, index) => (
							<div
								className={styles.mistakesSinglePlayerFlagsContainer}
								key={index}
							>
								<FlagImage
									flagUrl={question.flagUrl}
									answer={question.answer}
								/>
							</div>
						))}
					</div>
				)}
			</div>
			{runConfetti && (
				<ReactConfetti
					className={styles.singlePlayerResultsConfetti}
					width={windowWidth}
					height={windowHeight}
					numberOfPieces={numberOfPieces}
					gravity={0.1}
					run={runConfetti}
				/>
			)}
			<div className={styles.singlePlayerResultsScore}>
				<div className={styles.singlePlayerResultsScoreText}>Score :</div>
				<div className={styles.singlePlayerResultsScoreBoard}>
					<div className={styles.singlePlayerResultsScorePoints}>{score}</div>
					out of
					<div className={styles.singlePlayerResultsScoreAttempts}>
						{attempts}
					</div>
				</div>
			</div>
			<div className={styles.singlePlayerResultsButtons}>
				<button
					className={styles.singlePlayerResultsButtonsPlayAgain}
					onClick={() => {
						resetTheGame();
					}}
				>
					Play Again!
				</button>
				<button
					className={styles.singlePlayerResultsButtonsStop}
					onClick={navigateToMainMenu}
				>
					Stop
				</button>
			</div>
		</div>
	);
};

export default SinglePlayerResults;
