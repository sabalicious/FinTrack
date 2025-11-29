import { API_URL } from './config';

export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  created_at: string; 
}

export const getGoals = async (token: string): Promise<Goal[]> => {
  const res = await fetch(`${API_URL}/goals`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const addGoal = async (goal: Partial<Goal>, token: string): Promise<Goal> => {
  const res = await fetch(`${API_URL}/goals`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goal),
  });
  return res.json();
};

export const updateGoal = async (goal: Goal, token: string): Promise<Goal> => {
  const res = await fetch(`${API_URL}/goals/${goal.id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(goal),
  });
  return res.json();
};

export const deleteGoal = async (id: string, token: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_URL}/goals/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
