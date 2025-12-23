import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions, Transaction } from '../api/transactions';
import { getCategories, Category, createDefaultCategories } from '../api/categories';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Analytics() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingCategories, setCreatingCategories] = useState(false);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [txData, catData] = await Promise.all([
        getTransactions(token),
        getCategories(token)
      ]);
      setTransactions(txData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefaultCategories = async () => {
    if (!token) return;
    setCreatingCategories(true);
    try {
      await createDefaultCategories(token);
      await loadData(); // Перезагрузить данные
      alert('Категории успешно созданы!');
    } catch (err) {
      console.error(err);
      alert('Ошибка при создании категорий');
    } finally {
      setCreatingCategories(false);
    }
  };

  // Фильтрация по периоду
  const filterByPeriod = (txs: Transaction[]) => {
    const now = new Date();
    const startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    return txs.filter(tx => {
      const txDate = new Date(tx.date || tx.date_created || new Date());
      return txDate >= startDate;
    });
  };

  const filteredTransactions = filterByPeriod(transactions);

  // Фильтрация по категории
  const categoryFilteredTransactions = selectedCategory === 'all' 
    ? filteredTransactions 
    : filteredTransactions.filter(tx => tx.category_id === selectedCategory);

  // Расходы по категориям
  const expensesByCategory = categoryFilteredTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      const categoryId = tx.category_id || 'uncategorized';
      const category = categories.find(c => c.id === categoryId);
      const categoryName = category?.name || tx.category_name || 'Без категории';
      acc[categoryName] = (acc[categoryName] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value: Math.round(value)
  })).sort((a, b) => b.value - a.value);

  // Доходы vs Расходы
  const totalIncome = categoryFilteredTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = categoryFilteredTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome - totalExpense;

  const incomeExpenseData = [
    { name: 'Доходы', value: Math.round(totalIncome), fill: '#22c55e' },
    { name: 'Расходы', value: Math.round(totalExpense), fill: '#ef4444' }
  ];

  // Цвета для категорий
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#f97316'];

  const periodLabels = {
    week: 'Неделя',
    month: 'Месяц',
    year: 'Год'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Аналитика</h2>
        
        <div className="flex gap-2 flex-wrap">
          {/* Фильтр по периоду */}
          {(['week', 'month', 'year'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded transition ${
                period === p 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Фильтр по категории */}
      {categories.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-md border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Фильтр по категории:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.type === 'income' ? 'Доход' : 'Расход'})
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Загрузка...</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-gray-500">Нет данных за выбранный период</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Общая статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-sm text-green-700 font-medium mb-1">Доходы</div>
              <div className="text-3xl font-bold text-green-600">{totalIncome.toFixed(0)} ₽</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
              <div className="text-sm text-red-700 font-medium mb-1">Расходы</div>
              <div className="text-3xl font-bold text-red-600">{totalExpense.toFixed(0)} ₽</div>
            </div>
            
            <div className={`p-6 rounded-xl border ${balance >= 0 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'}`}>
              <div className={`text-sm font-medium mb-1 ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Баланс</div>
              <div className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {balance >= 0 ? '+' : ''}{balance.toFixed(0)} ₽
              </div>
            </div>
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Доходы vs Расходы */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
              <h3 className="text-lg font-semibold mb-4">Доходы и Расходы</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {incomeExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Расходы по категориям */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
              <h3 className="text-lg font-semibold mb-4">Расходы по категориям</h3>
              {categoryData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Нет расходов за период</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value} ₽`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Топ категорий по расходам */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4">Топ категорий по расходам</h3>
            <div className="space-y-3">
              {categoryData.slice(0, 5).map((cat, index) => {
                const percentage = (cat.value / totalExpense) * 100;
                return (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-gray-600">{cat.value} ₽</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Список всех категорий */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <h3 className="text-lg font-semibold mb-4">Все категории</h3>
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📂</div>
                <div className="text-gray-500 mb-4">Категории не найдены</div>
                <button
                  onClick={handleCreateDefaultCategories}
                  disabled={creatingCategories}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {creatingCategories ? 'Создание...' : 'Создать базовые категории'}
                </button>
                <div className="text-xs text-gray-400 mt-2">
                  Будут созданы категории: Продукты, Транспорт, Развлечения и др.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map(cat => {
                  // Считаем сумму по категории
                  const categorySum = filteredTransactions
                    .filter(tx => tx.category_id === cat.id && tx.type === cat.type)
                    .reduce((sum, tx) => sum + tx.amount, 0);
                  
                  const categoryCount = filteredTransactions
                    .filter(tx => tx.category_id === cat.id)
                    .length;

                  return (
                    <div 
                      key={cat.id} 
                      className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                        selectedCategory === cat.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-800">{cat.name}</div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          cat.type === 'income' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {cat.type === 'income' ? 'Доход' : 'Расход'}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {categorySum > 0 ? categorySum.toFixed(0) : '0'} ₽
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {categoryCount} {categoryCount === 1 ? 'транзакция' : categoryCount < 5 ? 'транзакции' : 'транзакций'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
