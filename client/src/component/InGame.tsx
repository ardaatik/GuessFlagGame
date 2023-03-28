import Gameplay from "../component/Gameplay";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalProvider";

const InGame = () => {
  const { opponentsName, resetTheGame, initGameRound, socket, name, room } =
    useContext(GlobalContext);

  useEffect(() => {
    // initGameRound();
    // resetTheGame();
    socket.emit("clientName", name, room);
    socket.emit("client_game_start", room);
  }, []);

  return opponentsName ? (
    <Gameplay />
  ) : (
    <div className="game">
      <div className="game__loading">Loading...</div>
    </div>
  );
};

export default InGame;
