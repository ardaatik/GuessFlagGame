import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";
const Gameplay = () => {
  const { currentQuestion, guessTheAnswer, socket } = useContext(GlobalContext);

  return (
    <div className="game">
      (
      <div className="game__container">
        <img
          className="game__img"
          src={`../../node_modules/flag-icons/flags/4x3/${currentQuestion.flagUrl}.svg`}
        />
        <div className="game__button-group">
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
      )
    </div>
  );
};

export default Gameplay;
