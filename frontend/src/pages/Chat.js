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

  // UNREAD STATES
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

      setReceiverId(res.data.id);
      setUnreadCount(0);
      setUnreadFrom("");

      const history = await axios.get(
        `http://localhost:5000/api/messages/${user.id}/${res.data.id}`
      );

      setMessages(history.data);

    } catch (err) {

      console.log(err);
      alert("User not found");

    }

  };

  useEffect(() => {

    socket.emit("join", user.id);

    socket.on("receiveMessage", (msg) => {

      if (
        (msg.senderId === receiverId && msg.receiverId === user.id) ||
        (msg.senderId === user.id && msg.receiverId === receiverId)
      ) {
        setMessages(prev => [...prev, msg]);
      }

      const sender = msg.senderId || msg.sender_id;
      const receiver = msg.receiverId || msg.receiver_id;

      if (receiver === user.id && sender !== receiverId) {
        setUnreadCount(prev => prev + 1);
        setUnreadFrom(sender);
      }

    });

    return () => socket.off("receiveMessage");

  }, [user.id, receiverId]);

  // AUTO SCROLL EFFECT
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {

    if (!text.trim() || !receiverId) return;

    if (receiverId === user.id) {
      alert("You cannot message yourself");
      return;
    }

    const data = {
      senderId: user.id,
      receiverId: receiverId,
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

        {/* AUTO SCROLL TARGET */}
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