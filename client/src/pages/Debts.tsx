import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDebts, createDebt, updateDebt, deleteDebt, Debt } from '../api/debts';

export default function Debts() {
  const { token } = useAuth();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    person_name: '',
    amount: '',
    type: 'owes_me' as 'i_owe' | 'owes_me',
    description: '',
    due_date: ''
  });

  useEffect(() => {
    if (token) fetchDebts();
  }, [token]);

  const fetchDebts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getDebts(token);
      setDebts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.person_name || !formData.amount) return;

    try {
      const newDebt = await createDebt({
        person_name: formData.person_name,
        amount: Number(formData.amount),
        type: formData.type,
        description: formData.description,
        due_date: formData.due_date || undefined
      }, token);
      setDebts([newDebt, ...debts]);
      setFormData({ person_name: '', amount: '', type: 'owes_me', description: '', due_date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePaid = async (debt: Debt) => {
    if (!token) return;
    try {
      const updated = await updateDebt({ ...debt, is_paid: !debt.is_paid }, token);
      setDebts(debts.map(d => d.id === debt.id ? updated : d));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm('Удалить этот долг?')) return;
    try {
      await deleteDebt(id, token);
      setDebts(debts.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unpaidDebts = debts.filter(d => !d.is_paid);
  const iOweTotal = unpaidDebts.filter(d => d.type === 'i_owe').reduce((sum, d) => sum + d.amount, 0);
  const owesMeTotal = unpaidDebts.filter(d => d.type === 'owes_me').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Долги и займы</h2>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl">
          <div className="text-red-600 text-sm font-medium">Я должен</div>
          <div className="text-3xl font-bold text-red-700">{iOweTotal.toFixed(0)} ₽</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl">
          <div className="text-green-600 text-sm font-medium">Мне должны</div>
          <div className="text-3xl font-bold text-green-700">{owesMeTotal.toFixed(0)} ₽</div>
        </div>
      </div>

      {/* Форма добавления */}
      <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Добавить долг</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Имя человека"
            value={formData.person_name}
            onChange={e => setFormData({ ...formData, person_name: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            placeholder="Сумма"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value as 'i_owe' | 'owes_me' })}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="owes_me">Мне должны</option>
            <option value="i_owe">Я должен</option>
          </select>
          <input
            type="date"
            placeholder="Срок возврата"
            value={formData.due_date}
            onChange={e => setFormData({ ...formData, due_date: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Описание"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold">
          Добавить
        </button>
      </form>

      {/* Список долгов */}
      <div className="space-y-3">
        {debts.map(debt => (
          <div key={debt.id} className={`p-4 rounded-xl border-2 ${debt.is_paid ? 'bg-gray-50 border-gray-200 opacity-60' : debt.type === 'i_owe' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={debt.is_paid}
                    onChange={() => handleTogglePaid(debt)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div>
                    <div className={`font-semibold text-lg ${debt.is_paid ? 'line-through text-gray-500' : ''}`}>
                      {debt.person_name}
                    </div>
                    <div className="text-sm text-gray-600">{debt.description}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`text-2xl font-bold ${debt.type === 'i_owe' ? 'text-red-600' : 'text-green-600'}`}>
                    {debt.amount.toFixed(0)} ₽
                  </div>
                  {debt.due_date && (
                    <div className="text-xs text-gray-500">
                      До {new Date(debt.due_date).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(debt.id)}
                  className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {debts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">💰</div>
          Нет долгов
        </div>
      )}
    </div>
  );
}
