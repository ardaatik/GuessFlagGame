import styles from "@/style/scss/FlagImage.module.scss";
import { FlagImageProps } from "@/types";

function FlagImage({ flagUrl, answer }: FlagImageProps) {
	return (
		<a className={styles.flagImageWrapper} title={answer} target="_blank">
			<span className={`fi fi-${flagUrl} ${styles.flagImage}`}></span>
		</a>
	);
}

export default FlagImage;
