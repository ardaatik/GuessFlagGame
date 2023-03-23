export interface ServerToClientEvents {
  serverGameStart: (start: boolean) => void;
  serverName: (name: string, socketId: string) => void;
  serverScore: (score: number, attempts: number) => void;
  serverLeaveRoom: (room: string) => void;
}

export interface ClientToServerEvents {
  clientMsg: (data: { msg: string; room: string }) => void;
  clientName: (name: string, room: string) => void;
  clientScore: (score: number, attempts: number) => void;
  joinRoom: (room) => void;
  client_game_start: (room: string) => void;
  clientLeaveRoom: (room: string) => void;
}
