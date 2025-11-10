import React from "react";

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type}) => {
  const bgColor = 
    type === 'balance' ? 'bg-blue-500 hover:bg-blue-600' :
    type === 'income' ? 'bg-green-500 hover:bg-green-600' :
    'bg-red-500 hover:bg-red-600';

  return (
    <div className={`${bgColor} text-white p-4 rounded shadow-md`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl mt-2">{amount}</p>
    </div>
  );
};

export default SummaryCard;