import Gameplay from "../component/Gameplay";
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
    initGameRound();
    resetTheGame();
    socket.emit("clientName", name, room);
    return () => {};
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
