import { API_URL } from './config';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  type: 'note' | 'reminder' | 'plan';
  priority: 'low' | 'medium' | 'high';
  related_goal_id?: string;
  goal_title?: string;
  is_completed: boolean;
  due_date?: string;
  created_at: string;
}

export const getNotes = async (token: string): Promise<Note[]> => {
  const res = await fetch(`${API_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
};

export const createNote = async (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'is_completed' | 'goal_title'>, token: string): Promise<Note> => {
  const res = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
};

export const updateNote = async (note: Note, token: string): Promise<Note> => {
  const res = await fetch(`${API_URL}/notes/${note.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
};

export const deleteNote = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete note');
};
