import app from "./src/app";

import { Server } from "socket.io";
import http from "http";
//dotenv config garna
import { config } from "dotenv";
config();

// create http server  from express app
const server = http.createServer(app);

// socket.io setup garnu paro
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// ecport io instance for controllers ko lagai
export const getIO = () => io;
// listen fro connection
io.on("connection", (socket) => {
  console.log("New Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client Disconneted", socket.id);
  });
});

// create server
const startServer = () => {
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
startServer();
