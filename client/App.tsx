import { useState, useEffect } from "react";
import GameJoinScreen from "./src/component/GameJoinScreen";
import GlobalProvider from "./src/context/GlobalProvider";
import { Route, Routes } from "react-router-dom";
import GamePlayScreen from "./src/component/GamePlayScreen";
import SinglePlayerScreen from "./src/component/SinglePlayerScreen";
import "./src/style/index.scss";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const Loading = () => {
  return <div className="game__loader__image"></div>;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Simulate an asynchronous operation
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the delay as per your needs
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <GlobalProvider>
      {isLoading ? (
        <div className="game__loader">
          <Loading />
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={<GameJoinScreen setIsLoading={setIsLoading} />}
          />
          <Route path="/start" element={<SinglePlayerScreen />} />
          <Route path="/start/:roomId" element={<GamePlayScreen />} />
        </Routes>
      )}
    </GlobalProvider>
  );
};

export default App;
