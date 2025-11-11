import React from "react";
import CurrencyRates from "./CurrencyRates";

const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 bg-gray-100">
      <h1 className="text-xl font-bold">FinTrack</h1>
      <div className="ml-auto">
        <CurrencyRates />
      </div>
    </header>
  );
};

export default Header;