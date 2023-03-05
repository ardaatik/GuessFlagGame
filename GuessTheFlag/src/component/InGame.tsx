import Gameplay from "../screens/Gameplay";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";

const InGame = () => {
  const { IsStarted, opponnentsName } = useContext(GlobalContext);
  return IsStarted && opponnentsName ? (
    <Gameplay />
  ) : (
    <div className="game">
      <div className="game__loading">Loading...</div>
    </div>
  );
};

export default InGame;
