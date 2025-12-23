import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: "/dashboard", label: "Дашборд", icon: "📊" },
    { path: "/transactions", label: "Транзакции", icon: "💸" },
    { path: "/analytics", label: "Аналитика", icon: "📈" },
    // { path: "/planning", label: "Планирование", icon: "🎯" },
    { path: "/currencies", label: "Валюты", icon: "💱" },
    { path: "/goals", label: "Цели", icon: "🎁" },
    { path: "/debts", label: "Долги", icon: "💳" },
    { path: "/templates", label: "Шаблоны", icon: "📋" },
    { path: "/notes", label: "Заметки", icon: "📝" },
    { path: "/settings", label: "Параметры", icon: "⚙️" },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-20 px-4 shadow-2xl overflow-y-auto">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
