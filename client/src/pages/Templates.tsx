import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTemplates, createTemplate, deleteTemplate, applyTemplate, Template } from '../api/templates';
import { getCategories, Category } from '../api/categories';

export default function Templates() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category_id: ''
  });

  useEffect(() => {
    if (token) {
      fetchTemplates();
      fetchCategories();
    }
  }, [token]);

  const fetchTemplates = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getTemplates(token);
      setTemplates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!token) return;
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.name || !formData.amount) return;

    try {
      const newTemplate = await createTemplate({
        name: formData.name,
        amount: Number(formData.amount),
        type: formData.type,
        category_id: formData.category_id || undefined
      }, token);
      setTemplates([newTemplate, ...templates]);
      setFormData({ name: '', amount: '', type: 'expense', category_id: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUseTemplate = async (template: Template) => {
    if (!token) return;
    try {
      const updatedTemplate = await applyTemplate(template.id, token);
      alert(`Шаблон "${template.name}" готов к использованию! Перейдите на страницу транзакций.`);
      setTemplates(templates.map(t => t.id === template.id ? updatedTemplate : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm('Удалить этот шаблон?')) return;
    try {
      await deleteTemplate(id, token);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Шаблоны транзакций</h2>

      {/* Форма создания */}
      <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Создать шаблон</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Название (например, 'Кофе Starbucks')"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
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
            onChange={e => setFormData({ ...formData, type: e.target.value as 'income' | 'expense', category_id: '' })}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
          <select
            value={formData.category_id}
            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Без категории</option>
            {filteredCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold">
          Создать шаблон
        </button>
      </form>

      {/* Список шаблонов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <div key={template.id} className={`p-4 rounded-xl border-2 ${template.type === 'expense' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                {template.category_name && (
                  <span className="inline-block px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded mt-1">
                    {template.category_name}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${template.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                  {template.amount.toFixed(0)} ₽
                </div>
                <div className="text-xs text-gray-500">
                  Использован {template.usage_count} раз
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleUseTemplate(template)}
                className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Использовать
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          Нет шаблонов
        </div>
      )}
    </div>
  );
}
