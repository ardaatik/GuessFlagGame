import React, { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../context/GlobalProvider";
import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import * as io from "socket.io-client";

interface gameplayInterface {
  name: string;
  start: boolean;
  room: string;
  socket: io.Socket<ServerToClientEvents, ClientToServerEvents>;
}

const Gameplay = ({ name, start, socket, room }: gameplayInterface) => {
  const {
    currentQuestion,
    guessTheAnswer,
    resetTheGame,
    initGameRound,
    results,
  } = useContext(GlobalContext);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [name2, setName2] = useState("");

  useEffect(() => {
    resetTheGame();
    initGameRound();
    socket.emit("clientName", name, room);
    // let isGameStarted = socket.emit("client_game_start", "1");
    // console.log(isGameStarted);
  }, [start, name2]);
  useEffect(() => {
    // Set up an event listener for the serverName event
    socket.on("serverName", (name, socketId) => {
      if (socket.id !== socketId) {
        setName2(name);
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("serverName");
    };
  }, [start, name2]);

  useEffect(() => {
    // Set up an event listener for the serverScore event
    socket.on("serverScore", (score) => {
      scoreRef.current = score;
      setScore(score);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("serverScore");
    };
  }, [socket]);
  return name2 ? (
    <div className="game">
      <div className="text-center game__container">
        <div className="game__info">
          <div className="game__info-score">
            <div className="game__info-score-board game__info-score-board-1">
              <p className="game__info-name">{name}</p>
              <div className="game__info-score-point ">
                Score: {results.score}
              </div>
            </div>
            <div className="game__mistake game__mistake-1">
              <svg className="game__cross">
                <use xlinkHref="./src/style/assets/cross-sprite.svg#icon-cross" />
              </svg>
              <svg className="game__cross">
                <use xlinkHref="./src/style/assets/cross-sprite.svg#icon-cross" />
              </svg>
              <svg className="game__cross">
                <use xlinkHref="./src/style/assets/cross-sprite.svg#icon-cross" />
              </svg>
            </div>
            <div className="game__mistake game__mistake-2">
              <svg className="game__cross">
                <use xlinkHref="./src/style/assets/cross-sprite.svg#icon-cross" />
              </svg>
              <svg className="game__cross">
                <use xlinkHref="./src/style/assets/cross-sprite.svg#icon-cross" />
              </svg>
              <svg className="game__cross">
                <use xlinkHref="./src/style/assets/cross-sprite.svg#icon-cross" />
              </svg>
            </div>
            <div className="game__info-score-board game__info-score-board-2">
              <p className="game__info-name">{name2}</p>
              <div className="game__info-score-point ">
                Score: {scoreRef.current}
              </div>
            </div>
          </div>
        </div>
        <img className="game__img" src={currentQuestion.flagUrl} />
        {currentQuestion.options.map((option, idx) => (
          <button
            className="game__button"
            key={`option-${idx}`}
            value={option}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              guessTheAnswer((e.target as HTMLInputElement).value, socket);
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Gameplay;
