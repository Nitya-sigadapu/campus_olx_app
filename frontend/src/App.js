import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateListing from "./pages/CreateListing";
import Login from "./pages/Login";
import MyInterests from "./services/MyInterests";
import Chat from "./pages/Chat";
import { Toaster } from "react-hot-toast";

function App() {

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [view, setView] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <Login setUser={setUser} />
      </>
    );
  }

  return (
    <div className="app-layout">
      <Toaster position="top-right" />
      
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Campus OLX</h1>
        </div>
        
        <div className="navbar-links">
          <button className={`nav-link ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView("dashboard")}>
            Browse
          </button>
          <button className={`nav-link ${view === 'create' ? 'active' : ''}`} onClick={() => setView("create")}>
            Sell Item
          </button>
          <button className={`nav-link ${view === 'interests' ? 'active' : ''}`} onClick={() => setView("interests")}>
            Saved
          </button>
          <button className={`nav-link ${view === 'chat' ? 'active' : ''}`} onClick={() => setView("chat")}>
            Messages
          </button>
        </div>

        <div className="navbar-user">
          <span className="user-email">{user.email.split("@")[0]}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="main-content container">
        {view === "dashboard" && <Dashboard />}
        {view === "create" && <CreateListing />}
        {view === "interests" && <MyInterests />}
        {view === "chat" && <Chat />}
      </main>
    </div>
  );
}

export default App;