import BalanceCard from "../components/dashboard/BalanceCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import FinanceChart from "../components/dashboard/FinanceChart";

const Dashboard = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6 p-6 rounded-2xl shadow-lg bg-gradient-to-r from-green-400 via-blue-400 to-purple-500">
        <div className="lg:w-1/2 flex flex-col">
          <BalanceCard />
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <RecentTransactions />
        </div>
      </div>
      <div>
        <FinanceChart />
      </div>
    </div>
  );
};

export default Dashboard;
