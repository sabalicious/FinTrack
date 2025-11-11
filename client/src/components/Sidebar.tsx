import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <nav className="flex gap-2 flex-col pt-20 px-3">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "active-link" : "default-link"
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          isActive ? "active-link" : "default-link"
        }
      >
        Transactions
      </NavLink>
      <NavLink
        to="/goals"
        className={({ isActive }) =>
          isActive ? "active-link" : "default-link"
        } 
      >
        Goals
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? "active-link" : "default-link"
        }
      >
        Settings
      </NavLink>
    </nav>
  );
};

export default Sidebar;
