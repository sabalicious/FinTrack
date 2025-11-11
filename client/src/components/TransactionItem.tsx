import React from "react";

interface TransactionItemProps {
  title: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ title, amount, type, date}) => {
  const symbol = type === "income" ? "+" : "-";

  const colors = {
    income: "bg-green-500",
    expense: "bg-red-500"
  }
  const bgColor = colors[type];

  return (
    <li className={`flex items-center p-3 border rounded gap-3`}>
      <div className={`w-2 self-stretch rounded ${bgColor}`} />
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <time dateTime={date.toISOString()} className="text-sm opacity-70">
          {date.toLocaleDateString()}
        </time>
      </div>
      <div className="text-lg font-semibold">
        {symbol}{amount}
      </div>
    </li>
  );
};

export default TransactionItem;