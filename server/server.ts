import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { ClientToServerEvents, ServerToClientEvents } from "../typings";

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);

io.on("connection", (socket: Socket) => {
  let opponentSocketId: string;

  socket.on("joinRoom", (room) => {
    const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
    console.log(roomSize);

    if (roomSize === 0) {
      socket.join(room);
      console.log(`Socket ${socket.id} createad room ${room}`);
    } else if (roomSize === 1) {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    } else {
      socket.leave(room);
      console.log(`Socket ${socket.id} full can't join room ${room}`);
    }
  });
  socket.on("client_game_start", (room) => {
    const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
    if (roomSize === 2) {
      io.in(room).emit("server_game_start", true);
      console.log(`Socket ${socket.id} started room ${room}`);
    } else {
      console.log(`Socket ${socket.id} empty can't start room ${room}`);
    }
  });
  socket.on("clientName", (name, room) => {
    const clientName = name.trim();
    console.log(`${socket.id} has set their name to ${clientName}`);
    console.log(io.sockets.adapter.rooms);

    // Emit the serverName event to all clients, including the sender
    console.log(`in room => ${room} `);
    io.in(room).emit("serverName", clientName, socket.id);
  });

  socket.on("clientScore", (score) => {
    console.log(`Received score ${score} from ${socket.id}`);

    // Emit the score update to the opponent
    socket.broadcast.emit("serverScore", score, socket.id);
  });

  // On connection, determine opponent's socket ID
  if (io.sockets.sockets.size === 2) {
    for (const otherSocket of io.sockets.sockets.values()) {
      if (otherSocket !== socket) {
        opponentSocketId = otherSocket.id;
        break;
      }
    }
  }
});

server.listen(3000, () => {
  console.log(`Server running ${3000}`);
});
