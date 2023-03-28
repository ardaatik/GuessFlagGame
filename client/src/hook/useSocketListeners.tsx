import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";
import { useNavigate } from "react-router-dom";
function useSocketListeners(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
) {
  const [opponentsScore, setOpponentScore] = useState(0);
  const [opponentsAttempts, setOpponentAttempts] = useState(0);
  const [opponentsName, setOpponentName] = useState("");
  const [room, setRoom] = useState("");
  const opponentsMistakes = opponentsAttempts - opponentsScore;
  const navigate = useNavigate();
  useEffect(() => {
    const gameStartListener = (room: string) => {
      console.log(socket.id, "server game started called");
      setRoom(room);
      socket.emit("joinRoom", room);
      navigate(`/start/${room}`);
    };

    const nameListener = (name: string, socketId: string) => {
      console.log(socket.id, "socket with this id called");
      console.log(name, "server name called");
      console.log(socketId, "server socket Id called");
      if (socket.id !== socketId) {
        setOpponentName(name);
      }
    };

    const scoreListener = (score: number, attempts: number) => {
      console.log(socket.id, "server score called");
      setOpponentScore(score);
      setOpponentAttempts(attempts);
    };

    const roomListener = (room: string) => {
      console.log(socket.id, "left", room);
      navigate("/");
    };
    socket.on("serverLeaveRoom", roomListener);
    socket.on("serverGameStart", gameStartListener);
    socket.on("serverName", nameListener);
    socket.on("serverScore", scoreListener);

    return () => {
      socket.off("serverLeaveRoom", roomListener);
      socket.off("serverGameStart", gameStartListener);
      socket.off("serverName", nameListener);
      socket.off("serverScore", scoreListener);
    };
  }, [socket]);

  return {
    opponentsScore,
    opponentsAttempts,
    opponentsMistakes,
    opponentsName,
    setOpponentScore,
    setOpponentAttempts,
    setOpponentName,
    room,
    setRoom,
  };
}

export default useSocketListeners;
