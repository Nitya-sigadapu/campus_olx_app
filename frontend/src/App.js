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

  const path = window.location.pathname;

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <Login setUser={setUser} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Toaster position="top-right" />
      
      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                Campus OLX
              </h1>
            </div>
            
            <div className="hidden sm:flex space-x-2">
              <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm active:translate-y-1 active:shadow-inner ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => setView("dashboard")}>
                Browse
              </button>
              <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm active:translate-y-1 active:shadow-inner ${view === 'create' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => setView("create")}>
                Sell Item
              </button>
              <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm active:translate-y-1 active:shadow-inner ${view === 'interests' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => setView("interests")}>
                Saved
              </button>
              <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm active:translate-y-1 active:shadow-inner ${view === 'chat' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => setView("chat")}>
                Messages
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {user.email.split("@")[0]}
              </span>
              <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:translate-y-1 active:scale-95 active:shadow-inner" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "dashboard" && <Dashboard />}
        {view === "create" && <CreateListing />}
        {view === "interests" && <MyInterests />}
        {view === "chat" && <Chat />}
      </main>
    </div>
  );
}

export default App;