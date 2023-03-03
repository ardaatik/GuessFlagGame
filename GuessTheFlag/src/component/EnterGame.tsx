import React from "react";
import NameForm from "./NameForm";
import StartGame from "./StartGame";
import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import * as io from "socket.io-client";

interface EnterGameInterface {
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  setOpenInput: React.Dispatch<React.SetStateAction<boolean>>;
  room: string;
  socket: io.Socket<ServerToClientEvents, ClientToServerEvents>;
  handleStart: (e: React.FormEvent<EventTarget>) => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
  openInput: boolean;
}
const EnterGame = ({
  handleStart,
  setName,
  socket,
  setOpenInput,
  setRoom,
  room,
  openInput,
}: EnterGameInterface) => {
  return (
    <>
      {!openInput ? (
        <StartGame
          socket={socket}
          room={room}
          setOpenInput={setOpenInput}
          setRoom={setRoom}
        />
      ) : (
        <NameForm setName={setName} handleStart={handleStart} />
      )}
    </>
  );
};

export default EnterGame;
