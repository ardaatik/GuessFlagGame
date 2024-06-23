import styles from "@/style/scss/Loading.module.scss";

interface Props {
	type: "spinner" | "dot-flashing" | "spinner-globe";
	className?: string;
}

export default function Loading(props: Props) {
	const { type, className } = props;
	const computedClassName =
		type === "spinner-globe" ? styles.loader : className;

	return (
		<div className={computedClassName || ""}>
			<div className={styles[type]} />
		</div>
	);
}
