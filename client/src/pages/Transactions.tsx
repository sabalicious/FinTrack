import React from "react";
import TransactionItem from "../components/TransactionItem";

const Transactions: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <div className="grid gap-2">
        <TransactionItem title="Idk" amount={0} type="income" date={new Date}/>
        <TransactionItem title="Idk" amount={0} type="expense" date={new Date}/>
      </div>
    </div>
  );
};

export default Transactions;