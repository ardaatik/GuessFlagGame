import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import * as io from "socket.io-client";
import Gameplay from "../screens/Gameplay";

interface InGameInterface {
  socket: io.Socket<ServerToClientEvents, ClientToServerEvents>;
  name: string;
  gameStart: boolean;
  room: string;
}

const InGame = ({ room, gameStart, name, socket }: InGameInterface) => {
  return gameStart ? (
    <Gameplay name={name} start={gameStart} socket={socket} room={room} />
  ) : (
    <div className="game">
      <>Loading...</>
    </div>
  );
};

export default InGame;
