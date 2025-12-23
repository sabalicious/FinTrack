import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions, Transaction } from '../api/transactions';

export default function Planning() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getTransactions(token)
      .then(setTransactions)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  // Статистика за последние 30 дней
  const last30Days = transactions.filter(tx => {
    const txDate = new Date(tx.date || tx.date_created || new Date());
    const now = new Date();
    const diff = now.getTime() - txDate.getTime();
    return diff <= 30 * 24 * 60 * 60 * 1000;
  });

  const avgDailyExpense = last30Days
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0) / 30;

  const avgDailyIncome = last30Days
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0) / 30;

  // Прогноз на следующий месяц
  const forecastExpense = avgDailyExpense * 30;
  const forecastIncome = avgDailyIncome * 30;
  const forecastBalance = forecastIncome - forecastExpense;

  // Расчет экономии
  const savingsRate = avgDailyIncome > 0 ? ((avgDailyIncome - avgDailyExpense) / avgDailyIncome) * 100 : 0;

  // Рекомендации
  const recommendations = [];
  
  if (savingsRate < 10) {
    recommendations.push({
      icon: '⚠️',
      title: 'Низкий уровень сбережений',
      text: 'Вы сберегаете менее 10% дохода. Рекомендуется откладывать минимум 10-20%.',
      type: 'warning' as const
    });
  } else if (savingsRate > 30) {
    recommendations.push({
      icon: '🎉',
      title: 'Отличная финансовая дисциплина!',
      text: `Вы сберегаете ${savingsRate.toFixed(0)}% от дохода. Продолжайте в том же духе!`,
      type: 'success' as const
    });
  }

  if (avgDailyExpense > avgDailyIncome) {
    recommendations.push({
      icon: '🚨',
      title: 'Расходы превышают доходы',
      text: 'Необходимо сократить расходы или найти дополнительные источники дохода.',
      type: 'danger' as const
    });
  }

  if (forecastBalance > 0 && savingsRate >= 10) {
    const monthsToGoal = {
      emergency: Math.ceil((avgDailyIncome * 90) / (forecastBalance)),
      vacation: Math.ceil(50000 / (forecastBalance))
    };
    
    recommendations.push({
      icon: '🎯',
      title: 'Цели достижимы',
      text: `При текущем темпе накоплений вы создадите финансовую подушку за ${monthsToGoal.emergency} мес., накопите на отпуск за ${monthsToGoal.vacation} мес.`,
      type: 'info' as const
    });
  }

  const typeColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Планирование</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Загрузка...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📈</div>
          <div className="text-gray-500">Добавьте транзакции для получения прогнозов</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Прогноз на месяц */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4">Прогноз на следующий месяц</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-700 mb-1">Ожидаемые доходы</div>
                <div className="text-2xl font-bold text-green-600">
                  +{Math.round(forecastIncome)} ₽
                </div>
                <div className="text-xs text-green-600 mt-1">
                  ~{Math.round(avgDailyIncome)} ₽/день
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-sm text-red-700 mb-1">Ожидаемые расходы</div>
                <div className="text-2xl font-bold text-red-600">
                  -{Math.round(forecastExpense)} ₽
                </div>
                <div className="text-xs text-red-600 mt-1">
                  ~{Math.round(avgDailyExpense)} ₽/день
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${forecastBalance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className={`text-sm mb-1 ${forecastBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                  Прогноз баланса
                </div>
                <div className={`text-2xl font-bold ${forecastBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {forecastBalance >= 0 ? '+' : ''}{Math.round(forecastBalance)} ₽
                </div>
                <div className={`text-xs mt-1 ${forecastBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  Сбережения: {savingsRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Финансовое здоровье */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4">Финансовое здоровье</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Уровень сбережений</span>
                  <span className="font-semibold">{savingsRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      savingsRate < 10 ? 'bg-red-500' : 
                      savingsRate < 20 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(savingsRate, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Рекомендуемый уровень: 10-20%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Текущая экономия</div>
                  <div className="text-xl font-bold">
                    {Math.round((avgDailyIncome - avgDailyExpense) * 30)} ₽/мес
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Рекомендуемая экономия (20%)</div>
                  <div className="text-xl font-bold">
                    {Math.round(forecastIncome * 0.2)} ₽/мес
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Рекомендации */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4">Рекомендации</h3>
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">👍</div>
                Ваши финансы в порядке!
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${typeColors[rec.type]}`}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{rec.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{rec.title}</div>
                        <div className="text-sm">{rec.text}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
