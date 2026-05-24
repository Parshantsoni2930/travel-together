const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
console.log(
  "GEMINI EXISTS:",
  !!process.env.GEMINI_API_KEY
);

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://travel-together-kej8.vercel.app",
  "https://travel-together-z3dr.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("HIT:", req.method, req.originalUrl);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).send("Backend is Running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) socket.join(userId);
  });

  socket.on("sendMessage", (messageData) => {
    if (messageData?.receiverId) {
      io.to(messageData.receiverId).emit("receiveMessage", messageData);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.log("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});