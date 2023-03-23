import Gameplay from "../screens/Gameplay";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalProvider";

const InGame = () => {
  const {
    IsStarted,
    opponnentsName,
    resetTheGame,
    initGameRound,
    socket,
    name,
    room,
  } = useContext(GlobalContext);

  useEffect(() => {
    resetTheGame();
    initGameRound();
    socket.emit("clientName", name, room);
  }, [IsStarted]);

  return IsStarted && opponnentsName ? (
    <Gameplay />
  ) : (
    <div className="game">
      <div className="game__loading">Loading...</div>
    </div>
  );
};

export default InGame;
