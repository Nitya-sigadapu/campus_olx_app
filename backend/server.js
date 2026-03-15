require("dotenv").config({ path: "../.env" });
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

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api", interestRoutes);
app.use("/api", userRoutes);
app.use("/api", messageRoutes);


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

  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", async (data) => {

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

      io.to(receiverId).emit("receiveMessage", msg);
      io.to(senderId).emit("receiveMessage", msg);

    } catch (err) {
      console.log(err);
    }

  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

/* PORT */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});