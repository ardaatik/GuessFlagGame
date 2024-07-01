import styles from "@/style/scss/FlagImage.module.scss";

export interface FlagImageProps {
	flagUrl: string;
	answer: string;
}

function FlagImage({ flagUrl, answer }: FlagImageProps) {
	return (
		<a className={styles.flagImageWrapper} title={answer} target="_blank">
			<span className={`fi fi-${flagUrl} ${styles.flagImage}`}></span>
		</a>
	);
}

export default FlagImage;
