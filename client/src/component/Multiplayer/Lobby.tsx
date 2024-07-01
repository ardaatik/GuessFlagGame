import { IconUser } from "@/style/assets/images";
import styles from "@/style/scss/Lobby.module.scss";
import Header from "../Header";
import CardContainer from "../UI/CardContainer";
import CopyButton from "../UI/CopyButton";
import Loading from "../UI/Loading";

interface LobbyProps {
	room: string;
}

function Lobby({ room }: LobbyProps) {
	return (
		<CardContainer>
			<Header title="Lobby" />
			<div className={styles.lobbyWrapper}>
				<div className={styles.waitingWrapper}>
					<div className={styles.roomCode}>
						<span className={styles.roomCodeText}>Room Code</span>
						<div className={styles.roomCodeBottom}>
							<span className={styles.roomCodeTextCode}>{room}</span>
							<CopyButton className={styles.roomCodeCopyButton} value={room} />
						</div>
					</div>
					<div className={styles.players}>
						<div className={`${styles.containerPlayer} ${styles.container}`}>
							<span className={styles.containerText}>You</span>
							<IconUser className={styles.iconUser} />
						</div>
						<span className={styles.textVs}>vs</span>
						<div className={`${styles.containerOpponent} ${styles.container}`}>
							<span className={styles.containerText}>Opponent</span>
							<Loading type="dot-flashing" />
						</div>
					</div>
				</div>
			</div>
		</CardContainer>
	);
}

export default Lobby;
