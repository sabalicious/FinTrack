import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CurrencyRates from "./CurrencyRates";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b-2 border-gray-100">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">💰</div>
          <h1 className="text-2xl font-bold text-gradient">FinTrack</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <CurrencyRates />
          
          {user && (
            <div className="flex items-center gap-4 border-l-2 border-gray-200 pl-6">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user.username || user.email}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 active:scale-95"
              >
                Выход
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;