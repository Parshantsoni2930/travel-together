const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const path = require("path");
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [,
  "https://travel-together-kej8-nbmx8am13-parshantsoni2930s-projects.vercel.app",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend is Running ");
});

// socket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id); 

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", (messageData) => {
    io.to(messageData.receiverId).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on https://travel-together-z3dr.onrender.com:${PORT}`);
});