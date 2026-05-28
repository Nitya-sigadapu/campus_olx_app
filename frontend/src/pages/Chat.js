import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./Chat.css";

const socket = io("http://localhost:5000");

function Chat() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [activeContact, setActiveContact] = useState(null); // { id, name, email }
  const [contacts, setContacts] = useState([]); // All users from DB
  const [searchQuery, setSearchQuery] = useState("");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const chatEndRef = useRef(null);

  // Store unread counts dynamically { senderId: count }
  const [unreadCounts, setUnreadCounts] = useState(() => {
    const saved = localStorage.getItem(`unread_${user.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (user.id) {
      localStorage.setItem(`unread_${user.id}`, JSON.stringify(unreadCounts));
    }
  }, [unreadCounts, user.id]);

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Keep a ref of contacts for socket callbacks
  const contactsRef = useRef([]);
  useEffect(() => {
    contactsRef.current = contacts;
  }, [contacts]);

  // Mobile responsiveness
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [recentMessages, setRecentMessages] = useState({});
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current = activeContact;
  }, [activeContact]);

  // Fetch ALL users and recent messages on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRes = await axios.get("http://localhost:5000/api/users");
        const otherUsers = usersRes.data.filter(u => u.id !== user.id);
        
        const formattedUsers = otherUsers.map(u => ({
          ...u,
          name: u.name || u.email.split("@")[0]
        }));
        
        setContacts(formattedUsers);

        const recentRes = await axios.get(`http://localhost:5000/api/messages/recent/${user.id}`);
        setRecentMessages(recentRes.data);
      } catch (err) {
        console.error("Failed to load users or recent messages", err);
      }
    };

    if (user.id) {
      fetchUsers();
    }
  }, [user.id]);

  // Open a specific chat
  const openChat = async (contact) => {
    setActiveContact(contact);
    setShowMobileChat(true);

    // Reset unread count for this contact
    setUnreadCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[contact.id];
      localStorage.setItem(`unread_${user.id}`, JSON.stringify(newCounts));
      return newCounts;
    });

    // Fetch history
    try {
      const history = await axios.get(
        `http://localhost:5000/api/messages/${user.id}/${contact.id}`
      );
      setMessages(history.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Socket setup
  useEffect(() => {
    if (!user.id) return;

    socket.emit("join", String(user.id));

    // Handle reconnections
    const onConnect = () => {
      socket.emit("join", String(user.id));
    };
    socket.on("connect", onConnect);

    const handleMessage = (msg) => {
      const senderId = Number(msg.senderId || msg.sender_id);
      
      // Update recent message preview
      setRecentMessages(prev => ({
        ...prev,
        [senderId]: msg
      }));

      // Reorder contacts
      setContacts(prev => {
        const contact = prev.find(c => Number(c.id) === senderId);
        if (!contact) return prev;
        const filtered = prev.filter(c => Number(c.id) !== senderId);
        return [contact, ...filtered];
      });

      // ONLY append if it's from the other person
      if (senderId === Number(user.id)) {
        return;
      }

      if (activeRef.current?.id === senderId) {
        setMessages(prev => [...prev, msg]);
      } else {
        // Increment unread count for sender
        setUnreadCounts(prev => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1
        }));
        
        // Find sender name for the Toast Popup
        const senderObj = contactsRef.current.find(c => Number(c.id) === senderId);
        const senderName = senderObj ? senderObj.name : "Someone";
        
        setToast(`New message from ${senderName}!`);
        
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 10000);
      }
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("receiveMessage", handleMessage);
    };
  }, [user.id]);

  // AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showMobileChat]);

  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || !activeContact) return;

    const data = {
      senderId: Number(user.id),
      receiverId: Number(activeContact.id),
      message: text.trim()
    };

    socket.emit("sendMessage", data);
    
    // Optimistically update UI
    const newMsg = { ...data, time: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setRecentMessages(prev => ({ ...prev, [activeContact.id]: newMsg }));
    setText("");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.substring(0, 2).toUpperCase();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "10:30 AM";
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messaging-container">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="chat-toast">
          {toast}
        </div>
      )}

      {/* SIDEBAR */}
      <div className={`chat-sidebar ${showMobileChat ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <h2>Chats</h2>
          <div className="header-icons">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 20.664a9.163 9.163 0 0 1-6.521-2.702.977.977 0 0 1 1.381-1.381 7.269 7.269 0 0 0 10.024.244.977.977 0 0 1 1.313 1.445A9.192 9.192 0 0 1 12 20.664zm7.965-6.112a.977.977 0 0 1-.944-1.229 7.26 7.26 0 0 0-4.8-8.804.977.977 0 0 1 .594-1.86 9.212 9.212 0 0 1 6.092 11.169.976.976 0 0 1-.942.724zm-16.025-.39a.977.977 0 0 1-.753-.356 9.183 9.183 0 0 1 1.007-11.446.976.976 0 1 1 1.382 1.38 7.234 7.234 0 0 0-.794 9.014.974.974 0 0 1-.842 1.408z"></path>
            </svg>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path>
            </svg>
          </div>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"></path>
            </svg>
            <input
              className="search-input"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="contacts-list">
          {filteredContacts.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No users found.
            </div>
          ) : (
            filteredContacts.map((c) => (
              <div
                key={c.id}
                className={`contact-item ${activeContact?.id === c.id ? "active" : ""}`}
                onClick={() => openChat(c)}
              >
                <div className="contact-avatar">{getInitials(c.name)}</div>
                <div className="contact-info">
                  <div className="contact-header">
                    <span className="contact-name">{c.name}</span>
                  </div>
                  <div className="contact-message-row">
                    <span className="contact-last-msg" style={{ color: unreadCounts[c.id] > 0 ? '#111827' : 'var(--text-muted)', fontWeight: unreadCounts[c.id] > 0 ? '600' : 'normal' }}>
                      {recentMessages[c.id] ? (recentMessages[c.id].message.length > 25 ? recentMessages[c.id].message.substring(0, 25) + "..." : recentMessages[c.id].message) : "Click to message"}
                    </span>
                    {unreadCounts[c.id] > 0 && (
                      <div className="unread-badge">{unreadCounts[c.id]}</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      {activeContact ? (
        <div className={`chat-main ${!showMobileChat ? 'hidden' : ''}`}>
          
          {/* Header */}
          <div className="chat-header">
            <button className="back-btn" onClick={() => setShowMobileChat(false)}>
              ←
            </button>
            <div className="chat-header-avatar">{getInitials(activeContact.name)}</div>
            <div className="chat-header-info">
              <div className="chat-header-name">{activeContact.name}</div>
            </div>
            <div className="chat-header-actions">
              <svg viewBox="0 0 24 24"><path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"></path></svg>
              <svg viewBox="0 0 24 24"><path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"></path></svg>
              <svg viewBox="0 0 24 24"><path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg>
            </div>
          </div>

          {/* Messages Window */}
          <div className="chat-messages">
            <div className="date-separator">Today</div>
            {messages.map((m, i) => {
              const isMe = m.senderId === user.id || m.sender_id === user.id;
              return (
                <div key={i} className={`message-wrapper ${isMe ? "me" : "them"}`}>
                  <div className="message-bubble">
                    <div className="message-text">{m.message}</div>
                    <div className="message-meta">
                      <span className="message-time">{formatTime(m.created_at || m.time)}</span>
                      {isMe && (
                        <span className="message-ticks">
                          <svg viewBox="0 0 16 15">
                            <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="chat-input-area">
            <div className="input-actions">
              <svg viewBox="0 0 24 24"><path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path></svg>
              <svg viewBox="0 0 24 24"><path d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.57.57 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"></path></svg>
            </div>
            <input
              className="message-input"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="send-btn">
              <svg className="send-icon" viewBox="0 0 24 24">
                <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
              </svg>
            </button>
          </form>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className={`empty-chat ${showMobileChat ? 'hidden' : ''}`}>
          <h3>Campus OLX Chat</h3>
          <p>Select a user from the left sidebar to start messaging.</p>
        </div>
      )}
    </div>
  );
}

export default Chat;