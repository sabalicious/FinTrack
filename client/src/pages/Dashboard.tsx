import React from "react";
import SummaryCard from "../components/SummaryCard";

const Dashboard: React.FC = () => {
  return (
    <>
    <SummaryCard title="Баланс" amount={0} type="balance" />
    <SummaryCard title="Доходы" amount={0} type="income" />
    <SummaryCard title="Расходы" amount={0} type="expense" />
    </>
  );
};

export default Dashboard;