import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./Chat.css";

const socket = io();

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
        const usersRes = await axios.get("/api/users");
        const otherUsers = usersRes.data.filter(u => u.id !== user.id);
        
        const formattedUsers = otherUsers.map(u => ({
          ...u,
          name: u.name || u.email.split("@")[0]
        }));
        
        setContacts(formattedUsers);

        const recentRes = await axios.get(`/api/messages/recent/${user.id}`);
        setRecentMessages(recentRes.data);
      } catch (err) {
        // console.error("Failed to load users or recent messages", err);
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
      const history = await axios.get(`/api/messages/${user.id}/${contact.id}`);
      setMessages(history.data);
    } catch (err) {
      // console.log(err);
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
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="absolute top-4 right-4 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-slate-50 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Messages</h2>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors sm:text-sm"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No users found.
            </div>
          ) : (
            filteredContacts.map((c) => (
              <div
                key={c.id}
                className={`flex items-center p-4 cursor-pointer transition-colors border-b border-gray-100 ${activeContact?.id === c.id ? "bg-indigo-50" : "hover:bg-gray-100 bg-white"}`}
                onClick={() => openChat(c)}
              >
                <div className="flex-shrink-0 relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {getInitials(c.name)}
                  </div>
                  {unreadCounts[c.id] > 0 && (
                    <span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white bg-red-500"></span>
                  )}
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                    {unreadCounts[c.id] > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {unreadCounts[c.id]}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate mt-1 ${unreadCounts[c.id] > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                    {recentMessages[c.id] ? recentMessages[c.id].message : "Click to message"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      {activeContact ? (
        <div className={`flex-1 flex flex-col bg-white ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Header */}
          <div className="h-16 px-4 flex items-center border-b border-gray-100 bg-white shadow-sm z-10">
            <button className="md:hidden mr-4 text-gray-500 hover:text-gray-700 active:scale-95 transition-transform" onClick={() => setShowMobileChat(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
              {getInitials(activeContact.name)}
            </div>
            <div className="ml-3 font-semibold text-slate-800">
              {activeContact.name}
            </div>
          </div>

          {/* Messages Window */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            <div className="flex justify-center mb-6">
              <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium shadow-sm">Today</span>
            </div>
            {messages.map((m, i) => {
              const isMe = m.senderId === user.id || m.sender_id === user.id;
              return (
                <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-slate-800 rounded-bl-none border border-gray-100"}`}>
                    <div className="text-[15px] leading-relaxed break-words">{m.message}</div>
                    <div className={`text-[11px] mt-1 text-right flex items-center justify-end space-x-1 ${isMe ? "text-indigo-200" : "text-gray-400"}`}>
                      <span>{formatTime(m.created_at || m.time)}</span>
                      {isMe && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 15" fill="currentColor">
                          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
            <input
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button 
              type="submit" 
              className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-90 active:shadow-inner"
              disabled={!text.trim()}
            >
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
              </svg>
            </button>
          </form>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className={`flex-1 flex flex-col items-center justify-center bg-slate-50 ${showMobileChat ? 'hidden md:flex' : 'hidden md:flex'}`}>
          <div className="h-24 w-24 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Campus OLX Chat</h3>
          <p className="text-slate-500 text-sm">Select a user from the left sidebar to start messaging.</p>
        </div>
      )}
    </div>
  );
}

export default Chat;