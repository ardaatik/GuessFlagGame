import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../../typings";

type AllowedEvents = "serverGameStart" | "serverName" | "serverScore";

type EventListener<T extends AllowedEvents> = (
  ...args: Parameters<ServerToClientEvents[T]>
) => void;

function useSocket<T extends AllowedEvents>(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  event: T,
  listener: EventListener<T>
) {
  useEffect(() => {
    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, [socket]);
}

export default useSocket;
