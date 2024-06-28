import styles from "@/style/scss/Timer.module.scss";

interface TimerProps {
	timer: number;
	startsInSeconds?: number | null;
	gameDuration: number;
	gameStarted: boolean;
}

function Timer({
	startsInSeconds,
	timer,
	gameDuration,
	gameStarted,
}: TimerProps) {
	const getTimerColor = () => {
		const fraction = timer / gameDuration;
		if (fraction > 0.66) return styles.green; // Adjust the fractions as needed
		else if (fraction > 0.33) return styles.orange;
		else return styles.red;
	};

	return (
		<>
			{startsInSeconds !== null && (
				<div className={styles.baseTimer}>
					<svg
						className={`${styles.baseTimerSvg} ${
							gameStarted ? styles.active : ""
						}`}
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g className={styles.baseTimerCircle}>
							<circle
								className={styles.baseTimerPathElapsed}
								cx="50"
								cy="50"
								r="45"
							></circle>
							<path
								id="base-timer-path-remaining"
								strokeDasharray="283"
								strokeDashoffset={`${283 - 283 * (timer / gameDuration)}`}
								className={`${
									styles.baseTimerPathRemaining
								} ${getTimerColor()}`}
								d="
								M 50, 50
								m -45, 0
								a 45,45 0 1,0 90,0
								a 45,45 0 1,0 -90,0"
							></path>
						</g>
					</svg>
					<span
						className={`${styles.countdown} ${
							gameStarted
								? styles.countdownFadeIn
								: !startsInSeconds
								? styles.countdownFadeOut
								: ""
						}`}
					>
						{gameStarted ? timer : startsInSeconds || "GO!"}
					</span>
				</div>
			)}
		</>
	);
}

export default Timer;
