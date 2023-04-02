import React from "react";
import NameInputScreen from "./NameInputScreen";
import HomeScreen from "./HomeScreen";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";

const GameJoinScreen = () => {
  const { socket, name, openInput, setOpenInput, setName, setRoom } =
    useContext(GlobalContext);
  const handleStart = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setOpenInput(true);
  };

  return (
    <>
      {name !== "" && openInput ? (
        <HomeScreen socket={socket} />
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
