import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import * as io from "socket.io-client";

interface StartGameInterface {
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  setOpenInput: React.Dispatch<React.SetStateAction<boolean>>;
  room: string;
  socket: io.Socket<ServerToClientEvents, ClientToServerEvents>;
}

const StartGame = ({
  socket,
  setOpenInput,
  setRoom,
  room,
}: StartGameInterface) => {
  return (
    <div className="text-center home">
      <h3 className="home__title">Welcome to Guess The Flag</h3>
      <div className="home__text">
        <div className="home__text__container home__text__container-1">
          <p className=" home__text-paragraph home__text-paragraph-1">
            Country Flags Quiz
          </p>
        </div>
        <div className="home__text__container home__text__container-2">
          <p className=" home__text-paragraph home__text-paragraph-2">
            Guess the flags from 195 countries:
          </p>
          <p className=" home__text-paragraph home__text-paragraph-2">
            from Afghanistan to Zimbabwe
          </p>
        </div>
      </div>
      <input
        className="game__submit-input"
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />

      <button
        type="button"
        className="home__button"
        onClick={() => {
          setOpenInput(true);
          socket.emit("joinRoom", room);
          socket.emit("client_game_start", room);
        }}
      >
        <svg className="home__button-icon icon-play2">
          <use xlinkHref="./src/style/assets/sprite.svg#icon-play2" />
        </svg>
        Start Game
      </button>
    </div>
  );
};

export default StartGame;
