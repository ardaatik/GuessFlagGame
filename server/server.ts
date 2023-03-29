import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { ClientToServerEvents, ServerToClientEvents } from "../typings";
import { v4 } from "uuid";

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const connected_queue = new Set<string>();

io.on("connection", (socket: Socket) => {
  socket.on("clientJoinQueue", () => {
    connected_queue.add(socket.id);
    const room = v4();
    if (connected_queue.size >= 2) {
      // Get an array of two socket IDs
      const socketIds = Array.from(connected_queue).slice(0, 2);
      // Remove those IDs from the set
      socketIds.forEach((id) => connected_queue.delete(id));
      // Emit a message to the two players to start the game
      socketIds.forEach((id) => io.to(id).emit("serverGameStart", room));
      console.log(`${room} Game started with players ${socketIds.join(", ")}`);
    } else {
      console.log(`[${room} Waiting for more players...`);
    }
  });

  socket.on("clientJoinRoom", (room) => {
    const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
    console.log(roomSize, "joined");
    socket.join(room);
    socket.data.room = room;
  });

  socket.on("clientName", (name, room) => {
    const clientName = name.trim();
    console.log(`${socket.id} has set their name to ${clientName}`);
    console.log(io.sockets.adapter.rooms);
    // Emit the serverName event to all clients, including the sender
    console.log(`in room => ${room} `);
    io.in(room).emit("serverName", clientName, socket.id);
  });

  socket.on("clientScore", (score, attempts) => {
    console.log(`Received score ${score} from ${socket.id}`);

    // Emit the score update to the opponent
    socket.broadcast.emit("serverScore", score, attempts, socket.id);
  });

  socket.on("disconnect", () => {
    connected_queue.delete(socket.id);
    const room = socket.data.room;
    if (room) {
      io.to(room).emit("serverLeaveRoom", room);
      io.socketsLeave(room);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log(`Server running ${3000}`);
});
