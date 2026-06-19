import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { setSocketServer } from "./services/socketService.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    credentials: true
  }
});

io.on("connection", (socket) => {
  socket.join("tribeca-admin");
  socket.on("admin:join", () => socket.join("tribeca-admin"));
});

setSocketServer(io);

connectDB()
  .then(() => {
    server.listen(env.port, () => {
      console.log(`Tribeca Cafe API running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
