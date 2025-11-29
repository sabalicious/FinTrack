import React, { useEffect, useState } from "react";
import { getTransactions, addTransaction, Transaction } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";
import TransactionItem from "../components/TransactionItem";

const token = localStorage.getItem("token") || "";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  const handleAdd = async (newTx: { title: string; amount: number; type: "income" | "expense"; date: Date }) => {
    try {
      console.log("Отправляем на backend:", {
        title: newTx.title,
        amount: newTx.amount,
        type: newTx.type,
        date: newTx.date.toISOString(),
      });

      const tx = await addTransaction(
        { ...newTx, date: newTx.date.toISOString() },
        token
      );

      console.log("Ответ от backend:", tx);

      const safeTx = {
        ...tx,
        date: tx.date ? new Date(tx.date) : new Date(),
      };

      setTransactions([safeTx, ...transactions]);
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
      <TransactionForm onAdd={handleAdd} />
      <ul className="flex flex-col gap-2">
        {transactions.map(tx => { 
          const txDate = tx.date ? new Date(tx.date) : new Date();
          return (
            <TransactionItem
              key={tx.id}
              title={tx.title || "Без названия"}
              amount={tx.amount || 0}
              type={tx.type || "income"}
              date={txDate}
            />
          );
        })}
      </ul>
    </div>
  );
}
