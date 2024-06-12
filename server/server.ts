import cors from "cors";
import express from "express";
import { createServer } from "http";
import configureSockets from "./sockets";

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the React app

app.use(
	cors({
		origin: "*",
	})
);
// app.use(express.static(path.join(__dirname, "../client/dist")));

console.log(`Attempting to run server on port ${port}`);

const server = createServer(app);
configureSockets(server);

// Handles any requests that don't match the ones above
// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });
