import styles from "@/style/scss/Column.module.scss";
import TextButton from "./TextButton";

export interface ColumnProps {
	label: string;
	buttons: {
		text: string | number;
		active: boolean;
		action: () => void;
		Icon?: React.FunctionComponent<
			React.SVGProps<SVGSVGElement> & {
				title?: string | undefined;
			}
		>;
	}[];
}

export default function Column(props: ColumnProps) {
	const { label, buttons } = props;

	return (
		<div className={`${styles.setting}`}>
			<label htmlFor={label} className={`${styles.label} ${styles.active}`}>
				{label}
			</label>
			<div className={styles.gameModeButtons}>
				{buttons.map(({ text, active, action, Icon }) => (
					<TextButton
						key={text}
						className={styles.button}
						isActive={active}
						onClick={() => action()}
					>
						{Icon && <Icon className={styles.buttonIcon} />}
						<span>{text}</span>
					</TextButton>
				))}
			</div>
		</div>
	);
}
