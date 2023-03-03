import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import { useState, useEffect } from "react";
import * as io from "socket.io-client";
import EnterGame from "../component/EnterGame";
import InGame from "../component/InGame";
const socket: io.Socket<ServerToClientEvents, ClientToServerEvents> =
  io.connect("http://localhost:3000");

const Start = () => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [openInput, setOpenInput] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [gameOn, setGameOn] = useState(false);

  useEffect(() => {
    socket.on("server_game_start", (start: boolean) => {
      console.log(socket.id);
      setGameStart(start);
    });

    return () => {
      socket.off("server_game_start");
    };
  }, [gameStart]);

  const handleStart = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    socket.emit("clientName", name, room);
    console.log("sending name ");
    setGameOn(true);
  };
  return !gameOn ? (
    <EnterGame
      openInput={openInput}
      setName={setName}
      handleStart={handleStart}
      socket={socket}
      room={room}
      setOpenInput={setOpenInput}
      setRoom={setRoom}
    />
  ) : (
    <InGame socket={socket} room={room} name={name} gameStart={gameStart} />
  );
};

export default Start;
