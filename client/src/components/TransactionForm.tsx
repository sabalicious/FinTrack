import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCategories, Category } from "../api/categories";

interface TransactionFormProps {
  onAdd: (transaction: {
    title: string;
    amount: number;
    type: "income" | "expense";
    date: Date;
    category_id?: string;
  }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!token) return;
    getCategories(token)
      .then(setCategories)
      .catch(err => console.error('Failed to load categories:', err));
  }, [token]);

  // Фильтруем категории по типу транзакции
  const filteredCategories = categories.filter(cat => cat.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    // Если дата не указана, ставим сегодняшнюю
    const txDate = date ? new Date(date) : new Date();

    onAdd({
      title,
      amount: Number(amount),
      type,
      date: txDate,
      category_id: categoryId || undefined,
    });

    setTitle("");
    setAmount("");
    setType("expense");
    setDate("");
    setCategoryId("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white border rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">Новая транзакция</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        
        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as "income" | "expense");
            setCategoryId(""); // Сброс категории при смене типа
          }}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="expense">Расход</option>
          <option value="income">Доход</option>
        </select>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Без категории</option>
          {filteredCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold"
      >
        Добавить транзакцию
      </button>
    </form>
  );
};

export default TransactionForm;
