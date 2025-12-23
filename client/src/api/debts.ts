import { API_URL } from './config';

export interface Debt {
  id: string;
  user_id: string;
  person_name: string;
  amount: number;
  type: 'i_owe' | 'owes_me';
  description?: string;
  is_paid: boolean;
  due_date?: string;
  created_at: string;
}

export const getDebts = async (token: string): Promise<Debt[]> => {
  const res = await fetch(`${API_URL}/debts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch debts');
  return res.json();
};

export const createDebt = async (debt: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'is_paid'>, token: string): Promise<Debt> => {
  const res = await fetch(`${API_URL}/debts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(debt),
  });
  if (!res.ok) throw new Error('Failed to create debt');
  return res.json();
};

export const updateDebt = async (debt: Debt, token: string): Promise<Debt> => {
  const res = await fetch(`${API_URL}/debts/${debt.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(debt),
  });
  if (!res.ok) throw new Error('Failed to update debt');
  return res.json();
};

export const deleteDebt = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${API_URL}/debts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete debt');
};
