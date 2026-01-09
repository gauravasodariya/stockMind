import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Forecasting from "./pages/Forecasting";
import SalesHistory from "./pages/SalesHistory";
import Reports from "./pages/Reports";
import Configuration from "./pages/Configuration";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const currentUser = {
    name: "Sarah Anderson",
    role: "Inventory Manager",
  };

  return (
    <ThemeProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
          <Sidebar user={currentUser} />
          <main className="flex-1 overflow-y-auto ml-64 transition-colors">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forecasting" element={<Forecasting />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sales-history" element={<SalesHistory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
