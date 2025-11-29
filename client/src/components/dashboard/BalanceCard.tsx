import { useEffect, useState } from "react";

type Tx = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  created_at: string;
};

const BalanceCard = () => {
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ЗАПРОС НА ТРАНЗАКЦИИ...");

    const load = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/transactions");
        const data = await res.json();

        setTransactions(data);
      } catch (err) {
        console.error("ОШИБКА ПРИ ЗАГРУЗКЕ:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      console.log("📦 ТРАНЗАКЦИИ В СТЕЙТЕ:", transactions);
    }
  }, [transactions]);

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-md">Loading...</div>;

  const totalIncome = transactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + Math.round(Number(tx.amount)), 0);

  const totalExpense = transactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Math.round(Number(tx.amount)), 0);

  const balance = totalIncome - totalExpense;
  const expensePercent = totalIncome ? (totalExpense / totalIncome) * 100 : 0;

  return (
    <div className="bg-white/90 p-6 rounded-xl shadow-md flex-1 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold mb-2">Balance</h2>
        <p className="text-3xl font-semibold">{balance} ₽</p>
      </div>

      <div className="flex justify-between mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Income</p>
          <p className="mt-1 font-medium text-green-500">{totalIncome} ₽</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Expense</p>
          <p className="mt-1 font-medium text-red-500">{totalExpense} ₽</p>
        </div>
      </div>

      <div className="mt-4 h-4 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-4 bg-red-500 rounded-full transition-all duration-500"
          style={{ width: `${expensePercent}%` }}
        ></div>
      </div>
      <p className="text-xs mt-1 opacity-75">
        {expensePercent.toFixed(1)}% от дохода потрачено
      </p>
    </div>
  );
};

export default BalanceCard;
