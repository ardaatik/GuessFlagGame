import { GamemodeRegion } from "../../../typings";

export const data = {
	apiUrl: import.meta.env.PROD ? "" : "http://localhost:3000",

	gamemode: {
		time: [15, 30, 60, 120],
		amount: [10, 25, 50, 100, 150, 197], // amount of flags to guess
		regions: ["AF", "AS", "EU", "NA", "OC", "SA"] as GamemodeRegion,
	},
	regionSizes: {
		AF: 55,
		AS: 48,
		EU: 45,
		NA: 23,
		SA: 12,
		OC: 14,
	},

	VOLUME_MIN: 0,
	VOLUME_MAX: 100,
	VOLUME_DEFAULT: 30,
} as const;
