import Gameplay from "../component/Gameplay";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalProvider";

const InGame = () => {
  const { opponentsName, socket, name, room, resetTheGame, initGameRound } =
    useContext(GlobalContext);

  useEffect(() => {
    console.log(room, "logging room from UseEffect");
    resetTheGame();
    initGameRound();
    console.log("sending name again !!");
    socket.emit("clientName", name, room);
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
