import GameJoinScreen from "./src/component/GameJoinScreen";
import GlobalProvider from "./src/context/GlobalProvider";
import { Route, Routes } from "react-router-dom";
import GamePlayScreen from "./src/component/GamePlayScreen";
import "./src/style/index.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const App = () => {
  return (
    <GlobalProvider>
      <Routes>
        <Route path="/" element={<GameJoinScreen />} />
        <Route path="/start/:roomId" element={<GamePlayScreen />} />
      </Routes>
    </GlobalProvider>
  ); //return
}; //fn

export default App;
