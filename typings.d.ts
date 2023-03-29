export interface ServerToClientEvents {
  serverGameStart: (room: string) => void;
  serverName: (name: string, socketId: string) => void;
  serverScore: (score: number, attempts: number) => void;
  serverLeaveRoom: (room: string) => void;
}

export interface ClientToServerEvents {
  clientName: (name: string, room: string) => void;
  clientScore: (score: number, attempts: number) => void;
  clientJoinRoom: (room: string) => void;
  clientJoinQueue: () => void;
}
