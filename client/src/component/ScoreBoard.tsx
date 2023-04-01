import MistakeCounter from "./MistakeCounter";
import svgIcons from "../style/assets/cross_sprite.svg";

interface ScoreBoardProps {
  mistakes: number;
  name: string;
  score: number;
  opponentsName: string;
  opponentsScore: number;
  opponentsAttempts: number;
  createArrayOfMistake: (mistake: number) => boolean[];
}

const ScoreBoard = ({
  mistakes,
  name,
  score,
  opponentsName,
  opponentsScore,
  opponentsAttempts,
  createArrayOfMistake,
}: ScoreBoardProps) => {
  return (
    <div className="game__score">
      <div className="score">
        <div className="score__board">
          <div className="score__board__mistakes score__board__mistakes1">
            <MistakeCounter mistakes={createArrayOfMistake(mistakes)} />
          </div>
          <div className="score__board__container score__board-player1">
            <p className="score__board__container-name">{name}</p>
            <div className="score__board__container-score">Score : {score}</div>
          </div>

          <div className="score__board__container score__board-player2">
            <p className="score__board__container-name">{opponentsName}</p>

            <div className="score__board__container-score ">
              Score : {opponentsScore}
            </div>
          </div>
          <div className="score__board__mistakes score__board__mistakes2">
            <MistakeCounter
              mistakes={createArrayOfMistake(
                opponentsAttempts - opponentsScore
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
