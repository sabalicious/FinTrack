import React, { useEffect, useState } from "react";
import { getTransactions } from "../../api/transactions";
import { useAuth } from "../../context/AuthContext";

type Tx = {
  title: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
};

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const data = await getTransactions(token);

      // Преобразуем amount в число и date в объект Date
      const parsed = Array.isArray(data)
        ? data.map((tx: any) => ({
            ...tx,
            amount: Math.round(Number(tx.amount)), // целое число
            date: new Date(tx.date),               // объект Date
          }))
        : [];

      console.log("Transactions from backend:", parsed); // <-- логируем
      setTransactions(parsed);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  const colors = {
    income: "text-green-500",
    expense: "text-red-500",
  };

  return (
    <div className="bg-white/90 p-6 rounded-xl shadow-md flex-1 flex flex-col justify-between">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Недавние транзакции</h2>

      <ul className="space-y-3 flex-1">
        {transactions
          .slice(0, 3)
          .map(({ title, amount, type, date }, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center hover:bg-gray-50 transition-colors rounded-md px-2 py-1"
            >
              <div>
                {title}{" "}
                <span className="text-gray-400 text-xs">
                  {date.toLocaleDateString()}
                </span>
              </div>
              <div className={`${colors[type]}`}>{amount} ₽</div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
