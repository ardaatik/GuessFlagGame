import React, { useEffect } from "react";
import NameInputScreen from "./NameInputScreen";
import HomeScreen from "./HomeScreen";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";

interface GameJoinScreenInterface {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
const GameJoinScreen = ({ setIsLoading }: GameJoinScreenInterface) => {
  const {
    socket,
    name,
    openInput,
    setOpenInput,
    setName,
    resetTheGame,
    setSinglePlayerMode,
  } = useContext(GlobalContext);

  useEffect(() => {
    resetTheGame();
  }, []);

  const handleStart = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setOpenInput(true);
  };

  return (
    <>
      {name !== "" && openInput ? (
        <HomeScreen
          socket={socket}
          setSinglePlayerMode={setSinglePlayerMode}
          setIsLoading={setIsLoading}
        />
      ) : (
        <NameInputScreen
          setName={setName}
          handleStart={handleStart}
          name={name}
        />
      )}
    </>
  );
};

export default GameJoinScreen;
