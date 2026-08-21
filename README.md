# Guess the Flag

This is a multiplayer version of the flag guessing game available at [World Geography Games flags quiz](https://world-geography-games.com/en/flags_world.html). The game was created using React and Socket.io to enable real-time, multiplayer gameplay. Players can compete with each other to see who can guess the most flags correctly.

**Play:** [guesstheflag.ardaatik.com](https://guesstheflag.ardaatik.com)

![Gameplay](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzA2MTJkZTVmYzdmZDU3YjM0YzY4NzU4OWI5OGM0ZGE3YzJlNjcyYSZjdD1n/DIW2zr3QFtzQj0OKti/giphy.gif)

## Features

- **Single player** — guess flags against the clock
- **1v1 multiplayer** — create a room, share a 6-character code, compete in real time
- **Custom games** — timer (15–120s), flag count (10–197), and continents
- **Results** — score, mistakes, and a chance to rematch

## Tech stack

|        |                                              |
| ------ | -------------------------------------------- |
| Client | React 18, TypeScript, Vite, Socket.IO client |
| Server | Express, Socket.IO, TypeScript               |
| Deploy | Docker, GitHub Container Registry            |

## Installation

Open [http://localhost:3000](http://localhost:3000).

**Or run locally with npm (hot reload):**

```bash
git clone https://github.com/ardaatik/GuessFlagGame.git
cd GuessFlagGame
cd server && npm install
cd ../client && npm install
npm run both # from the client folder
```

- Client: [http://localhost:5173](http://localhost:5173) (dev)
- Server: [http://localhost:3000](http://localhost:3000)

**Main scripts:**

_Client_ (`client/`)

- `npm run dev`: Start client (Vite, port 5173)
- `npm run both`: Run client and server together
- `npm run build`: Build client
- `npm test`: Run tests

_Server_ (`server/`)

- `npm run dev`: Start server (dev mode, port 3000)
- `npm run build`: Build server
- `npm start`: Start compiled server
- `npm run build-all`: Build everything
