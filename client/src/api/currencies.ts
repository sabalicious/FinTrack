import { API_URL } from './config';

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
}

export const getCurrencies = async (token: string): Promise<Currency[]> => {
  const res = await fetch(`${API_URL}/currencies`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.map((c: any) => ({
    ...c,
    exchange_rate: typeof c.exchange_rate === 'string' ? parseFloat(c.exchange_rate) : c.exchange_rate
  }));
};
