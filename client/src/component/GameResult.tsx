import { useNavigate } from "react-router-dom";
import MistakeCounter from "../component/MistakeCounter";
import { CurrentQuestion } from "../context/GlobalProvider";

interface GameResultInterface {
  IsGameWon: boolean;
  score: number;
  opponnentsScore: number;
  opponnentsAttempts: number;
  restartGame: () => void;
  createArrayOfMistake: (mistake: number) => boolean[];
  mistakenQuestions: CurrentQuestion[];
}

const GameResult = ({
  IsGameWon,
  score,
  opponnentsScore,
  restartGame,
  opponnentsAttempts,
  createArrayOfMistake,
  mistakenQuestions,
}: GameResultInterface) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="game__result">
        {IsGameWon && (
          <div className="game__result-text">
            You {IsGameWon && score > opponnentsScore ? "Won!" : "Lost!"}
          </div>
        )}
        <div className="game__result-mistakes">
          <div className="game__result-mistakes-flags">
            {mistakenQuestions.map((question, index) => (
              <div
                className="game__result-mistakes-flags-container"
                key={index}
              >
                <a
                  className={`game__result-mistakes-flags-link game__result-mistakes-flags-link-${index}`}
                  title={question.answer}
                  href={`../../node_modules/flag-icons/flags/4x3/${question.flagUrl}.svg`}
                  target="_blank"
                >
                  <img
                    className="game__result-mistakes-flags-img"
                    src={`../../node_modules/flag-icons/flags/4x3/${question.flagUrl}.svg`}
                  />
                </a>
              </div>
            ))}
          </div>
          <div className="game__result-mistakes-opponent">
            <MistakeCounter
              mistakes={createArrayOfMistake(
                opponnentsAttempts - opponnentsScore
              )}
            />
          </div>
        </div>
        <div className="game__result-scores">
          <div className="game__result-scores-1">
            Player 1<div className="game__result-text">{score}</div>
          </div>
          <div className="game__result-scores-2">
            Player 2<div className="game__result-text">{opponnentsScore}</div>
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