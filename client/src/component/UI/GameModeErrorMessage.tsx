import styles from "@/style/scss/GameModeErrorMessage.module.scss";

function GameModeErrorMessage({ gameModeError }: { gameModeError: boolean }) {
	return (
		<div className={styles.gameModeErrorContainer}>
			{gameModeError ? (
				<div className={styles.gameModeErrorText}>
					Not enough flags please change options!
				</div>
			) : null}
		</div>
	);
}

export default GameModeErrorMessage;
