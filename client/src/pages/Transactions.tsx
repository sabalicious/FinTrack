import React, { useState } from "react";
import { nanoid} from "nanoid";
import TransactionItem from "../components/TransactionItem";
import TransactionForm from "../components/TransactionForm";

interface TransactionType {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([
    {
      id: nanoid(),
      title: "Salary",
      amount: 3000,
      type: "income",
      date: new Date(),
    },
    {
      id: nanoid(),
      title: "Lunch",
      amount: 20,
      type: "expense",
      date: new Date(),
    }
  ]);

  const addTransaction = (newTransaction: TransactionType) => {
    setTransactions([...transactions, newTransaction]);
  }

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <TransactionForm onAdd={addTransaction}/>
      <ul>
        {transactions.map(({ id, title, amount, type, date }) => {
          return <TransactionItem
            key={id}
            title={title}
            amount={amount}
            type={type}
            date={date}
          />
        })}
      </ul>
    </section>
  );
};

export default Transactions;