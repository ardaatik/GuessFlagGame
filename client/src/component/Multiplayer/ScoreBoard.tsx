import styles from "@/style/scss/ScoreBoard.module.scss";
import { PlayerState } from "../../../../typings";
import Header from "../Header";
import MistakeCounter from "../UI/MistakeCounter";
import Timer from "../UI/Timer";

interface ScoreBoardProps {
	currentPlayerState: PlayerState | undefined;
	opponentPlayerState: PlayerState | undefined;
	createArrayOfMistake: (mistake: number) => boolean[];
	timer?: number;
	gameDuration?: number;
	startsInSeconds?: number | null;
	gameStarted?: boolean;
}

const ScoreBoard = ({
	currentPlayerState,
	opponentPlayerState,
	createArrayOfMistake,
	timer,
	gameDuration,
	startsInSeconds,
	gameStarted,
}: ScoreBoardProps) => {
	return (
		<div className={styles.scoreWrapper}>
			<div className={styles.score}>
				<Header
					title="Flag Quiz"
					className={styles.scoreBoardHeader}
					variant="2"
				/>
				<div className={styles.scoreBoard}>
					{timer !== null && timer !== undefined && (
						<Timer
							gameDuration={gameDuration!}
							gameStarted={gameStarted!}
							startsInSeconds={startsInSeconds!}
							timer={timer!}
						/>
					)}

					<div
						className={`${styles.scoreBoardContainer} ${styles.scoreBoardPlayer}`}
					>
						<div
							className={`${styles.scoreBoardMistakes} ${styles.scoreBoardMistakesPlayer}`}
						>
							<MistakeCounter
								mistakes={createArrayOfMistake(
									currentPlayerState?.mistakes ?? 0
								)}
							/>
						</div>
						<div className={styles.scoreBoardContainerColumn}>
							<p className={styles.scoreBoardContainerName}>You</p>
							<div className={styles.scoreBoardContainerScore}>
								Score : {currentPlayerState?.score}
							</div>
						</div>
					</div>
					<div
						className={`${styles.scoreBoardContainer} ${styles.scoreBoardOpponent}`}
					>
						<div className={styles.scoreBoardContainerColumn}>
							<p className={styles.scoreBoardContainerName}>Opponent</p>
							<div className={styles.scoreBoardContainerScore}>
								Score : {opponentPlayerState?.score}
							</div>
						</div>
						<div
							className={`${styles.scoreBoardMistakes} ${styles.scoreBoardMistakesOpponent}`}
						>
							<MistakeCounter
								mistakes={createArrayOfMistake(
									opponentPlayerState?.mistakes ?? 0
								)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ScoreBoard;
