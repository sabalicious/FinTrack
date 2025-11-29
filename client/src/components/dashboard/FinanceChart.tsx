import React, { useEffect, useState } from "react";
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
import { getTransactions } from "../../api/transactions";

type Tx = {
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

type ChartData = {
  day: number;
  income: number;
  expense: number;
};

const FinanceChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const transactions: Tx[] = await getTransactions(token);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Создаём массив для всех дней месяца
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const dailyData: ChartData[] = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        income: 0,
        expense: 0,
      }));

      transactions.forEach(tx => {
        const date = new Date(tx.date);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          const day = date.getDate();
          if (tx.type === "income") dailyData[day - 1].income += Number(tx.amount);
          else dailyData[day - 1].expense += Number(tx.amount);
        }
      });

      // Убираем дни без операций для компактного графика
      const filteredData = dailyData.filter(d => d.income || d.expense);
      setChartData(filteredData);
    } catch (err) {
      console.error("Failed to fetch transactions for chart:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Finance Overview (Current Month)</h2>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
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
          <XAxis dataKey="day" tick={{ fill: "#6b7280" }} />
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
