import React, { useContext, useMemo } from "react";
import MistakeCounter from "../component/MistakeCounter";
import { GlobalContext } from "../context/GlobalProvider";
import GameResult from "./GameResult";

const Gameplay = () => {
  const {
    opponentsAttempts,
    currentQuestion,
    guessTheAnswer,
    resetTheGame,
    results,
    opponentsName,
    opponentsScore,
    socket,
    name,
    mistakes,
    isGameLost,
    isGameWon,
    mistakenQuestions,
  } = useContext(GlobalContext);

  const createArrayOfMistake = useMemo(
    () => (mistake: number) => {
      return Array(3)
        .fill(true)
        .map((_, i) => (mistake > i ? false : true));
    },
    [opponentsScore]
  );

  return (
    <div className="game">
      {isGameLost ? (
        <GameResult
          IsGameWon={isGameWon}
          score={results.score}
          opponentsScore={opponentsScore}
          restartGame={resetTheGame}
          opponentsAttempts={opponentsAttempts}
          createArrayOfMistake={createArrayOfMistake}
          mistakenQuestions={mistakenQuestions}
        />
      ) : (
        <div className="game__container">
          <div className="game__info">
            <div className="game__info__score">
              <div className="game__info__mistake-counter game__info__mistake-counter-1">
                <MistakeCounter mistakes={createArrayOfMistake(mistakes)} />
              </div>
              <div className="game__info__score-board game__info__score-board-1">
                <p className="game__info__score-board-name">{name}</p>
                <div className="game__info__score-board-point">
                  Score: {results.score}
                </div>
              </div>

              <div className="game__info__score-board game__info__score-board-2">
                <p className="game__info__score-board-name">{opponentsName}</p>

                <div className="game__info__score-board-point ">
                  Score: {opponentsScore}
                </div>
              </div>
              <div className="game__info__mistake-counter game__info__mistake-counter-2">
                <MistakeCounter
                  mistakes={createArrayOfMistake(
                    opponentsAttempts - opponentsScore
                  )}
                />
              </div>
            </div>
          </div>

          <img
            className="game__img"
            src={`../../node_modules/flag-icons/flags/4x3/${currentQuestion.flagUrl}.svg`}
          />

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
      )}
    </div>
  );
};

export default Gameplay;
