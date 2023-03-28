import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import * as io from "socket.io-client";
import { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalProvider";

interface StartGameInterface {
  socket: io.Socket<ServerToClientEvents, ClientToServerEvents>;
}

const StartGame = ({ socket }: StartGameInterface) => {
  const { resetTheGame, initGameRound } = useContext(GlobalContext);
  const [queueIsLoading, setQueueIsLoading] = useState(false);

  const handleJoinMatch = () => {
    socket.emit("clientJoinQueue");
    setQueueIsLoading(true);
    resetTheGame();
    initGameRound();
  };

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
      <div className="home__submit-block">
        {!queueIsLoading ? (
          <button
            type="button"
            className="home__button"
            onClick={handleJoinMatch}
          >
            <svg className="home__button-icon icon-play2">
              <use xlinkHref="./src/style/assets/sprite.svg#icon-play2" />
            </svg>
            Join Game
          </button>
        ) : (
          <div className="home__button-loading"></div>
        )}
      </div>
    </div>
  );
};

export default StartGame;
