import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar слева */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header сверху */}
        <Header />

        {/* Контент */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
