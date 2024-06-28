import { IconCross } from "@/style/assets/images";
import styles from "@/style/scss/MistakeCounter.module.scss";

interface MistakeCounterInterface {
	mistakes: boolean[];
}

const MistakeCounter = ({ mistakes }: MistakeCounterInterface) => {
	return (
		<>
			{mistakes.map((item, index) => (
				<IconCross
					key={index}
					className={
						!item ? styles.mistakeCounterRed : styles.mistakeCounterWhite
					}
				/>
			))}
		</>
	);
};

export default MistakeCounter;
