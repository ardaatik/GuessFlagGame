import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import * as io from "socket.io-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface StartGameInterface {
  socket: io.Socket<ServerToClientEvents, ClientToServerEvents>;
  setSinglePlayerMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeScreen = ({
  socket,
  setSinglePlayerMode,
  setIsLoading,
}: StartGameInterface) => {
  const navigate = useNavigate();
  const [queueIsLoading, setQueueIsLoading] = useState(false);

  const handleJoinMatch = () => {
    setSinglePlayerMode(false);
    socket.emit("clientJoinQueue");
    setQueueIsLoading(true);
  };

  return (
    <div className="text-center home">
      <h3 className="home__title">World Geography Games</h3>
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
        <button
          type="button"
          className="home__button"
          onClick={() => {
            setIsLoading(true); // Set isLoading to true before starting the loading state
            navigate("/start");
            setSinglePlayerMode(true);
            // Simulate a delay of 1 second before navigating
            setTimeout(() => {
              setIsLoading(false); // Set isLoading back to false after the delay
            }, 500);
          }}
        >
          <svg className="home__button-icon icon-play2">
            <use xlinkHref="./src/style/assets/sprite.svg#icon-play2" />
          </svg>
          Play
        </button>
        {!queueIsLoading ? (
          <button
            type="button"
            className="home__button"
            onClick={handleJoinMatch}
          >
            <svg className="home__button-icon icon-play2">
              <use xlinkHref="./src/style/assets/sprite.svg#icon-play2" />
            </svg>
            Join
          </button>
        ) : (
          <div className="home__button-loading"></div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
