import "@/style/scss/index.scss";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "../App";
import { GameModeContextProvider } from "./context/GameModeProvider";
import GlobalProvider from "./context/GlobalProvider";
import SinglePlayerProvider from "./context/SinglePlayerProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<BrowserRouter>
		<GlobalProvider>
			<GameModeContextProvider>
				<SinglePlayerProvider>
					<App />
				</SinglePlayerProvider>
			</GameModeContextProvider>
		</GlobalProvider>
	</BrowserRouter>
);
