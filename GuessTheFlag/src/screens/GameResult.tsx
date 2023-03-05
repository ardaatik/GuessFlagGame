import { useNavigate } from "react-router-dom";

interface GameResultInterface {
  IsGameWon: boolean;
  score: number;
  restartGame: () => void;
}

const GameResult = ({ IsGameWon, score, restartGame }: GameResultInterface) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="game__result">
        <div className="game__result-text">
          You {IsGameWon ? "Won!" : "Lost!"}
        </div>
        <div className="game__result-text">{score}</div>
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
