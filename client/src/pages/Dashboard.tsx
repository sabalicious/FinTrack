import React from "react";
import SummaryCard from "../components/SummaryCard";

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      <SummaryCard title="Баланс" amount={5000} type="balance" />
      <SummaryCard title="Доходы" amount={12000} type="income" />
      <SummaryCard title="Расходы" amount={7000} type="expense" />
    </div>
  );
};

export default Dashboard;