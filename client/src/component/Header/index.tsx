import { GameModeContext } from "@/context/GameModeProvider";
import { GlobalContext } from "@/context/GlobalProvider";
import socket from "@/socket";
import {
	IconCustomize,
	IconLeftArrow,
	IconMute,
	IconVolume,
} from "@/style/assets/images";
import styles from "@/style/scss/Header.module.scss";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonRounded from "../UI/ButtonRounded";

interface HeaderProps {
	title?: React.ReactNode;
	className?: string;
	variant?: "1" | "2";
}

function Header({ title, className, variant = "1" }: HeaderProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const { setRoom, resetTheGame } = useContext(GlobalContext);
	const { toggleMute, volume } = useContext(GameModeContext);
	const onLeaveRoom = () => {
		resetTheGame();
		socket.emit("leave-room");
		setRoom("");
		navigate("/");
	};

	return (
		<div className={`${styles.header} ${className}`}>
			<div className={styles.headerContainerLeft}>
				{location.pathname === "/" ? (
					<ButtonRounded
						variant={variant}
						className={styles.headerButton}
						onClick={() => navigate("/customize")}
						title="Customize"
					>
						<IconCustomize className={styles[`headerButtonIcon--${variant}`]} />
					</ButtonRounded>
				) : (
					<ButtonRounded
						variant={variant}
						title="Leave Room"
						className={styles.headerButton}
						onClick={() => onLeaveRoom()}
					>
						<IconLeftArrow className={styles[`headerButtonIcon--${variant}`]} />
					</ButtonRounded>
				)}
			</div>
			<div className={styles[`headerTitle--${variant}`]}>{title}</div>
			<div className={styles.headerContainerRight}>
				<ButtonRounded
					variant={variant}
					title="Mute/Unmute"
					className={styles.headerButton}
					onClick={() => toggleMute()}
				>
					{volume > 0 ? (
						<IconVolume className={styles[`headerButtonIcon--${variant}`]} />
					) : (
						<IconMute className={styles[`headerButtonIcon--${variant}`]} />
					)}
				</ButtonRounded>
			</div>
		</div>
	);
}

export default Header;
