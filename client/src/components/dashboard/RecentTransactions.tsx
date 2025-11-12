type Tx = {
  title: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
};

const RecentTransactions = () => {
  const transactions: Tx[] = [
    { title: "Salary", amount: 3000, type: "income", date: new Date() },
    { title: "Lunch", amount: 120, type: "expense", date: new Date() },
    { title: "Taxi", amount: 150, type: "expense", date: new Date() },
  ];

  const colors = {
    income: "text-green-500",
    expense: "text-red-500",
  };

  return (
    <div className="bg-white/90 p-6 rounded-xl shadow-md flex-1 flex flex-col justify-between">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Transactions</h2>

      <ul className="space-y-3 flex-1">
        {transactions.slice(-3).map(({ title, amount, type, date }) => (
          <li
            key={title + date.toISOString()}
            className="flex justify-between items-center hover:bg-gray-50 transition-colors rounded-md px-2 py-1"
          >
            <div>
              {title}
              <span className="text-gray-400 text-xs">{date.toLocaleDateString()}</span>
            </div>
            <div className={`${colors[type]}`}>{amount} ₽</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTransactions;
