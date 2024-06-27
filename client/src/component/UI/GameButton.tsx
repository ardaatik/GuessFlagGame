import { GameModeContext } from "@/context/GameModeProvider";
import useSound from "@/hook/useSound";
import correctAnswerSound from "@/style/assets/audio/correct-answer.wav";
import incorrectAnswerSound from "@/style/assets/audio/wrong-answer.wav";
import styles from "@/style/scss/GameButton.module.scss";
import { useContext, useEffect } from "react";

interface GameButtonProps {
	option?: string;
	idx?: number;
	playerStyle?: "correct" | "incorrect" | "unselected";
	opponentStyle?: "opponentIncorrect" | "unselected";
	onClick: (answer: string) => void;
	Icon?: React.ComponentType<{ className?: string }>;
	disabled?: boolean;
	isAnswerCorrect: boolean;
	timeRanOut?: boolean;
}

const GameButton: React.FC<GameButtonProps> = ({
	option = "",
	idx = 0,
	playerStyle = "unselected",
	onClick,
	Icon,
	disabled,
	isAnswerCorrect,
	timeRanOut,
	opponentStyle = "unselected",
}) => {
	const playerStyleMap = {
		correct: "correct",
		incorrect: "wrong",
		unselected: "",
	};
	const opponentStyleMap = {
		opponentIncorrect: "opponentIncorrect",
		unselected: "",
	};

	const { volume } = useContext(GameModeContext);

	const playCorrectSound = useSound(correctAnswerSound, volume / 100);
	const playIncorrectSound = useSound(incorrectAnswerSound, volume / 100);

	useEffect(() => {
		if (isAnswerCorrect && playerStyle === "correct") {
			playCorrectSound();
		} else if (
			(!isAnswerCorrect && playerStyle === "incorrect") ||
			timeRanOut
		) {
			playIncorrectSound();
		}
	}, [playerStyle, playCorrectSound, playIncorrectSound]);

	return (
		<button
			className={`${styles.gameButton} ${styles[playerStyleMap[playerStyle]]} ${
				!timeRanOut ? styles[opponentStyleMap[opponentStyle]] : ""
			}`}
			key={`option-${idx}`}
			value={option}
			onClick={() => onClick(option)}
			disabled={disabled}
		>
			<span className={styles.gameBtnText}>{option}</span>
			{(playerStyle === "incorrect" || opponentStyle === "opponentIncorrect") &&
				Icon && (
					<span>
						<Icon className={styles.iconDelete} />
					</span>
				)}
		</button>
	);
};

export default GameButton;
