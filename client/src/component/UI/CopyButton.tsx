import { IconContentCopy } from "@/style/assets/images";
import styles from "@/style/scss/CopyButton.module.scss";
import { useEffect, useState } from "react";
import ButtonRounded from "./ButtonRounded";
import Tooltip from "./Tooltip";

interface Props {
	value: string;
	className?: string;
}

export default function CopyButton(props: Props) {
	const { value, className } = props;

	const [copied, setCopied] = useState(false);

	const handleCopyClick = () => {
		if (!value || copied) return;
		navigator.clipboard.writeText(value).then(() => {
			setCopied(true);
		});
	};

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (copied) {
			timeout = setTimeout(() => {
				setCopied(false);
			}, 1000);
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [copied]);

	return (
		<Tooltip
			text={copied ? "Copied!" : "Copy"}
			position="top"
			showOnHover
			className={className}
		>
			<ButtonRounded className={styles.copy__button} onClick={handleCopyClick}>
				<IconContentCopy className={styles.copy__icon} />
			</ButtonRounded>
		</Tooltip>
	);
}
