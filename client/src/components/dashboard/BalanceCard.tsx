import React from "react";

const BalanceCard: React.FC = () => {
  const transactions = [
    { amount: 3000, type: "income" },
    { amount: 120, type: "expense" },
    { amount: 150, type: "expense" },
  ];

  const totalIncome: number = transactions
    .filter(({ type }) => type === "income")
    .reduce((sum, { amount }) => sum + amount, 0);
    
  const totalExpense: number = transactions
    .filter(({ type }) => type === "expense")
    .reduce((sum, { amount }) => sum + amount, 0);

  const balance: number = totalIncome - totalExpense;
  const expensePercent = totalIncome ? (totalExpense / totalIncome) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-lg font-bold">Balance</h2>
      <p className="text-3xl font-semibold mt-2">{balance} ₽</p>

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
      <p className="text-xs mt-1 opacity-75">{expensePercent.toFixed(1)}% of income spent</p>
    </div>
  );
};

export default BalanceCard;
