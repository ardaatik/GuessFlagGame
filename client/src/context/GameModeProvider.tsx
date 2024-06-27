import useLocalStorageState from "@/hook/useLocalStorageState";
import { createContext } from "react";
import { GameModeAmount, GamemodeRegion, GamemodeTime } from "../../../typings";
import { data } from "../data";

interface Context {
	time: GamemodeTime;
	amount: GameModeAmount;
	regions: GamemodeRegion;
	volume: number;
	gameModeError: boolean;
	onTime: (time: GamemodeTime) => void;
	onAmount: (amount: GameModeAmount) => void;
	onRegion: (length: GamemodeRegion) => void;
	onVolume: (volume: number) => void;
	toggleMute: () => void;
	onReset: () => void;
}
const initial: Context = {
	time: 60,
	amount: 25,
	regions: ["AF", "AS", "EU", "NA", "OC", "SA"],
	volume: data.VOLUME_DEFAULT,
	onVolume: () => {},
	onTime: () => {},
	onAmount: () => {},
	onRegion: () => {},
	toggleMute: () => {},
	gameModeError: false,
	onReset: () => {},
};

export const GameModeContext = createContext(initial);

interface Props {
	children: React.ReactNode;
}

export const GameModeContextProvider = ({ children }: Props) => {
	const [time, setTime] = useLocalStorageState("gamemode-time", initial.time);
	const [lastVolume, setLastVolume] = useLocalStorageState<number>(
		"last-volume",
		initial.volume
	);
	const [amount, setAmount] = useLocalStorageState(
		"gamemode-amount",
		initial.amount
	);
	const [regions, setRegion] = useLocalStorageState(
		"gamemode-region",
		initial.regions
	);
	const [volume, setVolume] = useLocalStorageState<number>(
		"gamemode-volume",
		initial.volume
	);

	const getCurrentSize = () => {
		let sizes = regions.map(
			(currentRegion) => data.regionSizes[currentRegion] || 0
		);
		return sizes.reduce((total, size) => total + size, 0);
	};

	const gameModeError = getCurrentSize() < amount;

	const onTime: Context["onTime"] = (time) => {
		setTime(time);
	};
	const onAmount: Context["onAmount"] = (amount) => {
		setAmount(amount);
	};
	const onRegion: Context["onRegion"] = (region) => {
		setRegion(region);
	};

	const onVolume: Context["onVolume"] = (volume) => {
		setVolume(volume);
		if (volume > 0) {
			setLastVolume(volume);
		}
	};

	const toggleMute = () => {
		if (volume > 0) {
			setVolume(0);
		} else {
			setVolume(lastVolume);
		}
	};

	const onReset = () => {
		setTime(initial.time);
		setAmount(initial.amount);
		setRegion(initial.regions);
		setVolume(initial.volume);
		setLastVolume(initial.volume);
	};

	return (
		<GameModeContext.Provider
			value={{
				time,
				amount,
				regions,
				volume,
				onTime,
				onAmount,
				onRegion,
				onVolume,
				toggleMute,
				onReset,
				gameModeError,
			}}
		>
			{children}
		</GameModeContext.Provider>
	);
};
