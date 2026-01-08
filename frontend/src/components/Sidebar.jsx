import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Zap,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  User,
  SunMedium,
  MoonStar,
} from "lucide-react";
import logo from "../assets/stockmind-logo.png";
import { useTheme } from "../context/ThemeContext";

function Sidebar({ user }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/forecasting", icon: Zap, label: "Forecasting" },
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/sales-history", icon: ShoppingCart, label: "Sales History" },
    { path: "/reports", icon: FileText, label: "Reports" },
    { path: "/configuration", icon: Settings, label: "Configuration" },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 flex flex-col h-screen transition-all duration-300 fixed left-0 top-0 z-50`}
    >
      <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-800">
        <div
          className={`flex items-center gap-3 ${
            isCollapsed && "justify-center w-full"
          }`}
        >
          <img
            src={logo}
            alt="StockMind"
            className="w-8 h-8 rounded-full object-cover"
          />
          {!isCollapsed && (
            <span className="font-bold text-lg text-primary">StockMind</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunMedium size={18} />
            ) : (
              <MoonStar size={18} />
            )}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-0">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-5 py-3 transition-all ${
                    isActive(item.path)
                      ? "bg-blue-50 text-primary border-l-4 border-primary font-semibold dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600"
                      : "text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-5 border-t border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-slate-100">
            <User size={20} />
          </div>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                {"Gaurav"}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-300">
                {(user && user.role) || "Inventory Manager"}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
