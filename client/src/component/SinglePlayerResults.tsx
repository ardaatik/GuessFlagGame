import ReactConfetti from "react-confetti";

interface SinglePlayerResultsInterface {
  score: number;
  attempts: number;
  navigateToMainMenu: () => void;
  resetTheGame: () => void;
}

const SinglePlayerResults = ({
  score,
  attempts,
  navigateToMainMenu,
  resetTheGame,
}: SinglePlayerResultsInterface) => {
  return (
    <div className="game__result__single__player">
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={true}
      />
      <div className="game__result__single__player__score">
        <div className="game__result__single__player__score-text">Score:</div>
        <div className="game__result__single__player__score-results">
          <div className="game__result__single__player__score-points">
            {score}
          </div>
          out of
          <div className="game__result__single__player__score-attempts">
            {attempts}
          </div>
        </div>
      </div>
      <div className="game__result__single__player-buttons">
        <button
          className="game__result__single__player-btn-1"
          onClick={() => {
            resetTheGame();
          }}
        >
          Play Again!
        </button>
        <button
          className="game__result__single__player-btn-2"
          onClick={navigateToMainMenu}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default SinglePlayerResults;
