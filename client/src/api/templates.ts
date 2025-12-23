import { API_URL } from './config';

export interface Template {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category_id?: string;
  category_name?: string;
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

export const getTemplates = async (token: string): Promise<Template[]> => {
  const res = await fetch(`${API_URL}/templates`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
};

export const createTemplate = async (template: { name: string; amount: number; type: 'income' | 'expense'; category_id?: string }, token: string): Promise<Template> => {
  const res = await fetch(`${API_URL}/templates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(template),
  });
  if (!res.ok) throw new Error('Failed to create template');
  return res.json();
};

export const applyTemplate = async (id: string, token: string): Promise<Template> => {
  const res = await fetch(`${API_URL}/templates/${id}/use`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to apply template');
  return res.json();
};

export const deleteTemplate = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${API_URL}/templates/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete template');
};
