import { io } from "socket.io-client";

const socket = io("http://localhost:onrender.com");

export default socket;