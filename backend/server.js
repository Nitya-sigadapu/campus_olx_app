
require("dotenv").config({ path: "./config/.env" });
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("API Secret Exists:", !!process.env.CLOUDINARY_API_SECRET);
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const interestRoutes = require("./routes/interestRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());


/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api", interestRoutes);
app.use("/api", userRoutes);
app.use("/api", messageRoutes);
app.use("/api", reviewRoutes);


/* SERVE UPLOADS - Kept for old listings */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* GLOBAL ERROR HANDLER FOR API */
app.use("/api", (err, req, res, next) => {
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

/* SERVE FRONTEND */
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

/* CREATE SERVER */
const server = http.createServer(app);

/* SOCKET.IO */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {

  // console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
  const room = String(userId);   
  // console.log("Joining room:", room);
  socket.join(room);
});

  socket.on("sendMessage", async (data) => {
    // console.log("Message received:", data);

    if (!data.message || typeof data.message !== 'string' || !data.message.trim()) {
      return;
    }

    const { senderId, receiverId, message } = data;

    try {

      await db.query(
        "INSERT INTO messages (sender_id,receiver_id,message) VALUES (?,?,?)",
        [senderId, receiverId, message]
      );

      const msg = {
        senderId,
        receiverId,
        message,
        time: new Date()
      };

      io.to(String(receiverId)).emit("receiveMessage", msg);
      io.to(String(senderId)).emit("receiveMessage", msg);

    } catch (err) {
      // console.log(err);
    }

  });

  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
  });

});

/* PORT */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});