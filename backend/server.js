const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const interestRoutes = require("./routes/interestRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api", interestRoutes);
app.use("/api", userRoutes);
app.use("/api", messageRoutes);

app.get("/", (req,res)=>{
  res.send("Campus OLX API running");
});

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"]
  }
});

io.on("connection",(socket)=>{

  console.log("User connected:",socket.id);

  socket.on("join",(userId)=>{
    socket.join(userId);
  });

  socket.on("sendMessage",async(data)=>{

    const { senderId,receiverId,message } = data;

    try{

      await db.query(
        "INSERT INTO messages (sender_id,receiver_id,message) VALUES (?,?,?)",
        [senderId,receiverId,message]
      );

      const msg = {
        senderId,
        receiverId,
        message,
        time: new Date()
      };

      io.to(receiverId).emit("receiveMessage", msg);
      io.to(senderId).emit("receiveMessage", msg);


    }catch(err){
      console.log(err);
    }

  });

  socket.on("disconnect",()=>{
    console.log("User disconnected:",socket.id);
  });

});

server.listen(5000,()=>{
  console.log("Server running on http://localhost:5000");
});