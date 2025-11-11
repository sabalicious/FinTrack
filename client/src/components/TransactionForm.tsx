import React, { useState } from "react";
import { nanoid } from "nanoid";

interface TransactionType {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
}

interface TransactionFormProps {
  onAdd: (transaction: TransactionType) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [date, setDate] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date) return;

    const newTransaction: TransactionType = {
      id: nanoid(),
      title,
      amount: Number(amount),
      type,
      date: new Date(date),
    };

    onAdd(newTransaction);

    setTitle("");
    setAmount(0);
    setType("income");
    setDate("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded flex flex-col gap-2">
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)} 
        className="border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Сумма"
        value={amount}
        onChange={(e) => setAmount(e.target.valueAsNumber)}
        className="border p-2 rounded"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "income" | "expense")}
        className="border p-2 rounded"
      >
        <option value="income">Доход</option>
        <option value="expense">Расход</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Добавить транзакцию
      </button>
    </form>
  )
};

export default TransactionForm;