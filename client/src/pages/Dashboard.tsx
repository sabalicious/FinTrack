import BalanceCard from "../components/dashboard/BalanceCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import FinanceChart from "../components/dashboard/FinanceChart";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Добро пожаловать в FinTrack 👋</h1>
        <p className="text-gray-600 text-lg">Ваша личная финансовая панель управления</p>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-2 card-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">💼 Ваш баланс</h2>
          <BalanceCard />
        </div>

        {/* Recent Transactions Summary */}
        <div className="card-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📋 Последние операции</h2>
          <RecentTransactions />
        </div>
      </div>

      {/* Chart Section */}
      <div className="card-lg p-6 bg-white">
        <h2 className="text-lg font-bold text-gray-900 mb-4">📈 Аналитика</h2>
        <FinanceChart />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-3xl mb-2">💡</div>
          <h3 className="font-semibold mb-1">Совет</h3>
          <p className="text-sm opacity-90">Отслеживайте все свои расходы в одном месте</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold mb-1">Цели</h3>
          <p className="text-sm opacity-90">Установите финансовые цели и достигайте их</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold mb-1">Аналитика</h3>
          <p className="text-sm opacity-90">Анализируйте свои расходы с помощью графиков</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
