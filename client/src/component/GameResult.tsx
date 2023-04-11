import { useNavigate } from "react-router-dom";
import MistakeCounter from "../component/MistakeCounter";
import { CurrentQuestion } from "../context/GlobalProvider";
import React from "react";
interface GameResultInterface {
  IsGameWon: boolean;
  score: number;
  opponentsScore: number;
  opponentsAttempts: number;
  restartGame: () => void;
  createArrayOfMistake: (mistake: number) => boolean[];
  mistakenQuestions: CurrentQuestion[];
}

interface FlagIcon {
  flagUrl: string;
  answer: string;
  index: number;
}

const GameResult = ({
  IsGameWon,
  score,
  opponentsScore,
  restartGame,
  opponentsAttempts,
  createArrayOfMistake,
  mistakenQuestions,
}: GameResultInterface) => {
  const navigate = useNavigate();

  function FlagIcon({ flagUrl, answer, index }: FlagIcon) {
    const flagIconPath = `../../node_modules/flag-icons/flags/4x3/${flagUrl}.svg`;

    return (
      <a
        className={`game__result-mistakes-flags-link game__result-mistakes-flags-link-${index}`}
        title={answer}
        href={flagIconPath}
        target="_blank"
      >
        <img className="game__result-mistakes-flags-img" src={flagIconPath} />
      </a>
    );
  }

  return (
    <div className="game">
      <div className="game__result">
        {IsGameWon && (
          <div className="game__result-text">
            You {IsGameWon && score > opponentsScore ? "Won!" : "Lost!"}
          </div>
        )}
        <div className="game__result-mistakes">
          <div className="game__result-mistakes-flags">
            {mistakenQuestions.map((question, index) => (
              <div
                className="game__result-mistakes-flags-container"
                key={index}
              >
                <FlagIcon
                  flagUrl={question.flagUrl}
                  answer={question.answer}
                  index={index}
                />
              </div>
            ))}
          </div>
          <div className="game__result-mistakes-opponent">
            <MistakeCounter
              mistakes={createArrayOfMistake(
                opponentsAttempts - opponentsScore
              )}
            />
          </div>
        </div>
        <div className="game__result-scores">
          <div className="game__result-scores-1">
            Player 1<div className="game__result-text">{score}</div>
          </div>
          <div className="game__result-scores-2">
            Player 2<div className="game__result-text">{opponentsScore}</div>
          </div>
        </div>
        <button
          className="game__result-btn"
          onClick={() => {
            restartGame();
            navigate("/");
          }}
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default GameResult;
