import cors from "cors";
import express from "express";
import { createServer } from "http";
import path from "path";
import configureSockets from "./sockets";

const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "production") {
	// Use client IP and TLS correctly when the app runs behind a reverse proxy / HTTPS
	app.set("trust proxy", 1);
}

// Serve static files from the React app
app.use(
	cors({
		origin:
			process.env.NODE_ENV === "development" ? "http://localhost:3000" : true,
	})
);
app.use(express.static(path.join(__dirname, "../client-build")));

console.log(`Attempting to run server on port ${port}`);

const server = createServer(app);
configureSockets(server);

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client-build/index.html"));
});
