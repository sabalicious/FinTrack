import React from "react";
import SummaryCard from "../components/SummaryCard";
import BalanceCard from "../components/dashboard/BalanceCard";
import FinanceChart from "../components/dashboard/FinanceChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";

const Dashboard: React.FC = () => {
  return (
    <div>
      <BalanceCard />
      {/* <RecentTransactions />
      <FinanceChart /> */}
    </div>
  );
};

export default Dashboard;