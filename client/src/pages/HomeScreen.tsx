import Header from "@/component/Header";
import CardContainer from "@/component/UI/CardContainer";
import GameModeErrorMessage from "@/component/UI/GameModeErrorMessage";
import JoinForm from "@/component/UI/JoinForm";
import { GameModeContext } from "@/context/GameModeProvider";
import { GlobalContext } from "@/context/GlobalProvider";
import socket from "@/socket";
import { Icon1v1, IconPlay } from "@/style/assets/images";
import styles from "@/style/scss/HomeScreen.module.scss";
import { StartGameInterface } from "@/types";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonRounded from "../component/UI/ButtonRounded";

const HomeScreen = ({ setIsLoading }: StartGameInterface) => {
	const navigate = useNavigate();
	const { isSocketConnected } = useContext(GlobalContext);
	const { gameModeError, regions, time, amount } = useContext(GameModeContext);
	const [inputCode, setInputCode] = useState("");
	const [codeError, setCodeError] = useState(false);
	const [codeLoading, setCodeLoading] = useState(false);

	useEffect(() => {
		socket.on("join-room-error", () => {
			setCodeLoading(false);
			setCodeError(true);
		});

		return () => {
			socket.off("join-room-error");
		};
	}, []);

	useEffect(() => {
		setCodeLoading(false);
	}, [isSocketConnected]);

	const onCreateRoom = () => {
		socket.emit("create-room", regions, time * 1000, amount);
	};

	const onJoinRoom = () => {
		if (inputCode.length !== 6) return;
		setCodeLoading(true);
		socket.emit("join-room", inputCode);
	};

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 6) return;

		setInputCode(e.target.value.toUpperCase());
		setCodeError(false);
	};

	const memoizedGameModeErrorMessage = useMemo(() => {
		return <GameModeErrorMessage gameModeError={gameModeError} />;
	}, [gameModeError]);

	return (
		<CardContainer>
			<Header title={memoizedGameModeErrorMessage} />
			<div className={styles.home}>
				<h3 className={styles.homeTitle}>World Geography Games</h3>
				<div className={styles.homeText}>
					<div
						className={`${styles.homeTextContainer} ${styles.homeTextContainerRed}`}
					>
						<p>Country Flags Quiz</p>
					</div>
					<div
						className={`${styles.homeTextContainer} ${styles.homeTextContainerYellow}`}
					>
						<p>Guess the flags from 195 countries:</p>
						<p>from Afghanistan to Zimbabwe</p>
					</div>
				</div>
				<div className={styles.homeSubmitColumn}>
					<div className={styles.homeSubmitRow}>
						<div className={styles.homeButtonContainer}>
							<ButtonRounded
								variant="1"
								className={styles.homeButton}
								onClick={() => {
									setIsLoading(true);
									navigate("/start");
									setTimeout(() => {
										setIsLoading(false);
									}, 500);
								}}
								disabled={gameModeError}
							>
								<IconPlay className={styles.homeButtonIcon} />
								Play
							</ButtonRounded>
						</div>
						<div className={styles.homeButtonContainer}>
							<ButtonRounded
								variant="1"
								type="button"
								className={styles.homeButton}
								onClick={onCreateRoom}
								disabled={!isSocketConnected || gameModeError}
							>
								<Icon1v1 className={styles.homeButtonIcon} />
								Create Room
							</ButtonRounded>
						</div>
					</div>
					<JoinForm
						codeError={codeError}
						codeLoading={codeLoading}
						inputCode={inputCode}
						isSocketConnected={isSocketConnected}
						onJoinRoom={onJoinRoom}
						onInputChange={onInputChange}
					/>
				</div>
			</div>
		</CardContainer>
	);
};

export default HomeScreen;
