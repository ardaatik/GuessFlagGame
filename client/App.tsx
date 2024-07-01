import Loading from "@/component/UI/Loading";
import { GlobalContext } from "@/context/GlobalProvider";
import CustomizeScreen from "@/pages/CustomizeScreen";
import HomeScreen from "@/pages/HomeScreen";
import socket from "@/socket";
import { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import GamePlayScreen from "./src/pages/GamePlayScreen";
import SinglePlayerScreen from "./src/pages/SinglePlayerScreen";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { setIsSocketConnected } = useContext(GlobalContext);
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		socket.on("connect", () => {
			setIsSocketConnected(true);
		});

		socket.on("disconnect", () => {
			setIsSocketConnected(false);
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
		};
	}, []);

	return (
		<>
			{isLoading ? (
				<Loading type="spinner-globe" />
			) : (
				<>
					<Routes>
						<Route path="/start" element={<SinglePlayerScreen />} />
						<Route path="/start/:roomId" element={<GamePlayScreen />} />
						<Route
							path="/"
							element={<HomeScreen setIsLoading={setIsLoading} />}
						/>
						<Route path="/customize" element={<CustomizeScreen />} />
					</Routes>
				</>
			)}
		</>
	);
};

export default App;
