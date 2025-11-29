export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string; // здесь будет строка, конвертируем в Date на фронте
}

// Получить транзакции
export const getTransactions = async (token: string) => {
  const res = await fetch("http://localhost:3001/api/transactions", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  // мапим date_created -> date
  return data.map((tx: any) => ({
    ...tx,
    date: tx.date_created, // <-- ключ совпадает с интерфейсом
  }));
};

// Добавить транзакцию
export const addTransaction = async (
  tx: { title: string; amount: number; type: "income" | "expense"; date: string },
  token: string
) => {
  const res = await fetch("http://localhost:3001/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tx),
  });
  const data = await res.json();
  // мапим date_created -> date
  return { ...data, date: data.date_created };
};
