import React from "react";
import NameForm from "./NameForm";
import StartGame from "./StartGame";
import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import * as io from "socket.io-client";
interface EnterGameInterface {
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  socket: io.Socket<ServerToClientEvents, ClientToServerEvents>;
  handleStart: (e: React.FormEvent<EventTarget>) => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
  openInput: boolean;
  name: string;
}
const EnterGame = ({
  handleStart,
  setName,
  socket,
  openInput,
  name,
}: EnterGameInterface) => {
  return (
    <>
      {name !== "" && openInput ? (
        <StartGame socket={socket} />
      ) : (
        <NameForm setName={setName} handleStart={handleStart} name={name} />
      )}
    </>
  );
};

export default EnterGame;
