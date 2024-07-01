import { IconRefresh } from "@/style/assets/images";
import styles from "@/style/scss/GameResult.module.scss";
import { CurrentQuestion, PlayerState } from "../../../../typings";
import ButtonRounded from "../UI/ButtonRounded";
import CardContainer from "../UI/CardContainer";
import FlagImage from "../UI/FlagImage";
import ScoreBoard from "./ScoreBoard";

export interface GameResultInterface {
	currentPlayerState: PlayerState | undefined;
	opponentPlayerState: PlayerState | undefined;
	createArrayOfMistake: (mistake: number) => boolean[];
	mistakenQuestions: CurrentQuestion[];
	handlePlayAgain: () => void;
}

const GameResult = ({
	currentPlayerState,
	createArrayOfMistake,
	mistakenQuestions,
	opponentPlayerState,
	handlePlayAgain,
}: GameResultInterface) => {
	const winner =
		currentPlayerState?.score! > opponentPlayerState?.score!
			? currentPlayerState
			: currentPlayerState?.score! < opponentPlayerState?.score!
			? opponentPlayerState
			: null;

	return (
		<CardContainer>
			<ScoreBoard
				currentPlayerState={currentPlayerState}
				opponentPlayerState={opponentPlayerState}
				createArrayOfMistake={createArrayOfMistake}
			/>
			<div className={styles.gameResult}>
				<div className={styles.gameResultText}>
					{!winner
						? "Tie!"
						: winner === currentPlayerState
						? "You Won!"
						: "You Lost!"}
				</div>
				<div className={styles.mistakes}>
					<div className={styles.mistakesFlags}>
						{mistakenQuestions.map((question, index) => (
							<div className={styles.mistakesFlagsContainer} key={index}>
								<FlagImage
									flagUrl={question.flagUrl}
									answer={question.answer}
								/>
							</div>
						))}
					</div>
				</div>

				<div className={styles.playAgainWrapper}>
					<ButtonRounded
						variant="1"
						className={styles.playAgain}
						onClick={handlePlayAgain}
						disabled={
							currentPlayerState?.playAgain || opponentPlayerState?.disconnected
						}
					>
						<IconRefresh className={styles.playAgainIcon} />
						Play Again
					</ButtonRounded>
					<span className={styles.playAgainText}>
						{opponentPlayerState?.disconnected
							? "Opponent disconnected!"
							: opponentPlayerState?.playAgain
							? "Opponent wants to play again!"
							: currentPlayerState?.playAgain
							? "Requested play again to your opponent!"
							: ""}
					</span>
				</div>
			</div>
		</CardContainer>
	);
};

export default GameResult;
