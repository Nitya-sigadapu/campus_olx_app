import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function Chat() {

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverId, setReceiverId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatEndRef = useRef(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadFrom, setUnreadFrom] = useState("");

  const findUser = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/user-by-email",
        {
          params: { email: receiverEmail.trim() }
        }
      );

      const rId = Number(res.data.id);

      setReceiverId(rId);
      setUnreadCount(0);
      setUnreadFrom("");

      const history = await axios.get(
        `http://localhost:5000/api/messages/${user.id}/${rId}`
      );

      setMessages(history.data);

    } catch (err) {
      console.log(err);
      alert("User not found");
    }

  };

  // ✅ FIXED SOCKET LOGIC
  useEffect(() => {

    if (!user.id) return;

    socket.emit("join", String(user.id));

    const handleMessage = (msg) => {

      const sender = Number(msg.senderId || msg.sender_id);
      const receiver = Number(msg.receiverId || msg.receiver_id);

      // ✅ only filter AFTER receiverId exists
      if (
        receiverId &&
        (
          (sender === receiverId && receiver === Number(user.id)) ||
          (sender === Number(user.id) && receiver === receiverId)
        )
      ) {
        setMessages(prev => [...prev, msg]);
      }

      // unread logic
      if (receiver === Number(user.id) && sender !== receiverId) {
        setUnreadCount(prev => prev + 1);
        setUnreadFrom(sender);
      }

    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };

  }, [user.id, receiverId]);

  // AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {

    if (!text.trim() || !receiverId) return;

    if (receiverId === Number(user.id)) {
      alert("You cannot message yourself");
      return;
    }

    const data = {
      senderId: Number(user.id),
      receiverId: Number(receiverId),
      message: text
    };

    socket.emit("sendMessage", data);

    setText("");
  };

  return (

    <div>

      <h3>Private Chat</h3>

      {/* OPEN CHAT SECTION */}
      <div className="chat-row">
        <input
          className="search-bar"
          placeholder="Enter user email"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
        />

        <button onClick={findUser}>
          Open Chat
        </button>
      </div>

      {/* CHAT BOX */}
      <div
        className="chat-box"
        style={{
          height: "300px",
          border: "1px solid gray",
          overflowY: "scroll",
          marginTop: "10px",
          padding: "10px"
        }}
      >

        {messages.map((m, i) => {

          const isMe =
            m.senderId === user.id || m.sender_id === user.id;

          return (
            <div
              key={i}
              className={isMe ? "my-message" : "their-message"}
            >
              {m.message}
            </div>
          );

        })}

        <div ref={chatEndRef}></div>

      </div>

      {/* SEND MESSAGE */}
      <div className="chat-row">
        <input
          className="search-bar"
          placeholder="Type message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>

    </div>

  );

}

export default Chat;