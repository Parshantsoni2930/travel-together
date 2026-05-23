import { io } from "socket.io-client";

const socket = io(
  "https://travel-together-z3dr.onrender.com",
  {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: true,
  }
);

export default socket;