import { GameModeContext } from "@/context/GameModeProvider";
import { data } from "@/data";
import ColumnStyles from "@/style/scss/Column.module.scss";
import styles from "@/style/scss/GameMode.module.scss";
import { useContext, useMemo, useState } from "react";
import ButtonRounded from "./ButtonRounded";
import Column from "./Column";
import GameModeErrorMessage from "./GameModeErrorMessage";
import Tooltip from "./Tooltip";

function GameMode() {
	const {
		time,
		amount,
		regions,
		volume,
		onTime,
		onAmount,
		onRegion,
		onVolume,
		gameModeError,
		onReset,
	} = useContext(GameModeContext);
	const [activeTooltip, setActiveTooltip] = useState<"volume" | null>(null);

	const timeButtons = useMemo(() => {
		return data.gamemode.time.map((timeLocal) => ({
			text: timeLocal,
			action: () => onTime(timeLocal),
			active: timeLocal === time,
		}));
	}, [time]);

	const amountButtons = useMemo(() => {
		return data.gamemode.amount.map((amountLocal) => ({
			text: amountLocal,
			action: () => onAmount(amountLocal),
			active: amountLocal === amount,
		}));
	}, [amount]);

	const regionButtons = useMemo(() => {
		return data.gamemode.regions.map((regionLocal) => ({
			text: regionLocal,
			active: regions.includes(regionLocal),
			action: () => {
				if (regions.includes(regionLocal)) {
					onRegion(regions.filter((r) => r !== regionLocal));
				} else {
					onRegion([...regions, regionLocal]);
				}
			},
		}));
	}, [regions]);

	return (
		<div className={styles.container}>
			<div
				className={ColumnStyles.setting}
				onMouseEnter={() => setActiveTooltip("volume")}
				onMouseLeave={() => setActiveTooltip(null)}
			>
				<label
					htmlFor="volume"
					className={`${ColumnStyles.label} ${ColumnStyles.active}`}
				>
					Volume
				</label>

				<div className={styles.range}>
					<input
						type="range"
						id="volume"
						min={data.VOLUME_MIN}
						value={volume}
						max={data.VOLUME_MAX}
						onChange={(e) => onVolume(Number(e.target.value))}
						onFocus={() => setActiveTooltip("volume")}
						onBlur={() => setActiveTooltip(null)}
						onTouchStart={() => setActiveTooltip("volume")}
						onTouchEnd={() => setActiveTooltip(null)}
						className={styles.rangeInput}
					/>
					<div className={styles.rangeTooltipContainer}>
						<div className={styles.rangeTooltipRelative}>
							<Tooltip
								text={volume}
								className={styles.rangeTooltip}
								style={{
									left:
										((volume - data.VOLUME_MIN) /
											(data.VOLUME_MAX - data.VOLUME_MIN)) *
											100 +
										"%",
								}}
								position="top"
								show={activeTooltip === "volume"}
							/>
						</div>
					</div>
				</div>
			</div>
			<Column label="Time" buttons={timeButtons} />
			<Column label="Amount Of Flags" buttons={amountButtons} />
			<Column label="Continents" buttons={regionButtons} />

			<div className={styles.buttonResetWrapper}>
				<GameModeErrorMessage gameModeError={gameModeError} />
				<ButtonRounded
					variant="1"
					className={styles.buttonResetToDefault}
					onClick={() => onReset()}
				>
					Reset to Default
				</ButtonRounded>
			</div>
		</div>
	);
}

export default GameMode;
