import { IconMistake } from "@/style/assets/images";
import styles from "@/style/scss/Gameplay.module.scss";
import { CurrentQuestion } from "../../../../typings";
import GameButton from "../UI/GameButton";
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface GameplayProps {
	gameStarted?: boolean;
	isAnswered?: boolean;
	isAnsweredOpponent?: boolean;
	currentQuestion: CurrentQuestion;
	selectedAnswer: string | null;
	opponentGuess?: string | null;
	onGameButton: (answer: string) => void;
}

const Gameplay = ({
	gameStarted,
	onGameButton,
	currentQuestion,
	isAnswered,
	isAnsweredOpponent,
	selectedAnswer,
	opponentGuess,
}: GameplayProps) => {
	return (
		<div
			className={`${styles.game} ${
				gameStarted === false ? styles.disabled : ""
			} ${
				isAnswered === true &&
				isAnsweredOpponent !== true &&
				selectedAnswer !== ""
					? styles.answered
					: ""
			} 
			`}
		>
			<div className={styles.gameContainer}>
				<div className={styles.gameImageWrapper}>
					<div className={styles.gameImage}>
						<span
							className={`fi fi-${currentQuestion?.flagUrl} ${styles.gameImageFlag}`}
						></span>
						{isAnswered === true &&
							isAnsweredOpponent !== true &&
							selectedAnswer !== "" && (
								<div className={styles.gameImageOverlay}>
									Waiting for Opponent...
								</div>
							)}
					</div>
				</div>
				<div className={styles.gameButtonGroup}>
					{currentQuestion?.options?.length! > 0
						? currentQuestion?.options.map((option, idx) => {
								let playerStyle: "correct" | "incorrect" | "unselected" =
									"unselected";
								let opponentStyle: "opponentIncorrect" | "unselected" =
									"unselected";
								// calculating the color of the button after the answer is selected
								if (
									selectedAnswer !== null &&
									option === selectedAnswer &&
									(isAnswered === true || isAnswered === undefined) &&
									option !== currentQuestion.answer
								) {
									playerStyle = "incorrect";
								}

								if (
									selectedAnswer !== null &&
									option === currentQuestion.answer &&
									(isAnswered === true || isAnswered === undefined)
								) {
									playerStyle = "correct";
								}

								// Logic for opponent's guess
								if (
									opponentGuess !== null &&
									option === opponentGuess &&
									(isAnswered === true || isAnswered === undefined) &&
									isAnsweredOpponent === true &&
									option !== currentQuestion.answer
								) {
									opponentStyle = "opponentIncorrect";
								}

								return (
									<GameButton
										key={idx}
										option={option}
										idx={idx}
										playerStyle={playerStyle}
										opponentStyle={opponentStyle}
										onClick={onGameButton}
										Icon={IconMistake}
										disabled={isAnswered || selectedAnswer !== null}
										isAnswerCorrect={selectedAnswer === currentQuestion.answer}
										timeRanOut={selectedAnswer === ""}
									/>
								);
						  })
						: null}
				</div>
			</div>
		</div>
	);
};

export default Gameplay;
