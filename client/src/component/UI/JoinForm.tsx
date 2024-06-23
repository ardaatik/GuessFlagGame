import styles from "@/style/scss/JoinForm.module.scss";
import React from "react";
import ButtonRounded from "./ButtonRounded";

interface JoinFormProps {
	onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	inputCode: string;
	codeError: boolean;
	onJoinRoom: () => void;
	codeLoading: boolean;
	isSocketConnected: boolean;
}

function JoinForm({
	inputCode,
	codeError,
	onJoinRoom,
	codeLoading,
	isSocketConnected,
	onInputChange,
}: JoinFormProps) {
	return (
		<form
			className={styles.joinForm}
			onSubmit={(e) => {
				e.preventDefault();
				onJoinRoom();
			}}
		>
			<div className={styles.inputWrapper}>
				<input
					value={inputCode}
					className={`${styles.input} ${codeError ? styles.error : ""}`}
					onChange={onInputChange}
					placeholder="Enter code..."
				/>
				<span className={styles.inputCounter}>{inputCode.length}/6</span>
			</div>
			<ButtonRounded
				variant="2"
				className={styles.joinButton}
				onClick={onJoinRoom}
				disabled={!isSocketConnected || inputCode.length !== 6}
				loading={codeLoading}
			>
				Join
			</ButtonRounded>
			{codeError && <span className={styles.errorMessage}>Invalid code</span>}
		</form>
	);
}

export default JoinForm;
