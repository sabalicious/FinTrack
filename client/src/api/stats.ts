import { API_URL } from './config';

export const getStats = async (token: string) => {
  const res = await fetch(`${API_URL}/stats`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
