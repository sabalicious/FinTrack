import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrencies, Currency } from "../api/currencies";

const CurrencyRates: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    
    setLoading(true);
    getCurrencies(token)
      .then((data) => {
        setCurrencies(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch currencies:', err);
        setError("Не удалось получить курсы");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-sm">Загрузка курсов...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!currencies || currencies.length === 0) return null;

  // Show only USD and EUR if available
  const displayedCodes = ['USD', 'EUR'];
  const displayedCurrencies = currencies.filter(c => displayedCodes.includes(c.code));

  return (
    <ul className="flex gap-4 text-sm font-medium items-center">
      {displayedCurrencies.map((currency) => (
        <li key={currency.id}>
          {currency.code}: {currency.exchange_rate.toFixed(2)} {currency.symbol}
        </li>
      ))}
    </ul>
  );
};

export default CurrencyRates;
