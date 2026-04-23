# syntax=docker/dockerfile:1
# Monorepo: Vite client → server/client-build, then TypeScript server.

FROM node:20-alpine AS client-builder
WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client/ ./client/
# Vite writes to ../server/client-build (see client/vite.config.ts)
RUN mkdir -p server && cd client && npm run build

FROM node:20-alpine AS server-build
WORKDIR /app
# Resolves `../../typings` imports from server/sockets
COPY typings.d.ts ./
COPY server/package*.json ./server/
RUN cd server && npm ci
COPY server/ ./server/
COPY --from=client-builder /app/server/client-build ./server/client-build
RUN cd server && npm run build

FROM node:20-alpine AS production
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY --from=server-build /app/server/build ./build
COPY --from=server-build /app/server/client-build ./client-build
COPY server/data ./data
RUN chown -R node:node /app/server
USER node
EXPOSE 3000
CMD ["node", "build/server.js"]
