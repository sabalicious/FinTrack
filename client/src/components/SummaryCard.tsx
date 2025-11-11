import React from "react";

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type}) => {
  const colors = {
    balance: "bg-blue-500",
    income: "bg-green-500",
    expense: "bg-red-500"
  }

  const bgColor = colors[type];

  return (
    <div className={`${bgColor} text-white p-4 rounded shadow-md`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl mt-2">{amount}</p>
    </div>
  );
};

export default SummaryCard;