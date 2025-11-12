import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

const FinanceChart = () => {
  const data = [
    { month: "Jan", income: 3000, expense: 2000 },
    { month: "Feb", income: 3200, expense: 1800 },
    { month: "Mar", income: 2800, expense: 2100 },
    { month: "Apr", income: 4000, expense: 2300 },
    { month: "May", income: 3600, expense: 2500 },
    { month: "Jun", income: 3900, expense: 2200 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Finance Overview</h2>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
          <YAxis tick={{ fill: "#6b7280" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Legend />

          <Area
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#colorIncome)"
            name="Income"
            strokeWidth={2.5}
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorExpense)"
            name="Expense"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
