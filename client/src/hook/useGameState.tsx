import { useState, useCallback, useEffect } from "react";

type UseGameStateReturnType = [
  boolean,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.Dispatch<React.SetStateAction<boolean>>
];

const useGameState = (
  mistakes: number,
  opponentsMistakes: number
): UseGameStateReturnType => {
  const [isGameLost, setIsGameLost] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const MINIMUM_MISTAKES = 3;
  const checkGameState = useCallback(() => {
    if (mistakes >= MINIMUM_MISTAKES) {
      setIsGameLost(true);
    }
    if (opponentsMistakes >= MINIMUM_MISTAKES) {
      setIsGameWon(true);
    }
  }, [mistakes, opponentsMistakes]);

  useEffect(() => {
    checkGameState();
  }, [checkGameState]);

  return [isGameLost, isGameWon, setIsGameLost, setIsGameWon];
};

export default useGameState;
