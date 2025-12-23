import { API_URL } from './config';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  date_created?: string;
  category_name?: string;
  category_id?: string;
}

// Получить транзакции
export const getTransactions = async (token: string): Promise<Transaction[]> => {
  const res = await fetch(`${API_URL}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  console.log(`📡 Response status: ${res.status}`);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`❌ Error response: ${errorText}`);
    throw new Error(`Failed to fetch transactions: ${res.status} ${errorText}`);
  }
  
  const data = await res.json();
  console.log(`📦 Raw data from server:`, data);
  
  const mapped = data.map((tx: any) => ({
    ...tx,
    date: tx.date_created || tx.date, // поддерживаем оба варианта названия поля
  }));
  console.log(`✅ Mapped data:`, mapped);
  
  return mapped;
};

// Добавить транзакцию
export const addTransaction = async (
  tx: { title: string; amount: number; type: "income" | "expense"; date: string; category_id?: string },
  token: string
): Promise<Transaction> => {
  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tx),
  });
  
  if (!res.ok) {
    throw new Error('Failed to add transaction');
  }
  
  const data = await res.json();
  return { ...data, date: data.date_created || data.date };
};

// Удалить транзакцию
export const deleteTransaction = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete transaction');
  }
};
