import styles from "@/style/scss/CardContainer.module.scss";
import { ReactNode } from "react";

interface CardContainerProps {
	children?: ReactNode;
	className?: string;
}

function CardContainer({ children, className }: CardContainerProps) {
	return (
		<div className={`${styles.card} ${className ? ` ${className}` : ""}`}>
			<div className={styles.cardContainer}>{children}</div>
		</div>
	);
}

export default CardContainer;
