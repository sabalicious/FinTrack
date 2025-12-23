import { API_URL } from './config';

export interface Category {
  id: string;
  user_id?: string;
  name: string;
  type: string;
}

export const getCategories = async (token: string): Promise<Category[]> => {
  const res = await fetch(`${API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const createCategory = async (category: { name: string; type: string }, token: string): Promise<Category> => {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(category)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const createDefaultCategories = async (token: string): Promise<void> => {
  const defaultCategories = [
    { name: 'Продукты', type: 'expense' },
    { name: 'Транспорт', type: 'expense' },
    { name: 'Развлечения', type: 'expense' },
    { name: 'Здоровье', type: 'expense' },
    { name: 'Образование', type: 'expense' },
    { name: 'Коммунальные услуги', type: 'expense' },
    { name: 'Одежда', type: 'expense' },
    { name: 'Зарплата', type: 'income' },
    { name: 'Подработка', type: 'income' },
    { name: 'Инвестиции', type: 'income' }
  ];

  for (const cat of defaultCategories) {
    await createCategory(cat, token);
  }
};
