import React from "react";

interface TransactionItemProps {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  category_name?: string;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ id, title, amount, type, date, category_name, onDelete }) => {
  const symbol = type === "income" ? "+" : "-";

  const colors = {
    income: "bg-green-500",
    expense: "bg-red-500",
  };
  const bgColor = colors[type];

  return (
    <li className="flex items-center p-3 border rounded gap-3 bg-white hover:shadow-md transition-shadow">
      <div className={`w-2 self-stretch rounded ${bgColor}`} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          {category_name && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
              {category_name}
            </span>
          )}
        </div>
        <time dateTime={date.toISOString()} className="text-sm opacity-70">
          {date.toLocaleDateString()}
        </time>
      </div>
      <div className="text-lg font-semibold">
        {symbol}{Math.round(amount)} ₽
      </div>
      <button
        onClick={() => onDelete(id)}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        title="Удалить транзакцию"
      >
        ✕
      </button>
    </li>
  );
};

export default TransactionItem;
