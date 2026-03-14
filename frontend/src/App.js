import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import CreateListing from "./pages/CreateListing";
import Login from "./pages/Login";
import MyInterests from "./services/MyInterests";
import Chat from "./pages/Chat";

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
    return <Login setUser={setUser} />;
  }

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">

        <div>
          <h1>Campus OLX</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
            Logged in as: {user.email.split("@")[0]}
          </p>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

      {/* NAVIGATION */}
      <div className="nav-buttons">

        <button onClick={() => setView("dashboard")}>
          Browse Listings
        </button>

        <button onClick={() => setView("create")}>
          Create Listing
        </button>

        <button onClick={() => setView("interests")}>
          My Interests
        </button>

        <button onClick={() => setView("chat")}>
          Chat
        </button>

      </div>

      <hr />

      {/* PAGE CONTENT */}
      {view === "dashboard" && <Dashboard />}
      {view === "create" && <CreateListing />}
      {view === "interests" && <MyInterests />}
      {view === "chat" && <Chat />}

    </div>
  );
}

export default App;