import React, { useContext, useMemo } from "react";
import MistakeCounter from "../component/MistakeCounter";
import { GlobalContext } from "../context/GlobalProvider";
import GameResult from "./GameResult";

const Gameplay = () => {
  const {
    opponnentsAttempts,
    currentQuestion,
    guessTheAnswer,
    resetTheGame,
    results,
    opponnentsName,
    score,
    socket,
    name,
    mistakes,
    IsGameLost,
    IsGameWon,
    mistakenQuestions,
  } = useContext(GlobalContext);

  const createArrayOfMistake = useMemo(
    () => (mistake: number) => {
      return Array(3)
        .fill(true)
        .map((_, i) => (mistake > i ? false : true));
    },
    [score]
  );

  return (
    <div className="game">
      {IsGameLost ? (
        <GameResult
          IsGameWon={IsGameWon}
          score={results.score}
          opponnentsScore={score}
          restartGame={resetTheGame}
          opponnentsAttempts={opponnentsAttempts}
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
                <p className="game__info__score-board-name">{opponnentsName}</p>

                <div className="game__info__score-board-point ">
                  Score: {score}
                </div>
              </div>
              <div className="game__info__mistake-counter game__info__mistake-counter-2">
                <MistakeCounter
                  mistakes={createArrayOfMistake(opponnentsAttempts - score)}
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
