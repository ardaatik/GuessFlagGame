import Start from "./src/component/Start";
import GlobalProvider from "./src/context/GlobalProvider";
import "./src/style/index.scss";
import { Route, Routes } from "react-router-dom";
import InGame from "./src/component/InGame";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const App = () => {
  return (
    <GlobalProvider>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/start" element={<InGame />} />
      </Routes>
    </GlobalProvider>
  ); //return
}; //fn

export default App;
