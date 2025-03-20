import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Vehicles from "./components/Vehicles";
import Drivers from "./components/Drivers";
import Reports from "./components/Reports";
import Users from "./components/Users";
import { User } from "./types";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "vehicles" | "drivers" | "reports" | "users" | "login">("login");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setActiveTab("dashboard");
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setActiveTab("login");
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">System TMS</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Zalogowany: {currentUser.username} ({currentUser.role})</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Wyloguj
          </button>
        </div>
      </header>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex space-x-6">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "dashboard" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "orders" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Zlecenia
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "vehicles" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("vehicles")}
            >
              Pojazdy
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "drivers" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("drivers")}
            >
              Kierowcy
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "reports" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("reports")}
            >
              Raporty
            </button>
            {currentUser.role === "admin" && (
              <button
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === "users" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("users")}
              >
                Użytkownicy
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-6">
        {activeTab === "dashboard" && <Dashboard currentUser={currentUser} />}
        {activeTab === "orders" && <Orders currentUser={currentUser} />}
        {activeTab === "vehicles" && <Vehicles />}
        {activeTab === "drivers" && <Drivers />}
        {activeTab === "reports" && <Reports />}
        {activeTab === "users" && currentUser.role === "admin" && <Users />}
      </main>
    </div>
  );
};

export default App;