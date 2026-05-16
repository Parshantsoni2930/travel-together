import { io } from "socket.io-client";

const socket = io("https://travel-together-z3dr.onrender.com");

export default socket;