import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction, Transaction } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";
import { useContext } from "react";
import { GoalsContext } from "../context/GoalsContext";
import TransactionItem from "../components/TransactionItem";
import { useAuth } from "../context/AuthContext";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { token } = useAuth();
  const goalsContext = useContext(GoalsContext);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const data = await getTransactions(token);
      console.log("✅ Transactions fetched:", data);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Failed to fetch transactions:", err);
      setTransactions([]);
    }
  };

  const handleAdd = async (newTx: { title: string; amount: number; type: "income" | "expense"; date: Date; category_id?: string }) => {
    if (!token) return;
    try {
      const tx = await addTransaction(
        { 
          ...newTx, 
          date: newTx.date.toISOString(),
          category_id: newTx.category_id 
        },
        token
      );
      setTransactions([tx, ...transactions]);
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) return;
    
    try {
      await deleteTransaction(id, token);
      setTransactions(transactions.filter(tx => tx.id !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      alert('Ошибка при удалении транзакции');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Транзакции</h2>
      <TransactionForm onAdd={handleAdd} />
      <ul className="flex flex-col gap-2">
        {transactions.map(tx => { 
          const txDate = tx.date ? new Date(tx.date) : new Date();
          return (
            <TransactionItem
              key={tx.id}
              id={tx.id}
              title={tx.title || "Без названия"}
              amount={tx.amount || 0}
              type={tx.type || "income"}
              date={txDate}
              category_name={tx.category_name}
              onDelete={handleDelete}
            />
          );
        })}
      </ul>
    </div>
  );
}
